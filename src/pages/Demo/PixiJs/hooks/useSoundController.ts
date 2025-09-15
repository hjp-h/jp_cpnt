import { Howl } from "howler";
import { useRef, useCallback, useEffect, useState } from "react";
import { useIsEnableSound } from "./useIsEnableSound";
import { useLatest } from "ahooks";
interface SoundController {
  play: () => void;
  pause: () => void;
  stop: () => void;
  setVolume: (volume: number) => void;
  setRate: (rate: number) => void;
  seek: (position: number) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  isPlaying: boolean;
  isLoading: boolean;
  volume: number;
  rate: number;
}

export const useSoundController = (
  url: string,
  isLoop = false,
  defaultVolume = 1
): SoundController => {
  const isHide = false;
  const { isEnableSound } = useIsEnableSound();
  const howlRef = useRef<Howl | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolumeState] = useState(defaultVolume);
  const [rate, setRateState] = useState(1);
  const [isFirstPlay, setIsFirstPlay] = useState(true);
  const isNeedToPlayWhenFinishedLoading = useRef(false);
  const latestIsEnableSound = useLatest(isEnableSound);

  // 初始化音频实例，仅在 URL 或循环标记变化时重建，避免在音量/速率变化时重建实例
  useEffect(() => {
    if (!url) return;
    setIsLoading(true);

    // 清理之前的实例
    if (howlRef.current) {
      try {
        howlRef.current.unload();
      } catch {
        // ignore
      }
    }

    // 创建主音频实例
    howlRef.current = new Howl({
      src: [url],
      volume: volume,
      rate: rate,
      loop: isLoop,
      // 关键：强制使用 HTML5 Audio，避免 WebAudio/AudioContext 在 MIUI WebView 中引发的原生崩溃
      html5: true,
      // preload 默认 true；保留默认行为即可
      onload: () => {
        setIsLoading(false);
      },
      onloaderror: (id, error) => {
        console.error("onloaderror", id, error);
        setIsLoading(false);
      },
      onplay: () => {
        setIsPlaying(true);
      },
      onplayerror: () => {
        // 遇到播放错误时尝试恢复，避免异常状态
        try {
          howlRef.current?.once("unlock", () => {
            howlRef.current?.play();
          });
        } catch {
          // ignore
        }
      },
      onpause: () => {
        setIsPlaying(false);
      },
      onstop: () => {
        setIsPlaying(false);
      },
      onend: () => {
        setIsPlaying(false);
      },
    });

    return () => {
      // 组件卸载时清理资源
      if (howlRef.current) {
        try {
          howlRef.current.unload();
        } finally {
          howlRef.current = null;
        }
      }
    };
  }, [url, isLoop]);

  const latestIsHide = useLatest(isHide);
  // 播放音频
  const play = useCallback(() => {
    if (!latestIsEnableSound.current) return;
    if (latestIsHide.current) return;
    if (isLoading) {
      isNeedToPlayWhenFinishedLoading.current = true;
    }
    if (howlRef.current && !isLoading) {
      try {
        howlRef.current.play();
      } catch {
        // ignore
      }
    }
  }, [isLoading]);

  useEffect(() => {
    if (isNeedToPlayWhenFinishedLoading.current) {
      play();
      isNeedToPlayWhenFinishedLoading.current = false;
    }
  }, [play]);

  // 暂停音频
  const pause = useCallback(() => {
    if (isNeedToPlayWhenFinishedLoading.current) {
      isNeedToPlayWhenFinishedLoading.current = false;
    }
    if (howlRef.current) {
      try {
        howlRef.current.pause();
      } catch {
        // ignore
      }
    }
  }, []);

  // 停止音频
  const stop = useCallback(() => {
    if (isNeedToPlayWhenFinishedLoading.current) {
      isNeedToPlayWhenFinishedLoading.current = false;
    }
    if (howlRef.current) {
      try {
        howlRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsFirstPlay(true);
  }, []);

  // 设置音量 (0-1)
  const setVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clampedVolume);
    if (howlRef.current) {
      try {
        howlRef.current.volume(clampedVolume);
      } catch {
        // ignore
      }
    }
  }, []);

  // 设置播放速率
  const setRate = useCallback((newRate: number) => {
    const clampedRate = Math.max(0.5, Math.min(4, newRate));
    setRateState(clampedRate);
    if (howlRef.current) {
      try {
        howlRef.current.rate(clampedRate);
      } catch {
        // ignore
      }
    }
  }, []);

  // 跳转到指定位置 (秒)
  const seek = useCallback((position: number) => {
    if (howlRef.current) {
      try {
        howlRef.current.seek(position);
      } catch {
        // ignore
      }
    }
  }, []);

  // 获取当前播放时间
  const getCurrentTime = useCallback((): number => {
    if (howlRef.current && howlRef.current.playing()) {
      return (howlRef.current.seek() as number) || 0;
    }
    return 0;
  }, []);

  // 获取音频总时长
  const getDuration = useCallback((): number => {
    if (howlRef.current) {
      return howlRef.current.duration() || 0;
    }
    return 0;
  }, []);

  return {
    play,
    pause,
    stop,
    setVolume,
    setRate,
    seek,
    getCurrentTime,
    getDuration,
    isPlaying,
    isLoading,
    volume,
    rate,
  };
};
