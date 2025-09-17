import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import Draggable from "./components/draggable";
import Droppable from "./components/droppable";
import styles from "./index.module.scss";
import DragOverlayDemo from "./DragOverlayDemo";
import SortableDemo from "./SortableDemo";

export default function DndKit() {
  // 在DndContext进行事件监听
  const containers = ["A", "B", "C"];
  const [parent, setParent] = useState<UniqueIdentifier | null>(null);
  const handleDragEnd = (event: DragEndEvent) => {
    // over是指当前要拖进的容器 active是指当前拖拽的对象
    const { over, active } = event;
    setParent(over?.id ?? null);
    console.log("over", over);
    console.log("active", active);
    console.log("handleDragEnd", event);
  };
  const draggableMarkup = (
    <Draggable id="draggable">
      <div className={styles.DraggableContainer}>draggable</div>
    </Draggable>
  );
  // 需要将draggable 和 droppable 放到DndContext中 才可进行交互
  // DndContext 可进行嵌套 但是嵌套 DndContext，useDroppable 和 useDraggable 钩子只能访问该上下文中的其他可拖放节点。
  // 如果多个 DndContext 提供程序正在侦听同一事件，则事件将由第一个 DndContext 捕获
  // DndContext属性 https://docs.dndkit.com/api-documentation/context-provider#props

  // sensor 用于定义 “拖拽事件的输入源”，也就是告诉系统 “用户是如何触发拖拽的”。
  // 内置传感器是： Pointer、Mouse、 Touch、 Keyboard
  // Pointer是默认传感器之一，能自动处理
  // ● 鼠标点击拖拽
  // ● 手指触摸拖拽
  // ● 手写笔拖拽

  // const mouseSensor = useSensor(MouseSensor);
  // const keyboardSensor = useSensor(KeyboardSensor);
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      // 鼠标点击拖拽超过10px才触发
      // distance: 10,
      // 触摸按下后，至少等待 250ms 才触发拖拽。
      delay: 250,
      // 在延时等待期间，允许手指移动 最多 5px，如果移动超过 5px 就不会触发拖拽（认为是普通滑动）。
      tolerance: 5,
    },
  });
  const sensors = useSensors(touchSensor);
  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
      <div className={styles.DefaultLayer}>
        {!parent ? draggableMarkup : null}
        {containers.map((id) => (
          <Droppable id={id} key={id}>
            <div className={styles.DroppableContainer}>
              {parent === `droppable-${id}`
                ? draggableMarkup
                : `Droppable ${id}`}
            </div>
          </Droppable>
        ))}
      </div>
      <DragOverlayDemo />
      <SortableDemo />
    </DndContext>
  );
}
