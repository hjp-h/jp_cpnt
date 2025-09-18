import { gsap } from "gsap";
import { memo, useEffect, useRef } from "react";

const formatDuration = (duration: number) => {
  return isNaN(duration) || typeof +duration !== "number"
    ? 1
    : Math.max(0, duration);
};

const formatNumber = (num: number, decimalPlaces: number) => {
  const factor = Math.pow(10, decimalPlaces);
  return +(Math.floor(num * factor) / factor).toFixed(decimalPlaces);
};

const thousandBitSeparator = (
  num: number | string,
  char = ",",
  dealDecimal = false
) => {
  const [int = "0", decimal = ""] = num.toString().split(".");
  const turnInteger = int.replace(/(\d)(?=(\d{3})+$)/g, ($1) => $1 + char);
  if (dealDecimal && decimal) {
    const turnDecimal = decimal.replace(
      /(\d)(?=(\d{3})+$)/g,
      ($1) => $1 + char
    );
    return `${turnInteger}.${turnDecimal}`;
  }
  return decimal ? `${turnInteger}.${decimal}` : turnInteger;
};

const hasDecimalPoint = (num: number) => {
  return num % 1 !== 0;
};

/**
 * 数字滚动动画组件，用于展示数字变化的动画效果
 * @param props
 * @param props.num - 目标数字
 * @param props.duration - 动画持续时间（秒），默认为0.6秒
 * @param props.isSeparatorThousandBit - 是否使用千分位分隔符，默认为true
 * @param props.decimalPlaces - 小数位数，默认为2
 * @example
 * // 基础用法
 * <RollingNumber num={1000} />
 *
 * // 自定义动画时长和小数位数
 * <RollingNumber
 *   num={1234.567}
 *   duration={1}
 *   decimalPlaces={3}
 * />
 *
 * // 禁用千分位分隔
 * <RollingNumber
 *   num={1000000}
 *   isSeparatorThousandBit={false}
 * />
 */
export interface RollingNumberProps extends React.HTMLProps<HTMLSpanElement> {
  /** 目标数字 */
  num: number;
  /** 动画持续时间（秒），默认为0.6秒 */
  duration?: number;
  /** 是否使用千分位分隔符，默认为true */
  isSeparatorThousandBit?: boolean;
  /** 小数位数，默认为2 */
  decimalPlaces?: number;
}

const RollingNumber = memo(
  ({
    num = 0,
    duration = 0.6,
    isSeparatorThousandBit = true,
    decimalPlaces = 2,
    ...restProps
  }: RollingNumberProps) => {
    const numberRef = useRef<HTMLSpanElement | null>(null);
    const formattedDuration = formatDuration(duration);
    const target = useRef({
      value: 0,
    });

    useEffect(() => {
      const isHasDecimalPoint = hasDecimalPoint(num);
      const defaultDecimalPlaces = isHasDecimalPoint
        ? Math.max(0, decimalPlaces)
        : 0;
      const effect = gsap.to(target.current, {
        value: num,
        duration: formattedDuration,
        ease: "power1.inOut",
        onUpdate: () => {
          if (numberRef.current) {
            const processedNum = isSeparatorThousandBit
              ? thousandBitSeparator(
                  formatNumber(target.current.value, defaultDecimalPlaces)
                )
              : String(
                  formatNumber(target.current.value, defaultDecimalPlaces)
                );
            numberRef.current.textContent = processedNum;
          }
        },
      });

      return () => {
        effect.kill();
      };
    }, [num, formattedDuration, isSeparatorThousandBit, decimalPlaces]);

    return (
      <span ref={numberRef} {...restProps}>
        0
      </span>
    );
  }
);

export default RollingNumber;
