## PIXIJS学习笔记
pixi.js 是一款先进的开源2D渲染引擎，基于WebGL和可选的WebGPU构建【如果浏览器支持WebGPU则使用WebGPU渲染，否则WebGpu => WebGL => Canvas】,最终都通过<canvas>元素在页面上展示

适合的场景：
构建具有丰富图形和动画的基于浏览器的游戏。
创建具有响应式触摸和点击支持的交互式 Web 应用程序。
使用 Tauri 和 Electron 等工具开发跨平台应用程序。
以独特且引人入胜的方式可视化数据。
使用创意视觉元素和效果增强 Web 内容。

生态:
devtools【https://pixijs.io/devtools/】、react集成【https://pixijs.com/react.pixijs.io/】、Layout布局【https://layout.pixijs.io/】使用熟悉的类似 CSS 的规则来控制 PixiJS 显示对象的定位、对齐和大小、骨骼动画集成【https://esotericsoftware.com/spine-pixi】、Filters过滤器【https://github.com/pixijs/filters】、Sound声音【https://github.com/pixijs/sound】、UI用户界面【https://github.com/pixijs/ui】、AssetsPack资产包【https://pixijs.io/assetpack/】


核心组件：
1. Render渲染
webgpu、webgl、canvas
2. Scene Object场景对象
（1）Container容器
（2）Sprite精灵
（3）Texture纹理
（4）Graphics图形
（5）Text文本
（6）Button按钮
每一帧，PixiJS 都会更新场景图，然后渲染场景图。场景图的根节点是由应用程序维护的容器，并使用 app.stage 引用。类似于DOM树的根节点，当app.stage中再继续添加其它可渲染对象，例如Sprite,或者Container包裹着Container这些情况。
当父级移动时，其子级也会移动；父级隐藏时，其子级也会隐藏；如果父级的 alpha 设置为 0.5（使其 50% 透明），则其所有子级也将从 50% 透明开始。如果将子项设置为 0.5 alpha，则它不会是 50% 透明，而是 0.5 x 0.5 = 0.25 alpha，或 75% 透明。同样，对象的位置是相对于其父级的，因此，如果将父级设置为 50 像素的 x 位置，而将子级设置为 100 像素的 x 位置，则将以 150 像素的屏幕偏移量绘制，即 50 + 100。
<Demo2/>

局部坐标和全局坐标
在 PixiJS 中，每个显示对象都有一个局部坐标系统和一个全局坐标系统。
局部坐标系统是相对于显示对象的父容器的坐标系统。
全局坐标系统是相对于场景图的根容器（即应用程序的 stage）的坐标系统。

全局坐标和局部坐标的转换
可以使用全局坐标来定位和操作显示对象，也可以使用局部坐标来定位和操作显示对象。
要将全局坐标转换为局部坐标，需要使用 displayObject.toLocal() 方法。
要将局部坐标转换为全局坐标，需要使用 displayObject.toGlobal() 方法。
例如，要将全局坐标 (100, 100) 转换为局部坐标，需要使用以下代码：
```
const localPosition = displayObject.toLocal(new PIXI.Point(100, 100));
```
要将局部坐标 (100, 100) 转换为全局坐标，需要使用以下代码：
```
const globalPosition = displayObject.toGlobal(new PIXI.Point(100, 100));
```

1. Assets资产
   提供了用于异步加载资源（如图像和音频文件）的工具。
2. Application
3. Ticker 
   ticker 是 PixiJS 中的一个核心组件，用于管理游戏循环和动画。它负责在每个动画帧中更新和渲染场景对象。
   应用程序的 ticker 是一个循环，它会在每个动画帧中调用回调函数。回调函数接收一个 ticker 对象作为参数，该对象包含有关当前动画帧的信息，例如 deltaTime（缩放的帧增量）,elapsedMS(以毫秒为单位，与上一帧调用间隔的时间)。
   deltaTime是一种倍数关系  deltaTime = 当前帧耗时 / 16.666ms，deltaTime 表示 当前帧相对于“理想帧时间”的倍数。理想帧率是 60 FPS（每帧约 16.666ms），在这个情况下 deltaTime ≈ 1。如果渲染速度变慢，比如实际渲染一帧用了 33ms（30 FPS），那么 deltaTime ≈ 2。
   ```js
   app.ticker.add((ticker) => {
    bunny.rotation += ticker.deltaTime * 0.1;
   });

   ```
4. Events事件
   支持基于pointer的交互 - 使对象可点击、触发悬停事件等
5. Filters过滤器
   支持各种滤镜，包括自定义着色器，以将效果应用于可渲染对象
7. Render Groups渲染组【性能优化】
   渲染组是 PixiJS 中的一个功能，用于将显示对象分组并进行批量渲染。
   使用渲染组的主要优势在于其性能优化的能力。它们允许将某些计算（例如变换（位置、缩放、旋转）、色调和 alpha 调整）在 GPU中进行。这意味着移动或调整渲染组等作可以在对 CPU 影响最小的情况下完成，从而提高应用程序的性能效率。适用于以下场景：
   （1）静态内容： 对于不经常更改的内容，渲染组可以显著减少 CPU 上的计算负载。在这种情况下，静态是指场景图结构，而不是其中 PixiJS 元素的实际值（例如位置、事物的比例）。
   （2）独特的场景部分： 您可以将场景进行合理地划分，例如游戏逻辑和 显示部分。每个部件都可以单独优化，从而提高整体性能。

   ```js
   import { Container } from 'pixi.js';

  const myGameWorld = new Container({
    isRenderGroup: true,
  });

  const myHud = new Container({
    isRenderGroup: true,
  });

  scene.addChild(myGameWorld, myHud);

  renderer.render(scene); // this action will actually convert the scene to a render group under the hood
   ```
   最佳实践：
   （1）不要过度使用，过多地分组会降低性能，要找到一个平衡点，不要为了分组而分组。
   （2）战略分组，考虑场景的哪一些部分会变化，哪些保持静止，将动态元素和静态元素进行分组可以提高性能
8. Render Layers【渲染层】
   PixiJS Layer API提供了强大的方法来控制对象的渲染顺序，而不受原本在场景图中逻辑父子关系的影响，使用RenderLayers可以将某个对象的变换形式【通过父级元素实现】与视觉绘制方式解耦。
9. 
