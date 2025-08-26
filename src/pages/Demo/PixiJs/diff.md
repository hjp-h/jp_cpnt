渲染层：
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

垃圾回收：
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
