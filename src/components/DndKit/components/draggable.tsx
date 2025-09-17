import { useDraggable } from "@dnd-kit/core";
export default function Draggable(
  props: React.PropsWithChildren<{ id: string }>
) {
  // 使用useDraggable
  // https://docs.dndkit.com/api-documentation/draggable/usedraggable#properties
  const { setNodeRef, attributes, listeners, transform } = useDraggable({
    id: `draggable-${props.id}`,
    data: {
      id: props.id,
      desc: `我是可拖拽对象${props.id}`,
    },
  });
  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : {};
  return (
    <div ref={setNodeRef} {...attributes} {...listeners} style={style}>
      {props.children}
    </div>
  );
}
