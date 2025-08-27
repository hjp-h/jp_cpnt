## 渲染层：
Render Layer是PixiJS提供的一种方法来控制对象的渲染顺序，而不受场景图中父子关系的影响。也就是说，即使一个对象是场景图中的子对象，也可以将其渲染在场景图的其他对象之前或之后。

核心：
（1）RenderLayers 允许独立于逻辑层次结构控制绘制顺序，确保对象按所需顺序呈现。
（2）对象从其逻辑父级保持变换（例如，位置、缩放、旋转），即使附加到 RenderLayers。
（3）从场景图或图层中删除对象后，该对象必须手动重新分配给图层，以确保对渲染的控制。
（4）动态排序
每个渲染层都可以使用 zIndex 和 sortChildren 动态重新排序对象，以精细控制渲染顺序。
zIndex：
zIndex 是一个整数属性，用于控制渲染顺序。zIndex 值较高的对象将被渲染在 zIndex 值较低的对象之上。
sortChildren：
sortChildren 是一个布尔属性，用于控制是否对渲染层中的对象进行排序。如果设置为 true，渲染层中的对象将按照 zIndex 值进行排序。
如果设置为 false，渲染层中的对象将按照添加的顺序进行渲染。

最佳实践：
（1）分组：将相关对象分组，例如将所有的敌人对象分组，将所有的玩家对象分组，将所有的背景对象分组,最大限度减少layer的创建。

我的理解：默认就有一个渲染层，它位于场景的最底层，所有的对象都默认添加到这个渲染层中，后续新创建切添加在它后面的渲染层的zIndex都会比它大；

## 垃圾回收：
（1）显示资源管理
PixiJS 对象（例如纹理、网格和其他 GPU 支持的数据）包含消耗内存的引用。若要显式释放这些资源，请在不再需要的对象上调用 destroy 方法。例如：
```js
import { Sprite } from 'pixi.js';

const sprite = new Sprite(texture);
// Use the sprite in your application

// When no longer needed
sprite.destroy();
```
在不需要的对象上调用destroy之后，可确保立即释放对象的GPU资源，避免内存泄漏。这个操作会解除对象与渲染树的绑定、清理引用，便于 JS 垃圾回收、释放底层 GPU 资源（例如纹理的显存）

（2）使用texture.unload对纹理对象进行管理
Texture.unload() 是 Texture 专有的，它的核心作用是：
👉 主动释放该纹理占用的 GPU 显存（WebGL 里的 gl.deleteTexture()）。但是对象的引用还在，依然是个有效的 JS 对象（可以再次 Texture.from(url) 或者 texture.update() 来恢复）

打个比方：
destroy() 像是“把房子和里面的家具一起拆掉”。
unload() 像是“房子还在，但把家具搬走了，需要的时候再搬回来”。

（3）自动进行纹理垃圾收集
textureGCActive：启用或禁用垃圾回收。默认值：true。
textureGCMaxIdle：纹理清理前的最大空闲帧数，默认值：3600 帧；即如果一个纹理对象在 3600 帧内没有被使用，就会被自动清理。
textureGCCheckCountMax：垃圾回收检查的频率（以帧为单位），默认值：600 帧；即每 600 帧检查一次是否有纹理对象需要清理。
```js
import { Application } from 'pixi.js';
const app = new Application();
await app.init({
  textureGCActive: true, // Enable texture garbage collection
  textureGCMaxIdle: 7200, // 2 hours idle time
  textureGCCheckCountMax: 1200, // Check every 20 seconds at 60 FPS
});
```

最佳实践：
（1）显式销毁对象： 始终对不再需要的对象调用 destroy，以确保 GPU 资源及时释放。
（2）主动管理纹理： 必要时使用 texture.unload（） 进行手动内存管理。

https://pixijs.com/8.x/guides/concepts/performance-tips


## Assets资产
PixiJS中的Assets对象可以进行资源加载，它是单例的、基于promise的资源加载器。加载后的资产需要转为可展示对象，才能在场景中进行展示。
主要功能：
（1）通过Promise或async/await进行异步加载资源
（2）对资源进行缓存，防止冗余网络请求
（3）内置支持常见媒体格式（图像、视频、字体）
（4）支持自定义解析器，用于处理特定格式的资源。
（5）后台加载，不阻塞主线程。
https://pixijs.com/8.x/guides/components/assets/background-loader

支持的文件类型：
https://pixijs.com/8.x/guides/components/assets#supported-file-types

