import React, { useEffect, useRef } from "react";
import { Application, Assets, Container, Sprite } from "pixi.js";
import { initDevtools } from "@pixi/devtools";
import { Card } from "antd";
// 父子Sprite变换动画
const Demo2: React.FC = () => {
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
          background: "#0ad480",
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

        // 将application添加到dom中
        if (pixiContainerRef.current) {
          pixiContainerRef.current.appendChild(app.canvas);
        }

        // 创建container容器 存放sprite
        const container = new Container();
        // 居中在画布中
        container.x = app.screen.width / 2;
        container.y = app.screen.height / 2;
        container.pivot.x = container.width / 2;
        container.pivot.y = container.height / 2;
        // 把container添加到stage中
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

        // 创建3个sprite 并且每一个sprite都是上个sprite的父级
        // 类似文件夹包着文件夹
        const containers: Container[] = [];
        let parent = container;
        for (let i = 0; i < 3; i++) {
          // 当前文件夹 container
          const wrapper = new Container();
          const bunny = Sprite.from(texture);
          // const bunny = new Sprite(texture);
          bunny.anchor.set(0.5);
          containers.push(wrapper);
          wrapper.addChild(bunny);
          parent.addChild(wrapper);
          parent = wrapper;
        }

        // Listen for animate update
        let elpased = 0;
        app.ticker.add(({ deltaTime }) => {
          elpased += deltaTime / 60;
          const amount = Math.sin(elpased);
          const x = 75 * amount;
          const scale = 1 + amount * 0.25;
          const angle = 40 * amount;
          const alpha = 0.75 + 0.25 * amount;
          for (let i = 0; i < containers.length; i++) {
            const container = containers[i];
            container.scale = scale;
            // sprite.scale.set(scale);
            container.angle = angle;
            container.alpha = alpha;
            container.x = x;
          }
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
      <Card title="PixiJS 旋转兔子动画2" bordered={false}>
        <div style={{ marginBottom: "16px" }}>
          <h3></h3>
          <p>
            这是一个例子。我们将创建三个精灵，每个精灵的container都是上一个精灵的子级，
            并为它们的位置、旋转、缩放和 alpha
            设置动画。每个container的属性都设置为相同的值，但由于他们有父子关系，最终结果表现不同，如果父级的
            alpha 设置为 0.5（使其 50% 透明），则其所有子级也将从 50%
            透明开始。如果将子项设置为 0.5 alpha，则它不会是 50% 透明，而是 0.5
            x 0.5 = 0.25 alpha，或 75%
            透明。同样，对象的位置是相对于其父级的，因此，如果将父级设置为 50
            像素的 x 位置，而将子级设置为 100 像素的 x 位置，则将以 150
            像素的屏幕偏移量绘制，即 50 + 100。
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
      </Card>
    </div>
  );
};

export default Demo2;
