import { useDroppable } from "@dnd-kit/core";
export default function Droppable(
  props: React.PropsWithChildren<{ id: string }>
) {
  // 使用useDroppable
  // https://docs.dndkit.com/api-documentation/droppable/usedroppable#properties
  const { setNodeRef, isOver } = useDroppable({
    id: `droppable-${props.id}`,
    data: {
      id: props.id,
      desc: `我是可放置对象${props.id}`,
    },
  });
  console.log("isOver", isOver);
  const style = {
    color: isOver ? "red" : "#fff",
  };
  return (
    <div ref={setNodeRef} style={style}>
      {props.children}
    </div>
  );
}
