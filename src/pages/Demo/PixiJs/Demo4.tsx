import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import {
  Application,
  BitmapText,
  Container,
  Graphics,
  GraphicsContext,
  HTMLText,
  Text,
  SplitText,
  SplitBitmapText,
} from "pixi.js";
import { initDevtools } from "@pixi/devtools";
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
        container.x = app.screen.width / 2;
        container.y = app.screen.height / 2;
        container.pivot.set(50, 50);
        app.stage.addChild(container);

        // 创建图形
        const graphics = new Graphics()
          // 1. 长方形
          .rect(50, 50, 100, 100)
          // 填充颜色
          .fill(0xff0000)
          // 2. 圆形
          .circle(100, 100, 50)
          // 描边
          .stroke(0x00ff00);
        container.addChild(graphics);

        // 3. 三角形
        const triangle = new Graphics()
          .moveTo(100, 100)
          .lineTo(200, 100)
          .lineTo(200, 200)
          .closePath()
          .fill(0x0000ff);
        container.addChild(triangle);

        // 支持svga
        const shape = new Graphics().svg(`
          <svg>
            <path d="M 100 350 q 150 -300 300 0" stroke="blue" />
          </svg>
        `);
        shape.x = -100;
        shape.y = -100;
        container.addChild(shape);

        // 图形上下文
        const graphContext = new GraphicsContext()
          .circle(200, 200, 50)
          .fill("green");
        // 共用一个图像上下文 指向同一个图形
        const shapeA = new Graphics(graphContext);
        const shapeB = new Graphics(graphContext);
        const container2 = new Container();
        container2.addChild(shapeB);
        container2.x = 100;
        container2.y = 50;
        container.addChild(shapeA, container2);
        setTimeout(() => {
          // 传入{ context: true } 会将图形上下文删掉 不传的话只删除shapeA
          shapeA && shapeA?.destroy?.({ context: true });
        }, 2000);

        //  在图形中进行剪裁
        const g = new Graphics()
          .rect(0, 0, 100, 100)
          .fill(0x00ff00)
          .circle(50, 50, 20)
          .cut();
        g.x = -200;
        g.y = 100;
        container.addChild(g);

        // 文字Text
        const myText = new Text({
          text: "Hello PixiJS!",
          style: {
            fill: "#ffffff",
            fontSize: 36,
            fontFamily: "MyFont",
          },
          anchor: 0.5,
        });
        container.addChild(myText);

        // Bitmap Text
        const bitMapText = new BitmapText({
          text: "Hello PixiJS!",
          style: {
            fontFamily: "MyFont",
            fontSize: 36,
            fill: "#ffcc00",
          },
        });
        bitMapText.y = 50;
        bitMapText.x = -200;
        container.addChild(bitMapText);

        // HtmlText
        const html = new HTMLText({
          text: "<strong>Hello</strong> <em>PixiJS</em>!",
          style: {
            fontFamily: "Arial",
            fontSize: 24,
            fill: "#1a0aae",
            align: "center",
          },
        });
        html.x = 200;
        container.addChild(html);

        // SplitText
        const splitText = new SplitText({
          text: "Hello World",
          style: { fontSize: 32, fill: 0xffffff },

          // Optional: Anchor points (0-1 range)
          lineAnchor: 0.5, // Center lines
          wordAnchor: { x: 0, y: 0.5 }, // Left-center words
          charAnchor: { x: 0.5, y: 1 }, // Bottom-center characters
          autoSplit: true,
        });
        splitText.x = 200;
        console.log(splitText.lines); // Array of line containers
        console.log(splitText.words); // Array of word containers
        console.log(splitText.chars);
        container.addChild(splitText);

        // splitBitmapText
        const bitMapText1 = new SplitBitmapText({
          text: "Split and Animate",
          style: { fontFamily: "Game Font", fontSize: 48 },
        });
        container.addChild(bitMapText1);
        bitMapText1.chars.forEach((char, i) => {
          gsap.from(char, {
            alpha: 0,
            delay: i * 0.05,
          });
        });

        // Animate words with scaling
        bitMapText1.words.forEach((word, i) => {
          gsap.to(word.scale, {
            x: 1.2,
            y: 1.2,
            yoyo: true,
            repeat: -1,
            delay: i * 0.2,
          });
        });

        // Check again if component is still mounted
        if (!isMounted) {
          app.destroy(true, true);
          return;
        }

        // let ellipse = 0;
        // // Listen for animate update
        // app.ticker.add(({ deltaTime }) => {
        //   ellipse += deltaTime / 60;

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
          <p>这是一个使用 PixiJS 创建的简单动画示例,展示了Text、Graphics。</p>
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
