import { useState } from "react";
import {
  restrictToWindowEdges,
  restrictToParentElement,
} from "@dnd-kit/modifiers";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  UniqueIdentifier,
} from "@dnd-kit/core";
import Draggable from "./components/draggable";
import styles from "./index.module.scss";

function Item(props: { value: string }) {
  return <div className={styles.ScrollItem}>{props.value}</div>;
}

function OverlayItem(props: { value: string }) {
  return <div className={styles.OverlayItem}>{props.value}</div>;
}

export default function DragOverlayDemo() {
  const [items] = useState<string[]>(["1", "2", "3", "4", "5"]);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id);
  }

  function handleDragEnd() {
    setActiveId(null);
  }
  return (
    <DndContext
      modifiers={[restrictToParentElement]}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className={styles.ScrollContainer}>
        {items.map((id) => (
          <Draggable key={id} id={id}>
            <Item value={`Item ${id}`} />
          </Draggable>
        ))}
      </div>
      {/* 拖拽的展示层 */}
      <DragOverlay
        // 限制拖拽范围
        // modifiers={[restrictToWindowEdges]}
        // 动画配置
        dropAnimation={{
          duration: 500,
          easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
        }}
      >
        {activeId ? <OverlayItem value={`Item ${activeId}`} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
