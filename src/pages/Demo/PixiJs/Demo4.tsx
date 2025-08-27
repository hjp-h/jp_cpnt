import React, { useEffect, useRef } from "react";
import { Application, Container, Graphics } from "pixi.js";
// import { initDevtools } from "@pixi/devtools";
import { Card } from "antd";
// 入门demo
const Demo4: React.FC = () => {
  const pixiContainerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);

  // 旋转兔子动画
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
        // initDevtools({ app });

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
        container.x = app.screen.width / 2;
        container.y = app.screen.height / 2;
        container.pivot.set(50, 50);
        app.stage.addChild(container);

        // 创建图形
        const graphics = new Graphics()
          .rect(50, 50, 100, 100)
          .fill(0xff0000)
          .circle(100, 100, 50)
          .stroke(0x00ff00);

        container.addChild(graphics);

        // 支持svga
        const shape = new Graphics().svg(`
          <svg>
            <path d="M 100 350 q 150 -300 300 0" stroke="blue" />
          </svg>
        `);
        shape.x = -100;
        shape.y = -100;
        container.addChild(shape);

        // Check again if component is still mounted
        if (!isMounted) {
          app.destroy(true, true);
          return;
        }

        // let ellipse = 0;
        // Listen for animate update
        // app.ticker.add((time) => {
        //   // container.rotation -= 0.01 * time.deltaTime;
        // });
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
      <Card title="PixiJS 创建图形" bordered={false}>
        <div style={{ marginBottom: "16px" }}>
          <h3></h3>
          <p>这是一个使用 PixiJS 创建的简单动画示例,展示了一个矩形和一个圆。</p>
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

export default Demo4;
