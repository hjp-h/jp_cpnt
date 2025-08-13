import { useDroppable } from "@dnd-kit/core";
import $style from "../index.module.scss";
export default function Droppable(
  props: React.PropsWithChildren<{ id: string }>
) {
  // 使用useDroppable
  const { setNodeRef, isOver } = useDroppable({
    id: `droppable-${props.id}`,
  });
  console.log("isOver", isOver);
  const style = {
    color: isOver ? "red" : "#fff",
  };
  return (
    <div ref={setNodeRef} className={$style.DroppableContainer} style={style}>
      {props.children}
    </div>
  );
}
