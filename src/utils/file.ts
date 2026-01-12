import SparkMD5 from "spark-md5";
import axios from "axios";

// 分片大小 通常小文件（< 1GB）2 ~ 8MB
export const CHUNK_SIZE = 4 * 1024 * 1024; // 4MB

/**
 * 计算文件的 MD5 哈希值
 * @param {File} file 文件对象
 * @param {Function} onProgress 进度回调函数 (可选)
 * @returns {Promise<string>} 返回文件的 MD5 值
 */
export function calculateFileHash(
  file: File,
  onProgress?: (percent: number) => void
) {
  return new Promise((resolve, reject) => {
    // 参数校验
    if (!file) {
      reject(new Error("未选择文件"));
      return;
    }

    const fileSize = file.size;
    const spark = new SparkMD5.ArrayBuffer();
    const fileReader = new FileReader();
    const blobSlice = File.prototype.slice;

    let currentOffset = 0;

    // 内部递归读取函数
    const loadNextChunk = () => {
      const start = currentOffset;
      const end = Math.min(start + CHUNK_SIZE, fileSize);
      const chunk = blobSlice.call(file, start, end);
      fileReader.readAsArrayBuffer(chunk);
    };

    fileReader.onload = (e) => {
      // 增量计算
      if (e.target?.result instanceof ArrayBuffer) {
        spark.append(e.target.result);
      } else {
        console.warn("Read result is not ArrayBuffer");
      }
      currentOffset += CHUNK_SIZE;

      // 进度反馈
      if (typeof onProgress === "function") {
        const percent = Math.min(
          100,
          Math.round((currentOffset / fileSize) * 100)
        );
        onProgress(percent);
      }

      if (currentOffset < fileSize) {
        loadNextChunk();
      } else {
        // 完成计算
        const hash = spark.end();
        resolve(hash);
      }
    };

    fileReader.onerror = () => {
      spark.destroy();
      reject(new Error("文件读取失败"));
    };

    // 启动计算
    loadNextChunk();
  });
}

export async function uploadFile(file: File) {
  const fileSize = file.size;
  const chunksCount = Math.ceil(fileSize / CHUNK_SIZE);
  const fileHash = await calculateFileHash(file);

  // 1. 预检：获取已上传的分片列表（实现断点续传的关键）
  // 假设后端返回 { shouldUpload: boolean, uploadedList: [0, 1, 2] }
  const {
    data: { shouldUpload, uploadedList },
  } = await axios.get("/check/file", {
    params: { hash: fileHash, fileName: file.name },
  });

  if (!shouldUpload) {
    console.log("秒传成功！");
    // 再调用获取文件下载地址的接口
    // xxx
    return;
  }

  // 2. 构造分片数据并过滤已上传的片
  for (let i = 0; i < chunksCount; i++) {
    // 如果后端说这一片已经传过了，就跳过
    if (uploadedList.includes(i)) continue;

    const start = i * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, fileSize);
    const chunk = file.slice(start, end);

    // 构造 FormData
    const formData = new FormData();
    formData.append("chunk", chunk);
    formData.append("hash", fileHash as string); // 文件标识
    formData.append("index", i.toString()); // 当前片下标
    formData.append("name", file.name);

    // 创建上传任务
    const task = await axios.post("/uploadFile", formData, {
      // 可以在这里监听单个分片的进度
      onUploadProgress: (e) => {
        const total = e.total || 1;
        const progress = Math.round((e.loaded / total) * 100);
        console.log(`分片 ${i} 上传进度: ${progress}%`);
      },
    });
  }

  // 3. 发送校验请求获取上传情况
  const rst = await axios.post("/merge", {
    hash: fileHash,
    fileName: file.name,
    size: CHUNK_SIZE,
    ext: file.name.split(".").pop(),
  });

  console.log("文件上传并合并完成！", rst);
}

/**
 * 并发上传函数
 * @param {File} file 文件对象
 * @param {string} fileHash 之前计算出的 MD5
 */
export async function uploadFileXConcurrency(file: File) {
  const fileSize = file.size;
  const chunksCount = Math.ceil(fileSize / CHUNK_SIZE);
  const fileHash = (await calculateFileHash(file)) as string;

  // 1. 预检：获取已上传的分片列表（实现断点续传的关键）
  // 假设后端返回 { shouldUpload: boolean, uploadedList: [0, 1, 2] }
  const {
    data: { shouldUpload, uploadedList },
  } = await axios.get("/check/file", {
    params: { hash: fileHash, fileName: file.name },
  });

  if (!shouldUpload) {
    console.log("秒传成功！");
    // 再调用获取文件下载地址的接口
    // xxx
    return;
  }

  // 2. 构造分片数据并过滤已上传的片
  const requestList: any = [];
  for (let i = 0; i < chunksCount; i++) {
    // 如果后端说这一片已经传过了，就跳过
    if (uploadedList.includes(i)) continue;
    // 如果不存在，则上传
    requestList.push({
      i,
      file,
      fileHash,
      chunks: chunksCount,
      percentChunk: Number(chunksCount - uploadedList.length),
    });
  }

  // 执行并发控制
  await sendRequests(requestList);

  // 3. 发送校验请求获取上传情况
  const rst = await axios.post("/merge", {
    hash: fileHash,
    fileName: file.name,
    size: CHUNK_SIZE,
    ext: file.name.split(".").pop(),
  });

  console.log("文件上传并合并完成！", rst);
}

// 充分利用http2.0的特性多路复用 使用同一个tcp连接
// 为什么不“无限并发”？
// 既然异步好，为什么不一次发 100 个？
// 浏览器限制： HTTP/1.1 下同域名只有 6 个通道，多了也没用。
// TCP 争抢： 过多并发会导致每个请求分到的带宽变少，增加丢包率，反而可能变慢。

function upload({
  i,
  file,
  fileHash,
  chunks,
}: {
  i: number;
  file: File;
  fileHash: string;
  chunks: number;
  percentChunk: number;
}) {
  const start = i * CHUNK_SIZE;
  const end = Math.min(start + CHUNK_SIZE, file.size);
  const chunk = file.slice(start, end);

  const formData = new FormData();
  formData.append("chunk", chunk);
  formData.append("hash", fileHash);
  formData.append("index", i.toString());
  formData.append("name", file.name);
  formData.append("total", chunks.toString());

  return axios.post("/uploadFile", formData);
}

const sendRequests = async (tasks: any[], limit: number = 3) => {
  const pool: any = []; // 并发池
  for (const item of tasks) {
    const { i, file, fileHash, chunks, percentChunk } = item;

    // 创建上传任务
    const task = upload({
      i,
      file,
      fileHash,
      chunks,
      percentChunk,
    });

    // 包装任务：当任务完成后，从 pool 中移除自己
    // 注意：这里利用了 promise 链，p 是 task.then 返回的新 promise
    const p = task.then(async () => {
      const index = pool.indexOf(p);
      if (index > -1) {
        pool.splice(index, 1);
      }
    });

    pool.push(p);

    // 如果并发池已满，等待最快的一个任务完成（Promise.race）
    if (pool.length >= limit) {
      await Promise.race(pool);
      // await sleep(1000);
    }
  }
  // 循环结束后，等待池中剩余的所有任务完成
  await Promise.all(pool);
};