加载资产的方式：
（1）绝对url:
const texture = await Assets.load('https://example.com/assets/hero.png');
（2）项目中的相对路径：
const texture = await Assets.load('assets/hero.png');
（3）加载多个资源：
const [texture1, texture2] = await Assets.load(['./assets/hero.png', './assets/background.png']);
（4）manifest方式加载资源
PixiJS 通过清单和捆绑包具有结构化且可扩展的资产管理方法。这是在 PixiJS 应用程序中管理资产的推荐方法，特别是对于大型项目或需要根据上下文或用户交互动态加载资产的项目。
清单是定义资产加载策略的描述符对象。它列出了所有捆绑包【捆绑包是一组由共享名称标识的资产】，每个捆绑包都包含按名称和别名分组的资产。此结构允许根据应用程序上下文（例如加载屏幕资产、特定于关卡的内容等）延迟加载资产。
```js
import { Assets } from 'pixi.js';
// 定义清单
const manifest = {
  bundles: [
    {
      name: 'load-screen',
      assets: [
        { alias: 'background', src: 'sunset.png' },
        { alias: 'bar', src: 'load-bar.{png,webp}' },
      ],
    },
    {
      name: 'game-screen',
      assets: [
        { alias: 'character', src: 'robot.png' },
        { alias: 'enemy', src: 'bad-guy.png' },
      ],
    },
  ],
};
// 加载清单
await Assets.init({ manifest });
// 加载捆绑包
const loadScreenAssets = await Assets.loadBundle('load-screen');
const gameScreenAssets = await Assets.loadBundle('game-screen');
// 加载资产
const background = loadScreenAssets.background;
const character = gameScreenAssets.character;
// 动态注册捆绑包
Assets.addBundle('animals', [
  { alias: 'bunny', src: 'bunny.png' },
  { alias: 'chicken', src: 'chicken.png' },
  { alias: 'thumper', src: 'thumper.png' },
]);

const assets = await Assets.loadBundle('animals');
// 也可以直接加载捆绑包中的资源
const bunny = await Assets.load('bunny');
```

PixiJs通常会根据文件拓展名来决定加载资源的方式，并且根据资源的url或者别名alias来缓存资源，避免重复加载。
```js
const p1 = await Assets.load('bunny.png');
const p2 = await Assets.load('bunny.png');
console.log(p1 === p2); // true

await Assets.load<Texture>({ alias: 'bunny', src: 'path/to/bunny.png' });
const bunnyTexture = Assets.get('bunny');
```
资产别名
可以使用别名来引用资产，而不是其完整的资源地址
所有Asset API 都支持别名，包括 Assets.load（）、Assets.get（） 和 Assets.unload（）。
```js
await Assets.load<Texture>({ alias: 'bunny', src: 'path/to/bunny.png' });
// 获取已加载的资源
const bunnyTexture = Assets.get('bunny');
```

卸载资产
要卸载资产，您可以使用 Assets.unload（）。 这将从缓存中删除资产并释放内存。请注意，如果您在卸载资产后尝试访问资产，则需要再次加载它。
```js
// 卸载资产
Assets.unload('资源地址或者资源别名');
```

## Application
Application 是 PixiJS 中用于创建和管理应用程序的主要类。提供了一个现代的、可拓展的入口去启动渲染。
正常来说，我们后续的动画都是在Application的基础上进行的，所以我们会进行一下操作：
（1）先创建一个Application实例。
（2）调用app.init()方法初始化应用程序。
init方法参数 https://pixijs.com/8.x/guides/components/application#applicationoptions-reference
（3）将app.canvas添加到dom中
创建Application
```js
import { Application } from 'pixi.js';

const app = new Application();

await app.init({
  width: 800,
  height: 600,
  backgroundColor: 0x1099bb,
});
// 应用程序实例化后，将自动创建一个渲染器和一个根容器（stage）。
// 渲染器可以通过 app.renderer 访问，而根容器可以通过 app.stage 访问。
document.body.appendChild(app.canvas);
```

## Textures
Textures(纹理)是PixiJs中的重要组件之一，它们定义了通过Sprite、Meshes和其他可渲染对象使用的视觉内容，例如图片、视频等内容。

### Textures的生命周期：
Source File/Image(图片资源) -> TextureSource(纹理源) -> Texture(纹理) -> Sprite(或者是其它可展示对象)

