import React from "react";
import { useEffect, memo, useRef, useMemo, createRef } from "react";
import styles from "./index.module.scss";
import cs from "classnames";
import { easeInOut } from "../../utils";
interface Props extends React.HTMLAttributes<HTMLDivElement> {
  num: number;
  numImages: string[]; // 自定义数字图片数组，索引对应数字0-9
  numWidth: number; // 数字宽度(px)
  numHeight: number; // 数字高度(px)
  numStyles?: React.CSSProperties;
  containerStyles?: React.CSSProperties;
  duration?: number; // 动画持续时间（毫秒）
  digitLength?: number; // 数字长度，默认为7位
}

class InitialState {
  progress: number = 0;
  itemHeight: number = 0;
  animationFrameId?: number;
}

// 默认动画持续时间
const DEFAULT_DURATION = 1500;
// 默认数字位数
const DEFAULT_DIGIT_LENGTH = 8;

const RollingNumber: React.FC<Props> = memo(
  ({
    num,
    numWidth,
    numHeight,
    containerStyles,
    numStyles,
    numImages,
    className = "",
    duration = DEFAULT_DURATION,
    digitLength = DEFAULT_DIGIT_LENGTH,
    ...props
  }: Props) => {
    // 生成数字位权重数组
    const decimalWeights = useMemo(() => {
      const weights = [];
      for (let i = digitLength - 1; i >= 0; i--) {
        weights.push(Math.pow(10, i));
      }
      return weights;
    }, [digitLength]);

    // 使用refs数组替代document.querySelector
    const columnRefs = useRef<React.RefObject<HTMLDivElement>[]>(
      Array.from({ length: digitLength }, () => createRef<HTMLDivElement>())
    );
    // 组件内部状态
    const instanceRef = useRef<InitialState>(new InitialState());

    // 滚动数字
    const rollingNum = (start: number) => {
      if (!instanceRef.current.itemHeight) {
        instanceRef.current.itemHeight =
          columnRefs.current[0]?.current?.children?.[0]?.clientHeight || 0;
      }
      const progress = Math.min((Date.now() - start) / duration, 1);
      const easedProgess = easeInOut(progress, 0, 1, 1);
      instanceRef.current.progress = progress;
      if (instanceRef.current.progress >= 1) {
        // 精确滚动
        // 计算每个数字位对应进度的滚动距离
        for (let i = 0; i < digitLength; i++) {
          const moveTimes = Math.floor(num / decimalWeights[i]);
          const targetY = moveTimes * -instanceRef.current.itemHeight;

          // 防止溢出
          const finalY =
            targetY % (instanceRef.current.itemHeight * (numImages.length - 1));

          const columnElement = columnRefs.current[i]?.current;
          if (!columnElement) continue;
          columnElement.style.transform = `translateY(${finalY}px)`;
        }
        return;
      }
      // 计算每个数字位对应进度的滚动距离
      for (let i = 0; i < digitLength; i++) {
        const moveTimes = Math.floor(num / decimalWeights[i]);
        const targetY = moveTimes * -instanceRef.current.itemHeight;
        const translateY = easedProgess * targetY;

        // 防止溢出
        const finalY =
          translateY %
          (instanceRef.current.itemHeight * (numImages.length - 1));

        const columnElement = columnRefs.current[i]?.current;
        if (!columnElement) continue;
        columnElement.style.transform = `translateY(${finalY}px)`;
      }
      instanceRef.current.animationFrameId = requestAnimationFrame(() =>
        rollingNum(start)
      );
    };
    useEffect(() => {
      instanceRef.current.animationFrameId &&
        cancelAnimationFrame(instanceRef.current.animationFrameId);
      instanceRef.current.animationFrameId = requestAnimationFrame(() =>
        rollingNum(Date.now())
      );
      return () => {
        instanceRef.current.animationFrameId &&
          cancelAnimationFrame(instanceRef.current.animationFrameId);
      };
    }, []);

    const widthRem = useMemo(() => {
      return `${numWidth / 75}rem`;
    }, [numWidth]);
    const heightRem = useMemo(() => {
      return `${numHeight / 75}rem`;
    }, [numHeight]);

    return (
      <div
        className={cs(styles.RollingNumber)}
        {...props}
        style={containerStyles}
      >
        {decimalWeights.map((_, index) => (
          <div
            className={styles.NumberItem}
            style={{ width: widthRem, height: heightRem }}
            key={index}
          >
            <div
              className={styles.NumberColumn}
              ref={columnRefs.current[index]}
            >
              {numImages.map((item) => (
                <div>
                  <img
                    src={item}
                    alt={item}
                    style={{ width: widthRem, height: heightRem }}
                  ></img>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
);

export default RollingNumber;
