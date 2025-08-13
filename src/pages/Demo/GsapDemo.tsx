import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
import $style from "./index.module.scss";
import { useEffect } from "react";

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

    // timeline时间线
    const tl = gsap.timeline();
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
    tl.to(
      ".box2",
      {
        x: -100,
        duration: 1,
      }
      // 1
    );
    // 和上个动画同时执行
    tl.to(
      ".box3",
      {
        x: 100,
        duration: 1,
      },
      "<"
    );
    // ">" 默认上个动画完成后执行 +=1上个动画结束前1s
    tl.to(
      ".box1",
      {
        rotate: 360,
        scale: 1.2,
        duration: 1,
      },
      ">"
    );
    return () => {
      gsap.killTweensOf(".box1");
      gsap.killTweensOf(".box2");
      gsap.killTweensOf(".box3");
    };
  }, []);

  return (
    <div className={`${$style.GsapDemo}`}>
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
  );
}
