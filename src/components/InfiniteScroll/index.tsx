import { useEffect, useRef, useState, useCallback } from "react";
import styles from "./index.module.scss";
import cs from "classnames";

const InfiniteScroll: React.FC = () => {
  const repeatArr = Array.from({ length: 3 });
  const dataList = Array.from({ length: 50 });

  const [isNeedScroll, setIsNeedScroll] = useState(true);
  const [isDraggingState, setIsDraggingState] = useState(false);

  const scrollContentRef = useRef<HTMLDivElement>(null);
  const singleChildrenWidthRef = useRef<number>(0);
  const animationIdRef = useRef<number>(0);
  const ratio = useRef<number>(0);
  const scrollPosition = useRef<number>(0);

  // 鼠标拖拽相关状态
  const isDragging = useRef<boolean>(false);
  const startX = useRef<number>(0);
  const startScrollPosition = useRef<number>(0);

  const animate = useCallback(() => {
    if (!scrollContentRef.current || isDragging.current) {
      if (!isDragging.current) {
        animationIdRef.current = requestAnimationFrame(animate);
      }
      return;
    }

    // 使用 transform 替代 scrollLeft 以获得更好的性能
    scrollPosition.current += 1;
    const singleChildrenWidth = singleChildrenWidthRef.current;
    const maxScroll = (2 + ratio.current) * singleChildrenWidth;
    const minScroll = ratio.current * singleChildrenWidth;

    if (
      scrollPosition.current >= maxScroll ||
      scrollPosition.current < minScroll
    ) {
      scrollPosition.current =
        singleChildrenWidth + (scrollPosition.current % singleChildrenWidth);
    }

    // 使用 transform 进行 GPU 加速
    scrollContentRef.current.style.transform = `translateX(-${scrollPosition.current}px)`;

    animationIdRef.current = requestAnimationFrame(animate);
  }, []);

  // 鼠标事件处理函数
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    setIsDraggingState(true);
    startX.current = e.clientX;
    startScrollPosition.current = scrollPosition.current;

    // 停止自动滚动动画
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
    }

    // 阻止默认行为和事件冒泡
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current || !scrollContentRef.current) return;

    const deltaX = e.clientX - startX.current;
    const newScrollPosition = startScrollPosition.current - deltaX;

    scrollPosition.current = newScrollPosition;
    scrollContentRef.current.style.transform = `translateX(-${newScrollPosition}px)`;

    e.preventDefault();
  }, []);

  const handleMouseUp = useCallback(() => {
    if (isDragging.current) {
      isDragging.current = false;
      setIsDraggingState(false);

      // 重新启动自动滚动动画
      animationIdRef.current = requestAnimationFrame(animate);
    }
  }, [animate]);

  const handleMouseLeave = useCallback(() => {
    if (isDragging.current) {
      isDragging.current = false;
      setIsDraggingState(false);

      // 重新启动自动滚动动画
      animationIdRef.current = requestAnimationFrame(animate);
    }
  }, [animate]);

  useEffect(() => {
    const scrollElement = scrollContentRef.current;
    if (scrollElement) {
      const firstChild = scrollElement.firstChild as HTMLElement;
      const childWidth = firstChild.getBoundingClientRect()?.width;
      const containerClientWidth = scrollElement.clientWidth;

      // 缓存计算结果
      singleChildrenWidthRef.current = childWidth;

      if (containerClientWidth >= childWidth) {
        setIsNeedScroll(false);
        return;
      }

      // 初始化滚动位置
      scrollPosition.current = childWidth;
      scrollElement.style.transform = `translateX(-${childWidth}px)`;

      // 预计算超出容器的比例
      ratio.current = 1 - containerClientWidth / childWidth;

      animationIdRef.current = requestAnimationFrame(animate);
    }

    // 修复内存泄漏：正确的清理函数位置
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [animate]);

  // 添加全局鼠标事件监听器
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !scrollContentRef.current) return;

      const deltaX = e.clientX - startX.current;
      const newScrollPosition = startScrollPosition.current - deltaX;

      scrollPosition.current = newScrollPosition;
      scrollContentRef.current.style.transform = `translateX(-${newScrollPosition}px)`;
    };

    const handleGlobalMouseUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        setIsDraggingState(false);

        // 重新启动自动滚动动画
        animationIdRef.current = requestAnimationFrame(animate);
      }
    };

    document.addEventListener("mousemove", handleGlobalMouseMove);
    document.addEventListener("mouseup", handleGlobalMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [animate]);

  return (
    <div className={styles.main}>
      <div
        ref={scrollContentRef}
        className={cs(styles["scroll-content"], "scroll-content")}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{
          cursor: isDraggingState ? "grabbing" : "grab",
          userSelect: "none",
          WebkitUserSelect: "none",
        }}
      >
        {isNeedScroll ? (
          repeatArr.map((_, repeatIndex) => (
            <div
              className={cs(
                styles["scroll-content-inner"],
                "scroll-content-inner"
              )}
              key={repeatIndex}
            >
              {dataList.map((_, index) => (
                <div
                  className={cs(styles["scroll-item"], "scroll-item")}
                  key={`${repeatIndex}-${index}`}
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
            {/* 不需要滚动时渲染所有项目 */}
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
