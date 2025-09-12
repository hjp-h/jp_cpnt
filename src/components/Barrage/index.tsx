import { useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";

type Props = {
  rows?: number;
  triggerRatio?: number;
};

type PoolDataType = {
  id: number;
  data: number;
};

enum BarrageStatus {
  PREPARE = "prepare",
  RUNNING = "running",
  PASSED = "passed",
}

type BarrageDataType = {
  x: number;
  status: BarrageStatus;
  dom: HTMLDivElement;
  width: number;
};

const Barrage: React.FC<Props> = ({ rows = 3, triggerRatio = 0.2 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const containerWidthRef = useRef<number>(0);
  //  数据池
  const poolListRef = useRef<PoolDataType[]>(
    Array.from({ length: 30 }).map((_, index) => ({ id: index, data: index }))
  );
  //  弹幕数据
  const barrageListRef = useRef<BarrageDataType[][]>(
    Array.from({ length: rows }).map(() => [])
  );

  const usedIdSetRef = useRef<Set<number>>(new Set());

  // 插入数据行判断
  /**
   * 1. 当前行是空的
   * 2. 当前行不是空的 但是所有弹幕超出了屏幕
   * 3. 当前行不是空的 但是需要插入一条弹幕了
   * @returns
   */
  // 随机时间控制 避免过于密集
  const randomTimeRef = useRef<number>(0);
  const getRow = () => {
    if (Date.now() <= randomTimeRef.current) {
      return;
    }
    randomTimeRef.current = Date.now() + Math.random() * 1000 + 1000;
    // 初始化情况 随机插入
    const isInit = barrageListRef.current.some((item) => item.length === 0);
    if (isInit) {
      const restRow = barrageListRef.current
        .map((item, index) => ({ len: item.length, index }))
        .filter((item) => item.len === 0);
      const availableRow =
        restRow[Math.floor(Math.random() * restRow.length)].index;
      barrageListRef.current[availableRow] = [];
      return availableRow;
    }
    for (let i = 0; i < rows; i++) {
      const currentBarrageRow = barrageListRef.current[i];
      // 是否是空行
      const isEmpty = !currentBarrageRow.length;
      // 是否全部弹幕都超出了屏幕
      const isAllPassed = currentBarrageRow.every(
        (barrageItem) => barrageItem.status === BarrageStatus.PASSED
      );
      // 是否需要插入弹幕
      const isNeedInsert = currentBarrageRow
        .filter((item) => item.status === BarrageStatus.RUNNING)
        .every(
          (barrageItem) =>
            barrageItem.x <=
            containerWidthRef.current -
              barrageItem.width -
              containerWidthRef.current * triggerRatio
        );
      if (isAllPassed || isNeedInsert || isEmpty) {
        return i;
      }
    }
    return;
  };

  // 获取弹幕原始数据源
  const getNewPoolDataItem = () => {
    const poolData = poolListRef.current;
    const index = poolData.findIndex(
      (item) => !usedIdSetRef.current.has(item.id)
    );
    if (index === -1) {
      usedIdSetRef.current.clear();
      return;
    }
    usedIdSetRef.current.add(poolData[index].id);
    return poolData[index];
  };

  // 弹幕数据
  const createNewBarrageDom = (row: number) => {
    const dom = document.createElement("div");
    // 这里的BarrageItem 一定要开启绝对定位 否则会导致弹幕位置计算错误
    dom.classList.add(styles.BarrageItem);
    dom.style.top = `${row * 86}px`;
    dom.style.willChange = "transform";
    return dom;
  };

  const getNewBarrageData = (row: number) => {
    const passedBarrageData = barrageListRef.current[row].find(
      (item) => item.status === BarrageStatus.PASSED
    );
    if (passedBarrageData) {
      return passedBarrageData;
    }
    const newBarrageDom = createNewBarrageDom(row);
    return {
      x: 0,
      status: BarrageStatus.PREPARE,
      dom: newBarrageDom,
      width: 0,
    };
  };

  const addBarrage = () => {
    const row = getRow();
    if (typeof row !== "number") {
      return;
    }
    // 当前行弹幕数据
    const currentBarrageRow = barrageListRef.current[row];
    // 获取数据 没被使用过的数据
    const newPoolDataItem = getNewPoolDataItem();
    if (!newPoolDataItem) {
      return;
    }
    // 新增弹幕数据
    const newBarrageData = getNewBarrageData(row);
    if (newBarrageData.status === BarrageStatus.PREPARE) {
      currentBarrageRow.push(newBarrageData);
    }
    mountBarrage(newBarrageData, newPoolDataItem);
  };

  const mountBarrage = async (
    barrageData: BarrageDataType,
    newPoolDataItem: PoolDataType
  ) => {
    barrageData.dom.style.opacity = "0";
    barrageData.dom.innerHTML = `<div style="width: 100px; height: 50px; background-color: red;">${newPoolDataItem.data}</div>`;
    if (barrageData.status === BarrageStatus.PREPARE) {
      containerRef.current?.appendChild(barrageData.dom);
    }
    // 等待一帧 获取位置更准确
    await new Promise((resolve) => requestAnimationFrame(resolve));
    // 初始化状态
    barrageData.status = BarrageStatus.RUNNING;
    barrageData.x = containerRef.current?.clientWidth || 0;
    barrageData.width = barrageData.dom.clientWidth;
    barrageData.dom.style.transform = `translateX(${barrageData.x}px)`;
    barrageData.dom.style.opacity = "1";
  };

  const lastUpdateTimeRef = useRef<number>(0);
  const rate = 1000 / 60;
  const updateAllBarrage = () => {
    const now = Date.now();
    const deltaTime = now - lastUpdateTimeRef.current;
    if (deltaTime < rate) {
      return;
    }
    lastUpdateTimeRef.current = now;
    // 遍历所有弹幕数据
    barrageListRef.current.forEach((barrageRow) => {
      barrageRow.forEach((barrageData) => {
        if (barrageData.status === BarrageStatus.RUNNING) {
          // 弹幕移动
          barrageData.x -= 1;
          barrageData.dom.style.transform = `translateX(${barrageData.x}px)`;
        }
        // 弹幕超出屏幕
        const isPassed = barrageData.x < -barrageData.width;
        if (isPassed) {
          barrageData.status = BarrageStatus.PASSED;
        }
      });
    });
  };

  const animate = () => {
    if (containerWidthRef.current > 0) {
      addBarrage();
      updateAllBarrage();
    }
    animationIdRef.current = requestAnimationFrame(animate);
  };

  // 获取容器宽度
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        console.log(containerRef.current.offsetWidth);
        containerWidthRef.current = containerRef.current.offsetWidth;
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const animationIdRef = useRef<number>(0);
  useEffect(() => {
    animationIdRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animationIdRef.current);
    };
  }, []);
  return <div ref={containerRef} className={styles.Barrage}></div>;
};

export default Barrage;
