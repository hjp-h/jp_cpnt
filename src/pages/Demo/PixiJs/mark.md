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
3. Assets资产
4. Application
5. Ticker 
ticker 是 PixiJS 中的一个核心组件，用于管理游戏循环和动画。它负责在每个动画帧中更新和渲染场景对象。
6. Events事件
7. Filters过滤器
