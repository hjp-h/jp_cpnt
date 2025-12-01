import { useEffect, useMemo, useRef, useState } from "react";
import { Howl } from "howler";

// 通过静态导入让 Vite 正确打包音频资源
import song1 from "./audio/daoxiang.mp3";
import song2 from "./audio/wrong_love.mp3";

export default function HowlerDemo() {
  const [current, setCurrent] = useState<"song1" | "song2">("song1");
  const howlRef = useRef<Howl | null>(null);

  // 根据当前选择的音频创建/更新 Howl 实例
  const src = useMemo(() => (current === "song1" ? song1 : song2), [current]);
  const playButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // 如已存在旧实例，先卸载避免占用资源
    if (howlRef.current) {
      try {
        howlRef.current.unload();
      } catch (error) {
        console.error("卸载旧 Howl 实例时出错:", error);
      }
    }

    const h = new Howl({
      // 这里可传入多个音频文件类型 浏览器会自动选择第一个它支持的格式来播放
      src: [src],
      html5: true, // 某些移动浏览器对 Web Audio API 支持不完善 兼容移动端/大文件流式播放 大文件可以边下载边播放，不需要等待完全加载。
      preload: true,
      // sprite: {
      //   // 指定了切片时 播放需要传入切片的key
      //   // 对声音进行切片 offset duration loop
      //   sound1: [4000, 3000, true],
      // },
    });
    howlRef.current = h;

    // 加载完成后自动播放
    howlRef.current.once("load", function () {
      console.log("laod load");
      // 有用户交互才可以自动播放 可以监听用户点击行为之后就自动播放 或者先弹个窗啥的
      // h.play();
      playButtonRef.current?.click();

      // 播放指定的切片
      // h.play("sound1");
    });

    h.on("play", function () {
      console.log("开始播放");
    });

    h.on("end", function () {
      console.log("播放结束");
    });

    h.on("loaderror", function (id, error) {
      console.error("加载错误:", id, error);
    });

    h.on("playerror", function (id, error) {
      console.error("播放错误:", id, error);
    });

    // 两个播放实例互不影响
    // const id1 = h.play(); // 第一次播放，返回唯一ID
    // h.fade(1, 0, 1000, id1);
    // const id2 = h.play(); // 第二次播放，返回另一个唯一ID
    // 1.5倍速播放
    //  h.rate(1.5, id2);

    return () => {
      // 组件卸载时清理
      if (howlRef.current) {
        try {
          console.log("page unload");
          howlRef.current.stop();
          howlRef.current.unload();
        } catch (error) {
          console.error("卸载 Howl 实例时出错:", error);
        }
        howlRef.current = null;
      }
    };
  }, [src]);

  const handlePlay = () => {
    const h = howlRef.current;
    if (!h) return;
    // 若已在播放，先停止以确保重新从头播放
    if (h.playing()) {
      h.stop();
    }
    h.play();
  };

  const handlePause = () => {
    const h = howlRef.current;
    if (!h) return;
    // 若已在播放，先停止以确保重新从头播放
    // 暂停 下次调用play继续播放
    h.pause();
    // 停止 下次调用paly 从头开始播放
    // h.stop();
  };

  const handleSeek = () => {
    const h = howlRef.current;
    if (!h) return;
    // 跳转到第8秒
    const playId = h.play();
    setTimeout(() => {
      h.seek(30, playId);
    }, 100);
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Howler 音频播放示例</h2>

      <div style={{ marginBottom: 12 }}>
        <label style={{ marginRight: 8 }}>选择音频：</label>
        <select
          value={current}
          onChange={(e) => setCurrent(e.target.value as "song1" | "song2")}
        >
          <option value="song1">稻香（daoxiang.mp3）</option>
          <option value="song2">错爱（wrong_love.mp3）</option>
        </select>
      </div>

      <button ref={playButtonRef} onClick={handlePlay}>
        点击播放
      </button>
      <button onClick={handlePause}>暂停播放</button>
      <button onClick={handleSeek}>播放第8秒</button>
    </div>
  );
}
