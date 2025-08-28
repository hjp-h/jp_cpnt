import React, { useEffect, useRef } from "react";
import {
  AlphaFilter,
  Application,
  Assets,
  Container,
  DarkenBlend,
  DivideBlend,
  Filter,
  GlProgram,
  HardMixBlend,
  LinearBurnBlend,
  LinearDodgeBlend,
  LinearLightBlend,
  NoiseFilter,
  PinLightBlend,
  Sprite,
  SubtractBlend,
} from "pixi.js";
import "pixi.js/advanced-blend-modes";
import { initDevtools } from "@pixi/devtools";
import { Card } from "antd";
// 入门demo
const vertex = `
  in vec2 aPosition;
  out vec2 vTextureCoord;

  uniform vec4 uInputSize;
  uniform vec4 uOutputFrame;
  uniform vec4 uOutputTexture;

  vec4 filterVertexPosition( void )
  {
      vec2 position = aPosition * uOutputFrame.zw + uOutputFrame.xy;

      position.x = position.x * (2.0 / uOutputTexture.x) - 1.0;
      position.y = position.y * (2.0*uOutputTexture.z / uOutputTexture.y) - uOutputTexture.z;

      return vec4(position, 0.0, 1.0);
  }

  vec2 filterTextureCoord( void )
  {
      return aPosition * (uOutputFrame.zw * uInputSize.zw);
  }

  void main(void)
  {
      gl_Position = filterVertexPosition();
      vTextureCoord = filterTextureCoord();
  }
`;

const fragment = `
  in vec2 vTextureCoord;
  in vec4 vColor;

  uniform sampler2D uTexture;
  uniform float uTime;

  void main(void)
  {
      vec2 uvs = vTextureCoord.xy;

      vec4 fg = texture2D(uTexture, vTextureCoord);


      fg.r = uvs.y + sin(uTime);


      gl_FragColor = fg;

  }
`;

const Demo5: React.FC = () => {
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
          useBackBuffer: true,
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

        const texture = await Assets.load(
          "https://pixijs.com/assets/bunny.png"
        );
        const sprite = new Sprite(texture);
        sprite.x = container.width / 2;
        sprite.y = container.height / 2;
        sprite.setSize(100, 100);
        container.addChild(sprite);

        const customFilter = new Filter({
          glProgram: new GlProgram({
            fragment,
            vertex,
          }),
          resources: {
            timeUniforms: {
              uTime: { value: 0.0, type: "f32" },
            },
          },
        });

        // 增加滤镜 顺序很重要——过滤器按顺序应用。
        sprite.filters = [
          // new BlurFilter({ strength: 1 }),
          // new NoiseFilter({ noise: 0.2 }),
          // new AlphaFilter({ alpha: 0.5 }),
          // new DisplacementFilter();

          // new HardMixBlend(),

          // new ColorBurnBlend(),
          // new ColorDodgeBlend(),
          // new DarkenBlend(),
          // new DivideBlend(),
          // new HardMixBlend(),
          // new LinearBurnBlend(),
          // new LinearDodgeBlend(),
          // new LinearLightBlend(),
          // new PinLightBlend(),
          // new SubtractBlend(),
          customFilter,
        ];

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

export default Demo5;
