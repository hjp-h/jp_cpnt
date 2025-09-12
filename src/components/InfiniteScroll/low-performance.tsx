import { useEffect, useRef, useState } from "react";
import styles from "./low-performance.module.scss";
import cs from "classnames";
const fps = 1000 / 60;
const InfiniteScroll: React.FC = () => {
  const repeatArr = Array.from({ length: 3 });
  const dataList = Array.from({ length: 50 });

  const [isNeedScroll, setIsNeedScroll] = useState(true);

  const scrollContentRef = useRef<HTMLDivElement>(null);
  const singleChildrenWidthRef = useRef<number>(0);
  const animationIdRef = useRef<number>(0);
  const lastAnimationTime = useRef<number>(0);
  const ratio = useRef<number>(0);

  const animate = () => {
    if (
      !scrollContentRef.current ||
      Date.now() - lastAnimationTime.current < fps
    ) {
      animationIdRef.current = requestAnimationFrame(animate);
      return;
    }
    lastAnimationTime.current = Date.now();
    scrollContentRef.current.scrollLeft += 1;
    const scrollLeft = scrollContentRef.current.scrollLeft;
    const singleChildrenWidth = singleChildrenWidthRef.current;
    if (
      scrollLeft >= (2 + ratio.current) * singleChildrenWidth ||
      scrollLeft < ratio.current * singleChildrenWidth
    ) {
      // scrollLeft % singleChildrenWidth 可见区域的宽度
      scrollContentRef.current.scrollLeft =
        singleChildrenWidth + (scrollLeft % singleChildrenWidth);
    }
    animationIdRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (scrollContentRef.current) {
      const firstChild = scrollContentRef.current.firstChild as HTMLElement;
      singleChildrenWidthRef.current =
        firstChild.getBoundingClientRect()?.width;
      if (
        scrollContentRef.current.clientWidth >= singleChildrenWidthRef.current
      ) {
        setIsNeedScroll(false);
        return;
      }
      scrollContentRef.current.scrollLeft = singleChildrenWidthRef.current;
      // 超出容器的比例
      ratio.current =
        1 -
        scrollContentRef.current.clientWidth / singleChildrenWidthRef.current;
      animationIdRef.current = requestAnimationFrame(animate);
      return () => {
        cancelAnimationFrame(animationIdRef.current);
      };
    }
  }, []);
  return (
    <div className={styles.main}>
      <div
        ref={scrollContentRef}
        className={cs(styles["scroll-content"], "scroll-content")}
      >
        {isNeedScroll ? (
          repeatArr.map((_, index) => (
            <div
              className={cs(
                styles["scroll-content-inner"],
                "scroll-content-inner"
              )}
              key={index}
            >
              {dataList.map((_, index) => (
                <div
                  className={cs(styles["scroll-item"], "scroll-item")}
                  key={index}
                >
                  {index}
                </div>
              ))}
            </div>
          ))
        ) : (
          <div
            className={cs(
              styles["scroll-content-inner"],
              "scroll-content-inner"
            )}
          >
            {dataList.map((_, index) => (
              <div
                className={cs(styles["scroll-item"], "scroll-item")}
                key={index}
              >
                {index}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InfiniteScroll;
