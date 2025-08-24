import React, { useEffect, useRef } from "react";
import {
  Application,
  Assets,
  Container,
  Sprite,
  Texture,
  TilingSprite,
} from "pixi.js";
import { initDevtools } from "@pixi/devtools";
import { Card } from "antd";

async function preload() {
  //  预加载 https://pixijs.download/release/docs/rendering.PrepareSystem.html
  const assets = [
    {
      alias: "background",
      src: "https://pixijs.com/assets/tutorials/fish-pond/pond_background.jpg",
    },
    {
      alias: "fish1",
      src: "https://pixijs.com/assets/tutorials/fish-pond/fish1.png",
    },
    {
      alias: "fish2",
      src: "https://pixijs.com/assets/tutorials/fish-pond/fish2.png",
    },
    {
      alias: "fish3",
      src: "https://pixijs.com/assets/tutorials/fish-pond/fish3.png",
    },
    {
      alias: "fish4",
      src: "https://pixijs.com/assets/tutorials/fish-pond/fish4.png",
    },
    {
      alias: "fish5",
      src: "https://pixijs.com/assets/tutorials/fish-pond/fish5.png",
    },
    {
      alias: "overlay",
      src: "https://pixijs.com/assets/tutorials/fish-pond/wave_overlay.png",
    },
    {
      alias: "displacement",
      src: "https://pixijs.com/assets/tutorials/fish-pond/displacement_map.png",
    },
  ];
  await Assets.load(assets);
}
// 鱼塘动画
const Demo3: React.FC = () => {
  const pixiContainerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);

  // 旋转兔子动画
  useEffect(() => {
    let isMounted = true;

    const initPixi = async () => {
      if (!pixiContainerRef.current || !isMounted) return;

      try {
        // 创建Application
        const app = new Application();
        // 初始化application
        await app.init({
          background: "#f9f04c",
          width: 800,
          height: 600,
          antialias: true,
        });
        initDevtools({ app });

        // Check if component is still mounted before proceeding
        if (!isMounted) {
          app.destroy(true, true);
          return;
        }
        // 加载资源
        await preload();
        pixiContainerRef.current.appendChild(app.canvas);
        appRef.current = app;

        // 背景图
        const background = Sprite.from("background");
        // 背景图自适应放大
        background.anchor.set(0.5);
        if (app.screen.width > app.screen.height) {
          background.width = app.screen.width * 1.2;
          background.height = background.height * background.scale.x;
        } else {
          background.height = app.screen.height * 1.2;
          background.width = background.width * background.scale.y;
        }
        background.x = app.screen.width / 2;
        background.y = app.screen.height / 2;
        app.stage.addChild(background);

        // 添加小鱼
        const fishAssets = ["fish1", "fish2", "fish3", "fish4", "fish5"];
        const fishCount = 20;
        const fishContainer = new Container();
        const fishSprite: Sprite[] = [];
        for (let i = 0; i < fishCount; i++) {
          const fish = Sprite.from(fishAssets[i % fishAssets.length]);
          fish.anchor.set(0.5);
          fishSprite.push(fish);
          fishContainer.addChild(fish);

          // 自定义鱼的属性
          (fish as any).direction = Math.random() * 2 * Math.PI;
          (fish as any).speed = Math.random() * 2 + 1;
          (fish as any).turnSpeed = Math.random() * 0.2 - 0.1;

          // 随机位置
          fish.scale.set(Math.random() * 0.5 + 0.5);
          fish.x = Math.random() * app.screen.width;
          fish.y = Math.random() * app.screen.height;
        }
        app.stage.addChild(fishContainer);

        // 添加平铺纹理
        const overlayTexture = Texture.from("overlay");
        const overlaySprite = new TilingSprite({
          texture: overlayTexture,
          width: app.screen.width,
          height: app.screen.height,
        });
        app.stage.addChild(overlaySprite);

        const stagePadding = 100;
        const boundWidth = app.screen.width + stagePadding * 2;
        const boundHeight = app.screen.height + stagePadding * 2;
        app.ticker.add(({ deltaTime }) => {
          // 鱼的位置变化
          overlaySprite.tilePosition.x += 0.5 * deltaTime;
          overlaySprite.tilePosition.y += 0.5 * deltaTime;
          fishSprite.forEach((fish) => {
            // 鱼的角度变化
            (fish as any).direction +=
              (fish as any).turnSpeed * 0.01 * deltaTime;
            /**
             * 标准数学坐标系[用cos计算x，sin计算y]
              - Y轴向上 为正方向
              - 0度角 指向 右侧 （+X方向）
              - 角度 逆时针 增加
            PIXI.js坐标系[用sin计算x，cos计算y]
              - Y轴向下 为正方向（屏幕坐标系）
              - 0度角 通常指向 上方 （-Y方向）
              - 角度 顺时针 增加
             */
            // 鱼的位置变化
            fish.x += Math.sin((fish as any).direction) * (fish as any).speed;
            fish.y += Math.cos((fish as any).direction) * (fish as any).speed;
            // 鱼头方向与移动方向一致 rotation是弧度 π ， angle是角度 180°
            fish.rotation = -((fish as any).direction + Math.PI / 2);
            // 鱼的位置超出边界，改变方向
            if (fish.x < -stagePadding) {
              fish.x += boundWidth;
            }
            if (fish.x > app.screen.width + stagePadding) {
              fish.x -= boundWidth;
            }
            if (fish.y < -stagePadding) {
              fish.y += boundHeight;
            }
            if (fish.y > app.screen.height + stagePadding) {
              fish.y -= boundHeight;
            }
          });
        });
      } catch (error) {
        console.error("PixiJS initialization error:", error);
      }
    };

    initPixi();

    // Cleanup function
    return () => {
      isMounted = false;

      if (appRef.current) {
        try {
          console.log("Cleaning up PixiJS app", appRef.current);
          // 使用更安全的销毁方法
          if (typeof appRef.current.destroy === "function") {
            appRef.current.destroy(true, true);
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

  return (
    <div style={{ padding: "24px" }}>
      <Card title="PixiJS 鱼塘动画" bordered={false}>
        <div style={{ marginBottom: "16px" }}>
          <h3></h3>
          <p>这是一个鱼塘动画，包含了背景图、鱼和波的动画。</p>
        </div>
        <div
          ref={pixiContainerRef}
          style={{
            border: "1px solid #d9d9d9",
            borderRadius: "6px",
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "600px",
          }}
        />
      </Card>
    </div>
  );
};

export default Demo3;
