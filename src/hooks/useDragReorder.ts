import { useState } from "react";

/**
 * Minimal drag-to-reorder built on native HTML5 DnD events, so we don't
 * pull in a whole drag-and-drop library for one reorderable list.
 */
export function useDragReorder<T>(items: T[], onReorder: (next: T[]) => void) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  function getItemProps(index: number) {
    return {
      draggable: true,
      onDragStart: () => setDraggedIndex(index),
      onDragEnter: (e: React.DragEvent) => {
        e.preventDefault();
        if (index !== draggedIndex) setOverIndex(index);
      },
      onDragOver: (e: React.DragEvent) => e.preventDefault(),
      onDrop: (e: React.DragEvent) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;
        const next = [...items];
        const [moved] = next.splice(draggedIndex, 1);
        next.splice(index, 0, moved);
        onReorder(next);
        setDraggedIndex(null);
        setOverIndex(null);
      },
      onDragEnd: () => {
        setDraggedIndex(null);
        setOverIndex(null);
      },
      isDragging: draggedIndex === index,
      isOver: overIndex === index && draggedIndex !== index,
    };
  }

  return { getItemProps };
}
