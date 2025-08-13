import { useState } from "react";
import { DndContext, DragEndEvent, UniqueIdentifier } from "@dnd-kit/core";
import Draggable from "./components/draggable";
import Droppable from "./components/droppable";

export default function DndKit() {
  // 在DndContext进行事件监听
  const containers = ["A", "B", "C"];
  const [parent, setParent] = useState<UniqueIdentifier | null>(null);
  const handleDragEnd = (event: DragEndEvent) => {
    // over是指当前要拖进的容器
    const { over } = event;
    console.log("over", over);
    setParent(over?.id ?? null);
    console.log("handleDragEnd", event);
  };
  const draggableMarkup = (
    <Draggable id="draggable">
      <div>draggable</div>
    </Draggable>
  );
  return (
    <DndContext onDragEnd={handleDragEnd}>
      {!parent ? draggableMarkup : null}
      {containers.map((id) => (
        <Droppable id={id} key={id}>
          {parent === `droppable-${id}` ? draggableMarkup : `Droppable ${id}`}
        </Droppable>
      ))}
    </DndContext>
  );
}
