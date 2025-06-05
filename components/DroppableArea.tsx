import React from 'react';

interface DroppableAreaProps {
  onDrop: (type: string, position: {x: number, y: number}) => void;
  children: React.ReactNode;
}

export function DroppableArea({ onDrop, children }: DroppableAreaProps) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('text/plain');
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    onDrop(type, { x, y });
  };

  return (
    <div 
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="relative"
    >
      {children}
    </div>
  );
} 