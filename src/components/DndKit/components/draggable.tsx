import { useDraggable } from "@dnd-kit/core";
import $style from "../index.module.scss";
export default function Draggable(
  props: React.PropsWithChildren<{ id: string }>
) {
  // 使用useDraggable
  const { setNodeRef, attributes, listeners, transform } = useDraggable({
    id: `draggable-${props.id}`,
  });
  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : {};
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={$style.DraggableContainer}
      style={style}
    >
      {props.children}
    </div>
  );
}
