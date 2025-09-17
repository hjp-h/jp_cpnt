import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";

type Props = React.PropsWithChildren<{
  id: string | number;
}>;

export function SortableItem(props: Props) {
  const { id, children } = props;
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // 将拖拽监听器传递给子组件
  const childrenWithProps = React.cloneElement(children as React.ReactElement, {
    dragHandleProps: { ...attributes, ...listeners }
  });

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      {childrenWithProps}
    </div>
  );
}