之前我们有介绍过Assets，我们通过Assets加载的资源会自动转换为Texture。
```js
const texture = await Assets.load('myTexture.png');
const sprite = new Sprite(texture);
```
### Preparing Textures
即使在加载纹理之后，图像仍然需要推送到GPU并解码。这可能需要一些时间，具体取决于图像的大小和设备的性能。对大量源图像执行此操作可能会很慢，项目首次加载耗时长，因此建议在应用程序启动时预加载所有必要的纹理。
具体可看：https://pixijs.download/release/docs/rendering.PrepareSystem.html

### Texture Vs TextureSource
TextureSource处理原始像素数据和GPU上传，Texture是该源上的轻量级视图，它是一个“切片 + 元信息包装”，告诉 Pixi：
（1）取图的哪一块（frame 矩形）。
（2）有没有被裁剪 (trim)。
（3）UV 映射关系（告诉 GPU 在大图中的坐标）。
例如 多个Texture 可以共享一个 TextureSource，比如精灵图（spritesheet）里不同小图。
```js
const sheet = await Assets.load('spritesheet.json');
const heroTexture = sheet.textures['hero.png'];
```
spritesheet.json 里会定义：
一张大图 spritesheet.png（对应一个 TextureSource）
每个小图（比如 "hero.png"）的 frame 信息：在这张大图里的 x, y, width, height。
sheet.textures['hero.png'] → 返回一个 Texture，
这个 Texture 内部指向同一个 TextureSource（大图），但只取出 "hero.png" 那个小矩形区域。

总结：
TextureSource：负责像素数据存放和 GPU 上传（大图）。
Texture：负责从大图里“取哪块 + 怎么显示”。
在 spritesheet 场景中：所有小图的 Texture 共用一个 TextureSource。

### 销毁或卸载纹理
（1）销毁纹理
调用texture.destroy()或者Assets.unload(资源地址或别名) 方法可以销毁纹理，释放占用的内存（GPU显存和CPU内存）。
（2）卸载纹理，释放GPU
调用texture.source.unload(); 方法可以从 GPU 中卸载纹理，清楚对应的像素数据，但将其保留在内存中。后续要使用时，重新加载资源即可。
```js
const texture = await Assets.load('myTexture.png');
```

### 常见纹理类型
https://pixijs.com/8.x/guides/components/textures#texture-types

## Container
Container 是 PixiJS 中用于组织和管理显示对象的容器类,是 PixiJS 场景图系统的基础。容器不会直接渲染，而是将渲染交给它的子元素。
```js
const container = new Container();
const child1 = new Container({ label: 'enemy' });
const child2 = new Container();
// 添加子类
container.addChild(child1, child2);
// 移除子类
container.removeChild(child1);
container.removeChildAt(0);
container.removeChildren(0, 2);
// 在某个位置插入子类
container.addChildAt(child1, 0);
// 交换两个子类的位置
container.swapChildren(child1, child2);
// 查找子类
container.getChildByLabel('enemy');
container.getChildrenByLabel(/^enemy/);
// 子元素排序【谨慎使用 对大量子元素排序会导致性能问题】
child1.zIndex = 1;
child2.zIndex = 10;
container.sortableChildren = true;
```

## Sprite
精灵是 PixiJS 中的基本视觉元素。它们表示要在屏幕上显示的单个图像。每个精灵都包含一个要绘制的纹理，并且可以进行变换、交互等操作。
```js
const texture = await Assets.load('bunny.png');
const sprite = new Sprite(texture);
sprite.anchor.set(0.5);
sprite.position.set(100, 100);
sprite.scale.set(2);
sprite.rotation = Math.PI / 4; // Rotate 45 degrees
```
### 更新纹理
要更新精灵的纹理，您可以直接分配一个新的纹理到 sprite.texture 属性。
```js
const newTexture = await Assets.load('newTexture.png');
sprite.texture = newTexture;
```
### 纹理的属性
全部属性及方法设置：https://pixijs.download/release/docs/scene.Sprite.html#cursor
举个简单例子 设置宽高、缩放、旋转
```js
// 精灵从 Container 继承缩放， 允许基于百分比的大小调整：
sprite.scale.set(2); // 放大两倍
sprite.scale.set(0.5);// 缩小一倍
// 设置宽度 同时会自动更新scale.x的值  sprite.scale.x = 100 / sprite.texture.orig.width;
sprite.width = 100;
```
### 特殊纹理
NineSlice Sprite：https://pixijs.com/8.x/guides/components/scene-objects/nine-slice-sprite
Tiling Sprite：https://pixijs.com/8.x/guides/components/scene-objects/tiling-sprite