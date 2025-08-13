import React, { useEffect, useRef } from "react";
import { Application, Assets, Container, Sprite } from "pixi.js";
import { initDevtools } from "@pixi/devtools";
import { Card } from "antd";

const PixijsDemo: React.FC = () => {
  const pixiContainerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);

  useEffect(() => {
    let isMounted = true;

    const initPixi = async () => {
      if (!pixiContainerRef.current || !isMounted) return;

      try {
        // Create a new application
        const app = new Application();

        // Initialize the application
        await app.init({
          background: "#1099bb",
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

        appRef.current = app;

        // Append the application canvas to our container
        if (pixiContainerRef.current) {
          pixiContainerRef.current.appendChild(app.canvas);
        }

        // Create and add a container to the stage
        const container = new Container();
        app.stage.addChild(container);

        // Load the bunny texture
        const texture = await Assets.load(
          "https://pixijs.com/assets/bunny.png"
        );

        // Check again if component is still mounted
        if (!isMounted) {
          app.destroy(true, true);
          return;
        }

        // Create a 5x5 grid of bunnies in the container
        for (let i = 0; i < 25; i++) {
          const bunny = new Sprite(texture);

          bunny.x = (i % 5) * 40;
          bunny.y = Math.floor(i / 5) * 40;
          container.addChild(bunny);
        }

        // Move the container to the center
        container.x = app.screen.width / 2;
        container.y = app.screen.height / 2;

        // Center the bunny sprites in local container coordinates
        container.pivot.x = container.width / 2;
        container.pivot.y = container.height / 2;

        // Listen for animate update
        app.ticker.add((time) => {
          // Continuously rotate the container!
          // * use delta to create frame-independent transform *
          container.rotation -= 0.01 * time.deltaTime;
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
      <Card title="PixiJS 组件演示" bordered={false}>
        <div style={{ marginBottom: "16px" }}>
          <h3>PixiJS 旋转兔子动画</h3>
          <p>
            这是一个使用 PixiJS 创建的简单动画示例，展示了25个旋转的兔子精灵。
          </p>
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
        <div style={{ marginTop: "16px" }}>
          <h4>技术特点：</h4>
          <ul>
            <li>使用 PixiJS WebGL 渲染引擎</li>
            <li>60fps 流畅动画</li>
            <li>精灵批量渲染优化</li>
            <li>React 生命周期集成</li>
            <li>资源自动清理</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default PixijsDemo;
