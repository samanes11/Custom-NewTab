import { useState } from "react";

export function useDragReorder<T>(items: T[], onReorder: (next: T[]) => void) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  function getItemProps(index: number) {
    return {
      draggable: true,
      onDragStart: (e: React.DragEvent) => {
        e.stopPropagation();
        setDraggedIndex(index);
      },
      onDragEnter: (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (index !== draggedIndex) setOverIndex(index);
      },
      onDragOver: (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
      },
      onDrop: (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (draggedIndex === null || draggedIndex === index) return;
        const next = [...items];
        const [moved] = next.splice(draggedIndex, 1);
        next.splice(index, 0, moved);
        onReorder(next);
        setDraggedIndex(null);
        setOverIndex(null);
      },
      onDragEnd: (e: React.DragEvent) => {
        e.stopPropagation();
        setDraggedIndex(null);
        setOverIndex(null);
      },
      isDragging: draggedIndex === index,
      isOver: overIndex === index && draggedIndex !== index,
    };
  }

  return { getItemProps };
}