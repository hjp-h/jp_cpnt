import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  useDroppable,
} from "@dnd-kit/core";

import styles from "./index.module.scss";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./components/sortable";
// import {
//   restrictToParentElement,
// } from "@dnd-kit/modifiers";
import { DragOutlined, DeleteOutlined } from "@ant-design/icons";
import { useState } from "react";

// 实现一个左右布局的拖拽程序
// 左边的容器内有多个元素，每个元素都可以拖拽到右边的容器内
// 右边的容器内也有多个元素，每个元素都可以拖拽到左边的容器内

type ItemType = {
  id: string;
  name: string;
};

const INITIAL_LEFT_ITEMS: ItemType[] = Array.from(
  { length: 15 },
  (_, index) => ({
    id: `left-item-${index}`,
    name: `Left Item ${index}`,
  })
);

const INITIAL_RIGHT_ITEMS: ItemType[] = Array.from(
  { length: 10 },
  (_, index) => ({
    id: `right-item-${index}`,
    name: `Right Item ${index}`,
  })
);

function Item({
  data,
  dragHandleProps,
  onDelete,
}: {
  data: ItemType;
  dragHandleProps?: any;
  onDelete?: (id: string) => void;
}) {
  const { id, name } = data;
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuPosition({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };

  const handleDelete = () => {
    onDelete?.(id);
    setShowContextMenu(false);
  };

  const handleClickOutside = () => {
    setShowContextMenu(false);
  };

  return (
    <>
      <div
        className={styles.UltraItem}
        onContextMenu={handleContextMenu}
        onClick={handleClickOutside}
      >
        <DragOutlined {...dragHandleProps} className={styles.DragHandle} />
        <span className={styles.UltraItemName}>{name}</span>
      </div>

      {showContextMenu && (
        <>
          <div
            className={styles.ContextMenuOverlay}
            onClick={handleClickOutside}
          />
          <div
            className={styles.ContextMenu}
            style={{
              left: menuPosition.x,
              top: menuPosition.y,
            }}
          >
            <div className={styles.ContextMenuItem} onClick={handleDelete}>
              <DeleteOutlined />
              <span>删除</span>
            </div>
          </div>
        </>
      )}
    </>
  );
}

// 创建可拖放区域组件
function DroppableContainer({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });
  console.log("DroppableContainer", id, isOver);
  const className = `${
    id === "left-container" ? styles.UltraLeft : styles.UltraRight
  } ${isOver ? styles.dragOver : ""}`;

  return (
    <div ref={setNodeRef} className={className}>
      {children}
    </div>
  );
}

export default function UltraDemo() {
  const mouseSensor = useSensor(MouseSensor);
  const keyboardSensor = useSensor(KeyboardSensor);
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
  const sensors = useSensors(mouseSensor, keyboardSensor, touchSensor);

  const [leftItems, setLeftItems] = useState(INITIAL_LEFT_ITEMS);
  const [rightItems, setRightItems] = useState(INITIAL_RIGHT_ITEMS);
  const [activeItem, setActiveItem] = useState<ItemType | null>(null);

  // 删除左侧容器中的元素
  const handleDeleteLeftItem = (id: string) => {
    setLeftItems((items) => items.filter((item) => item.id !== id));
  };

  // 删除右侧容器中的元素
  const handleDeleteRightItem = (id: string) => {
    setRightItems((items) => items.filter((item) => item.id !== id));
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeId = active.id as string;

    // 找到被拖拽的元素
    const leftItem = leftItems.find((item) => item.id === activeId);
    const rightItem = rightItems.find((item) => item.id === activeId);

    setActiveItem(leftItem || rightItem || null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    // 这个函数确保拖拽过程中触发容器的isOver状态
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    console.log("active.id", active.id, "over?.id", over?.id);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // 判断拖拽的元素来自哪个容器
    const isActiveFromLeft = leftItems.some((item) => item.id === activeId);
    const isActiveFromRight = rightItems.some((item) => item.id === activeId);

    // 判断目标位置在哪个容器
    const isOverLeft =
      overId === "left-container" ||
      leftItems.some((item) => item.id === overId);
    const isOverRight =
      overId === "right-container" ||
      rightItems.some((item) => item.id === overId);

    // 同一容器内排序
    if (isActiveFromLeft && isOverLeft && activeId !== overId) {
      setLeftItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === activeId);
        const newIndex = items.findIndex((item) => item.id === overId);
        if (oldIndex !== -1 && newIndex !== -1) {
          return arrayMove(items, oldIndex, newIndex);
        }
        return items;
      });
    } else if (isActiveFromRight && isOverRight && activeId !== overId) {
      setRightItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === activeId);
        const newIndex = items.findIndex((item) => item.id === overId);
        if (oldIndex !== -1 && newIndex !== -1) {
          return arrayMove(items, oldIndex, newIndex);
        }
        return items;
      });
    }
    // 跨容器拖拽：从左到右
    else if (isActiveFromLeft && isOverRight) {
      const draggedItem = leftItems.find((item) => item.id === activeId);
      if (draggedItem) {
        setLeftItems((items) => items.filter((item) => item.id !== activeId));
        setRightItems((items) => {
          if (overId === "right-container") {
            return [...items, draggedItem];
          } else {
            const overIndex = items.findIndex((item) => item.id === overId);
            const newItems = [...items];
            newItems.splice(overIndex, 0, draggedItem);
            return newItems;
          }
        });
      }
    }
    // 跨容器拖拽：从右到左
    else if (isActiveFromRight && isOverLeft) {
      const draggedItem = rightItems.find((item) => item.id === activeId);
      if (draggedItem) {
        setRightItems((items) => items.filter((item) => item.id !== activeId));
        setLeftItems((items) => {
          if (overId === "left-container") {
            return [...items, draggedItem];
          } else {
            const overIndex = items.findIndex((item) => item.id === overId);
            const newItems = [...items];
            newItems.splice(overIndex, 0, draggedItem);
            return newItems;
          }
        });
      }
    }

    // 清除活动元素
    setActiveItem(null);
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      sensors={sensors}
      // modifiers={[restrictToParentElement]} // 移除此修饰符以允许跨容器拖拽
    >
      <div className={styles.UltraContainer}>
        <DroppableContainer id="left-container">
          <SortableContext
            items={leftItems.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            {leftItems.map((item) => (
              <SortableItem key={item.id} id={item.id}>
                <Item data={item} onDelete={handleDeleteLeftItem} />
              </SortableItem>
            ))}
          </SortableContext>
        </DroppableContainer>
        <DroppableContainer id="right-container">
          <SortableContext
            items={rightItems.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            {rightItems.map((item) => (
              <SortableItem key={item.id} id={item.id}>
                <Item data={item} onDelete={handleDeleteRightItem} />
              </SortableItem>
            ))}
          </SortableContext>
        </DroppableContainer>
      </div>
      <DragOverlay>
        {activeItem ? <Item data={activeItem} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
