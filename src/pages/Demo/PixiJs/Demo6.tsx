import React, { useEffect, useRef, useState } from "react";
import {
  AnimatedSprite,
  Application,
  Assets,
  Container,
  Sprite,
  Texture,
} from "pixi.js";
import "pixi.js/advanced-blend-modes";
import { initDevtools } from "@pixi/devtools";
import { Card, Spin } from "antd";
import {
  LINE_ANIMATION_CONFIG,
  LINE_RESOURCE,
  LineNo,
  SYMBOL_RESOURCE,
  MOCK_WIN_LINE,
  Cell,
  SYMBOL_BORDER_ANIMATION_CONFIG,
} from "./constants";
import bgm from "./resource/background.mp3";
import { useSoundController } from "./hooks/useSoundController";
import styles from "../index.module.scss";
import gsap from "gsap";
import { getSpriteFrames } from "./helper/getSpritsheets";

const ROWS = 3;
const COLS = 5;
const SYMBOL_HEIGHT = 120;
const SYMBOL_WIDTH = 120;
const MARGIN_X = 15;
const MARGIN_Y = 15;
const CONTAINER_WIDTH = COLS * (SYMBOL_WIDTH + MARGIN_X) - MARGIN_X;
const CONTAINER_HEIGHT = ROWS * (SYMBOL_HEIGHT + MARGIN_Y) - MARGIN_Y;
const EXTRA_ROWS = 27;
const Demo6: React.FC = () => {
  const pixiContainerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const symbolLen = SYMBOL_RESOURCE.length;

  const soundController = useSoundController(bgm);

  // 线条动画
  const animationLinesRef = useRef<{ sprite: AnimatedSprite; type: LineNo }[]>(
    []
  );
  const createLineAnimation = async (
    animation: (typeof LINE_ANIMATION_CONFIG)[number]
  ) => {
    const {
      spritesheet,
      rotateY,
      rotateX,
      getY,
      loopReverseDirection,
      speed = 0.5,
      type,
    } = animation;
    const app = appRef.current;
    if (!app) return;
    const frames = await getSpriteFrames(spritesheet);
    const heightWidthRate = frames[0].orig.height / frames[0].orig.width;

    const sprite = new AnimatedSprite(frames);
    animationLinesRef.current.push({ sprite, type });
    sprite.animationSpeed = speed;
    // sprite.play();
    sprite.visible = false;
    const canvasWidth = appRef.current?.screen?.width || 0;
    sprite.x = canvasWidth / 2;
    sprite.y = getY({
      app,
      SYMBOL_HEIGHT: SYMBOL_HEIGHT,
      MARGIN_Y: MARGIN_Y,
      SYMBOL_WIDTH: SYMBOL_WIDTH,
    });
    sprite.width = canvasWidth;
    sprite.height = heightWidthRate * canvasWidth;
    sprite.anchor.set(0.5);
    sprite.zIndex = 6;
    if (rotateY) {
      sprite.scale.y = -1;
    }
    if (rotateX) {
      sprite.scale.x = -1;
    }
    Object.assign(sprite, {
      _originScaleX: sprite.scale.x,
      _originScaleY: sprite.scale.y,
    });

    sprite.onLoop = () => {
      // 翻转方向
      sprite.scale.x *= -1;
      if (loopReverseDirection === "y") {
        sprite.scale.y *= -1;
      }
    };
    app.stage.addChild(sprite);
    return sprite;
  };
  const playLineAnimation = (type: LineNo) => {
    const line = animationLinesRef.current.find((item) => item.type === type);
    if (!line) return;
    line.sprite.visible = true;
    line.sprite.play();
  };

  // 图案动画 放大缩小及左右摇晃
  const symbolsRef = useRef<{ sprite: Sprite; row: number; col: number }[]>([]);
  const createSymbolBorderAnimation = async (
    animation: (typeof SYMBOL_BORDER_ANIMATION_CONFIG)[number],
    row: number,
    col: number
  ) => {
    const { spritesheet } = animation;
    const app = appRef.current;
    if (!app) return;
    const frames = await getSpriteFrames(spritesheet);
    const sprite = new AnimatedSprite(frames);
    sprite.animationSpeed = 0.5;
    sprite.play();
    sprite.x =
      (col - 1) * SYMBOL_WIDTH + (col - 1) * MARGIN_X + SYMBOL_WIDTH / 2;
    sprite.y = (row - 1) * SYMBOL_WIDTH + row * MARGIN_Y + SYMBOL_WIDTH / 2;
    sprite.width = SYMBOL_WIDTH + MARGIN_X / 2;
    sprite.height = sprite.width;
    sprite.anchor.set(0.5);
    sprite.zIndex = 5;

    app.stage.addChild(sprite);
  };
  const hightLightSymbols = (cells: Cell[]) => {
    cells.forEach((cell) => {
      const symbol = symbolsRef.current.find(
        (item) => item.row === cell.row && item.col === cell.col
      );
      if (!symbol) return;
      const highlightSprite = symbol.sprite;
      gsap.to(highlightSprite, {
        rotation: 0.1, // 约5.7度
        duration: 0.3,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1, // 无限循环
      });
      gsap.to(highlightSprite.scale, {
        x: highlightSprite.scale.x * 1.1,
        y: highlightSprite.scale.y * 1.1,
        duration: 1.6,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1, // 无限循环
      });
      // 高亮边框
      createSymbolBorderAnimation(
        SYMBOL_BORDER_ANIMATION_CONFIG[0],
        cell.row,
        cell.col
      );
    });
  };
  useEffect(() => {
    let isMounted = true;

    // 清理之前的状态
    animationLinesRef.current = [];
    symbolsRef.current = [];

    soundController?.play?.();
    const initPixi = async () => {
      if (!pixiContainerRef.current || !isMounted) return;

      try {
        // Create a new application
        setLoading(true);

        // 确保资源已加载，避免重复加载
        try {
          await Assets.load([...SYMBOL_RESOURCE, ...LINE_RESOURCE]);
        } catch (loadError) {
          console.warn("Assets already loaded or load error:", loadError);
        }

        setLoading(false);
        const app = new Application();

        // Initialize the application
        await app.init({
          background: "#1099bb",
          width: CONTAINER_WIDTH,
          height: CONTAINER_HEIGHT,
          antialias: true,
          useBackBuffer: true,
        });
        initDevtools({ app });

        // Check if component is still mounted before proceeding
        if (!isMounted) {
          app.destroy(true, { children: true, texture: false });
          return;
        }

        appRef.current = app;

        // Append the application canvas to our container
        if (
          pixiContainerRef.current &&
          !pixiContainerRef.current.contains(app.canvas)
        ) {
          pixiContainerRef.current.appendChild(app.canvas);
        }

        // 初始化图案
        for (let col = 0; col < COLS; col++) {
          // 检查组件是否仍然挂载
          if (!isMounted) {
            app.destroy(true, { children: true, texture: false });
            return;
          }

          // 列容器
          const colContainer = new Container();
          colContainer.x = col * (SYMBOL_WIDTH + MARGIN_X);
          app.stage.addChild(colContainer);
          for (let row = 0; row < ROWS + EXTRA_ROWS; row++) {
            const symbolIndex = Math.floor(Math.random() * symbolLen);
            const texture =
              (await Assets.get(`symbol${symbolIndex + 1}`)) || Texture.EMPTY;
            const sprite = new Sprite(texture);
            symbolsRef.current.push({ sprite, row: row + 1, col: col + 1 });
            sprite.x = SYMBOL_WIDTH / 2; // 相对于colContainer的位置
            sprite.y = row * (SYMBOL_HEIGHT + MARGIN_Y) + SYMBOL_HEIGHT / 2;
            sprite.anchor.set(0.5); // 设置锚点为中心，让缩放以中心为基准
            sprite.setSize(SYMBOL_WIDTH, SYMBOL_HEIGHT);
            colContainer.addChild(sprite);
          }
        }

        // 线条动画初始化
        await Promise.all(
          LINE_ANIMATION_CONFIG.map(async (animation) => {
            await createLineAnimation(animation);
          })
        );

        // 播放线动画 symbol动画
        MOCK_WIN_LINE.forEach((line) => {
          playLineAnimation(line.no);
          hightLightSymbols(line.cell);
        });
      } catch (error) {
        console.error("PixiJS initialization error:", error);
      }
    };

    initPixi();

    // Cleanup function
    return () => {
      isMounted = false;

      // 停止所有GSAP动画
      gsap.killTweensOf("*");

      // 清理音频控制器
      soundController?.stop?.();

      // 清理引用数组
      animationLinesRef.current = [];
      symbolsRef.current = [];

      if (appRef.current) {
        try {
          console.log("Cleaning up PixiJS app", appRef.current);

          // 停止渲染循环
          appRef.current.ticker?.stop();

          // 清理stage上的所有子元素
          if (appRef.current.stage) {
            appRef.current.stage.removeChildren();
            appRef.current.stage.destroy({ children: true, texture: false });
          }

          // 移除canvas元素
          if (pixiContainerRef.current && appRef.current.canvas) {
            try {
              pixiContainerRef.current.removeChild(appRef.current.canvas);
            } catch (e) {
              // Canvas可能已经被移除
            }
          }

          // 销毁应用
          if (typeof appRef.current.destroy === "function") {
            appRef.current.destroy(true, { children: true, texture: false });
          } else if (typeof appRef.current.stop === "function") {
            appRef.current.stop();
          }

          appRef.current = null;
        } catch (error) {
          console.error("Error destroying PixiJS app:", error);
          appRef.current = null;
        }
      }
    };
  }, []);

  const handleDraw = () => {
    // 小动画 一帧让所有的符号都向上移动 显示最底部三个符号在可见区
    const app = appRef.current;
    if (!app) {
      return;
    }
    // 所有的列container都向上移动 显示最底部三个符号在可见区
    const containers = app.stage.children;
    containers.forEach((container) => {
      if (container instanceof Container) {
        container.y = -EXTRA_ROWS * (SYMBOL_HEIGHT + MARGIN_Y);
      }
    });
    // 利用gasp.to让所有列container回到最初的位置
    containers.forEach((container) => {
      if (container instanceof Container) {
        gsap.to(container, {
          y: 0,
          duration: 2,
        });
      }
    });
  };

  return (
    <div style={{ padding: "24px" }}>
      <Card title="PixiJS" bordered={false}>
        <div style={{ marginBottom: "16px" }}>
          <h3></h3>
          <p>这是一个使用 PixiJS 创建的简单动画示例</p>
        </div>
        {loading ? (
          <Spin />
        ) : (
          <div
            style={{
              position: "relative",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              ref={pixiContainerRef}
              style={{
                border: "1px solid #d9d9d9",
                borderRadius: "6px",
                overflow: "hidden",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: CONTAINER_WIDTH,
                height: CONTAINER_HEIGHT,
              }}
            ></div>
            {/* 抽奖按钮 */}
            <div onClick={handleDraw} className={styles.FruitsDrawBtn}>
              抽奖按钮
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Demo6;
