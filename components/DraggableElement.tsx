import React from 'react';

interface DraggableElementProps {
  type: string;
  label: string;
  icon: React.ReactNode;
  disabled?: boolean;
}

export function DraggableElement({ type, label, icon, disabled }: DraggableElementProps) {
  const handleDragStart = (e: React.DragEvent) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData('text/plain', type);
  };

  return (
    <div
      draggable={!disabled}
      onDragStart={handleDragStart}
      className={`flex items-center gap-2 p-2 bg-white border rounded ${
        disabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'cursor-move hover:bg-gray-50'
      }`}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
} 