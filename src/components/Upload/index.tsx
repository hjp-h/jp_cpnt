import React, { useState, useRef } from "react";
import {
  Button,
  Progress,
  message,
  Upload as AntUpload,
  Modal,
  Row,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { SlideDown } from "react-slidedown";
import "react-slidedown/lib/slidedown.css";
import "./index.scss";
import axios from "axios";
import { calculateFileHash, CHUNK_SIZE } from "../../utils/file";

interface UploadChunkParams {
  i: number;
  file: File;
  fileHash: string;
  chunks: number;
  percentChunk: number;
  signal?: AbortSignal;
}

const BaseUrl = "http://127.0.0.1:8280/api";

const Upload = () => {
  const [uploadPercent, setUploadPercent] = useState(0);
  const [isPaused, setIsPaused] = useState(false); // 暂停状态
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null); // 取消控制器
  const currentFileRef = useRef<File | null>(null); // 存储当前文件，用于恢复上传

  const chunkSize = CHUNK_SIZE; // 切片大小
  let uploadCurrentChunk = 0; // 上传，当前切片

  /**
   * 校验文件
   * @param {*} fileName 文件名
   * @param {*} fileHash md5文件
   * @returns
   */
  const checkFileMD5 = (fileName: string, fileHash: string) => {
    const url =
      BaseUrl +
      "/check/file?fileName=" +
      fileName +
      "&fileMd5Value=" +
      fileHash;
    return axios.get(url);
  };

  // 上传chunk
  function upload({
    i,
    file,
    fileHash,
    chunks,
    percentChunk,
    signal,
  }: UploadChunkParams) {
    //构造一个表单，FormData是HTML5新增的
    const end =
      (i + 1) * chunkSize >= file.size ? file.size : (i + 1) * chunkSize;
    const form = new FormData();
    form.append("data", file.slice(i * chunkSize, end), file.name); //file对象的slice方法用于切出文件的一部分
    form.append("total", chunks.toString()); //总片数
    form.append("index", i.toString()); //当前是第几片
    form.append("fileMd5Value", fileHash);
    return axios({
      method: "post",
      url: BaseUrl + "/uploadFile",
      data: form,
      signal, // 传递取消信号
      timeout: 12000,
    }).then((rst) => {
      const data = rst?.data?.data;
      if (data?.stat) {
        uploadCurrentChunk = uploadCurrentChunk + 1;
        const percent = Math.ceil((uploadCurrentChunk / percentChunk) * 100);
        setUploadPercent(percent);
      }
    });
  }

  /**
   * 上传chunk
   * @param {*} fileHash
   * @param {*} chunkList
   */
  async function checkAndUploadChunk(
    file: File,
    fileHash: string,
    chunkList: string[]
  ) {
    const chunks = Math.ceil(file.size / chunkSize);
    const requestList: UploadChunkParams[] = [];
    for (let i = 0; i < chunks; i++) {
      const exit = chunkList?.indexOf(i + "") > -1;
      // 如果不存在，则上传
      if (!exit) {
        requestList.push({
          i,
          file,
          fileHash,
          chunks,
          percentChunk: Number(
            Math.ceil(file.size / chunkSize) - chunkList.length
          ),
        });
      }
    }

    // 并发上传
    if (requestList?.length) {
      // 限制并发数为 3
      await sendRequests(requestList, 1);
    }
  }

  const uploadFile = async (file: File) => {
    uploadCurrentChunk = 0;
    setUploadPercent(0);
    setIsPaused(false);
    setLoading(true);

    // 保存当前文件，方便断点续传
    currentFileRef.current = file;
    // 初始化控制器
    abortControllerRef.current = new AbortController();

    try {
      // 1.校验文件，返回md5
      const fileHash = (await calculateFileHash(file)) as string;

      // 2.预检：获取已上传的分片列表（实现断点续传的关键）
      const rst = await checkFileMD5(file.name, fileHash);
      const data = rst?.data?.data as any;

      // 如果文件已存在, 就秒传
      if (data?.file?.isExist) {
        showModal({
          title: `文件已秒传`,
          data: data?.file,
          name: data?.file.name,
        });
        setUploadPercent(100); // 秒传直接 100%
        return;
      }
      // 3：检查并上传切片
      await checkAndUploadChunk(file, fileHash, data.chunkList);

      // 检查是否被取消，如果被取消则不发送合并请求
      if (abortControllerRef.current?.signal.aborted) return;

      // 4：通知服务器所有服务器分片已经上传完成
      await notifyServer(file, fileHash);
      setLoading(false);
      setIsPaused(false);
    } catch (e) {
      // 捕获 Cancel 错误，不弹窗报错
      setLoading(false);
      if (axios.isCancel(e)) {
        console.log("上传已暂停/取消");
        return;
      }
      throw e;
    }
  };

  /**
   * 所有的分片上传完成，准备合成
   * @param {*} file
   * @param {*} fileHash
   */
  const notifyServer = async (file: File, fileHash: string) => {
    const url =
      BaseUrl +
      "/merge?md5=" +
      fileHash +
      "&fileName=" +
      file.name +
      "&size=" +
      file.size;
    return await axios.get(url).then((rst) => {
      const data = rst?.data?.data;
      if (data?.stat) {
        showModal({
          title: `上传成功`,
          data: data,
          name: file.name,
        });
      } else {
        message.error("上传失败");
      }
    });
  };

  // 这里的 useEffect 监听原生 input change 事件已经不需要了，直接通过 antd 的 beforeUpload 触发
  // useEffect(() => { ... }, []);

  const uploadProps = {
    beforeUpload: (file: File) => {
      uploadFile(file);
      return false; // 阻止 antd 默认的 XHR 上传，使用我们自定义的分片上传
    },
    showUploadList: false, // 隐藏默认的文件列表，因为我们有自定义的进度条展示
  };

  const handleTogglePause = () => {
    if (isPaused) {
      // 继续上传
      setIsPaused(false);
      if (currentFileRef.current) {
        uploadFile(currentFileRef.current);
      }
    } else {
      // 暂停上传
      setIsPaused(true);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    }
  };

  const showModal = ({
    data,
    title,
    name,
  }: {
    data: any;
    title: string;
    name: string;
  }) => {
    // 本地文件服务器
    const link = `http://127.0.0.1:8080/` + name;

    Modal.info({
      className: "json-preview-wrapper",
      closable: true,
      width: 900,
      title: title,
      okText: "关闭",
      content: (
        <div className="json-preview">
          <pre>{JSON.stringify(data)}</pre>
          <Row align={`middle`} justify={`center`}>
            文件地址：
            <a href={link} target="_blank">
              {link}
            </a>
          </Row>
        </div>
      ),
      onOk() {},
    });
  };

  const sendRequests = async (
    tasks: UploadChunkParams[],
    limit: number = 3
  ) => {
    const pool: any = []; // 并发池
    for (const item of tasks) {
      // 如果已取消，停止派发新任务
      if (abortControllerRef.current?.signal.aborted) {
        break;
      }

      const { i, file, fileHash, chunks, percentChunk } = item;

      // 创建上传任务
      const task = upload({
        i,
        file,
        fileHash,
        chunks,
        percentChunk,
        signal: abortControllerRef.current?.signal, // 传递 signal
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
        try {
          await Promise.race(pool);
        } catch (e) {
          // 如果是取消导致的 reject，这里可以选择忽略或者抛出，
          // 但为了让 sendRequests 整体 await 能够结束，通常由外层捕获
          if (axios.isCancel(e)) throw e;
        }
        // await sleep(1000);
      }
    }
    // 循环结束后，等待池中剩余的所有任务完成
    await Promise.all(pool);
  };

  return (
    <div className="wrap">
      <div className="upload">
        <span>点击上传文件：</span>
        <AntUpload {...uploadProps}>
          <Button type="primary" icon={<UploadOutlined />}>
            上传
          </Button>
        </AntUpload>
      </div>
      {uploadPercent > 0 && (
        <SlideDown className={"my-dropdown-slidedown"}>
          <div className="uploading">
            上传文件进度：
            <Progress type="circle" percent={uploadPercent} />
          </div>
        </SlideDown>
      )}

      {(loading || isPaused) && (
        <div style={{ marginTop: 10 }}>
          <Button type="default" onClick={handleTogglePause}>
            {isPaused ? "继续上传" : "暂停上传"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Upload;
