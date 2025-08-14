import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import $style from "./index.module.scss";
import { useEffect } from "react";
gsap.registerPlugin(ScrollTrigger);
export default function GsapDemo() {
  useEffect(() => {
    // gsap创建补间动画
    // gsap.to(".box1", {
    //   x: 100,
    //   duration: 1,
    //   delay: 2,
    // });
    // gsap.from(".box2", { rotation: -360, x: 100, delay: 2 });
    // gsap.fromTo(
    //   ".box3",
    //   {
    //     x: 100,
    //     duration: 1,
    //   },
    //   {
    //     x: 0,
    //     duration: 1,
    //   }
    // );

    // 方式1
    const scrollTriggerInstance = ScrollTrigger.create({
      trigger: ".container1",
      scroller: `.${$style.GsapDemo}`, // 指定滚动容器为GsapDemo元素
      start: "top top", // 当容器顶部到达滚动容器顶部时开始
      end: "+=800", // 固定800px的滚动距离
      // 固定当前的container直到超出滚动范围
      pin: true,
      // 帮助标记开始和结束的地方
      markers: true,
      // 绑定动画和滚动条
      scrub: 1, // 添加缓动效果
      animation: gsap
        .timeline()
        .to(".box2", {
          x: 150,
          duration: 1,
        })
        .to(
          ".box3",
          {
            x: 400,
            duration: 1,
          },
          "<" // 与box2同时开始
        )
        .to(
          ".box1",
          {
            rotation: 360, // 修正为rotation
            scale: 1.2,
            duration: 2,
          },
          ">" // 在前面动画完成后开始
        ),
    });
    // timeline时间线
    // 方式2
    // const tl = gsap.timeline({
    //   // 滚动条配置
    //   scrollTrigger: {
    //     scroller: `.${$style.GsapDemo}`, // 指定滚动容器为GsapDemo元素
    //     trigger: ".container1",
    //     start: "top top",
    //     end: "+=800",
    //     // 固定当前的container知道超出滚动范围
    //     pin: true,
    //     // 帮助标记开始和结束的地方
    //     markers: true,
    //     // 绑定动画和滚动条
    //     scrub: 1,
    //   },
    // });
    // tl.to(".box1", {
    //   x: 100,
    //   duration: 1,
    // })
    //   .to(".box2", { rotation: -360, x: 100, duration: 1 })
    //   .fromTo(
    //     ".box3",
    //     {
    //       x: 100,
    //       duration: 1,
    //       opacity: 0,
    //     },
    //     {
    //       x: 0,
    //       duration: 1,
    //       opacity: 1,
    //     }
    //   );
    // 1s 后执行
    // tl.to(
    //   ".box2",
    //   {
    //     x: 140,
    //     duration: 1,
    //   }
    //   // 1
    // );
    // // 和上个动画同时执行
    // tl.to(
    //   ".box3",
    //   {
    //     x: 400,
    //     duration: 1,
    //   },
    //   "<"
    // );
    // // ">" 默认上个动画完成后执行 +=1上个动画结束前1s
    // tl.to(
    //   ".box1",
    //   {
    //     rotation: 360,
    //     scale: 1.2,
    //     duration: 1,
    //   },
    //   ">"
    // );
    return () => {
      // 清理ScrollTrigger实例
      if (scrollTriggerInstance) {
        scrollTriggerInstance.kill();
      }
      // 清理所有补间动画
      gsap.killTweensOf(".box1");
      gsap.killTweensOf(".box2");
      gsap.killTweensOf(".box3");
    };
  }, []);

  return (
    <div className={`${$style.GsapDemo}`}>
      <h2>demo1: 滚动+动画</h2>
      <div className={`${$style.GsapDemo1Container}`}></div>
      <div className={`${$style.GsapDemo2Container} container1`}>
        <div
          className={`${$style.GsapDemoBox1} ${$style.GsapDemoBox} box1`}
        ></div>
        <div
          className={`${$style.GsapDemoBox2} ${$style.GsapDemoBox} box2`}
        ></div>
        <div
          className={`${$style.GsapDemoBox3} ${$style.GsapDemoBox} box3`}
        ></div>
      </div>
      <div className={`${$style.GsapDemo3Container}`}></div>
    </div>
  );
}
