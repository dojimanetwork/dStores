import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { XMarkIcon, ArrowsPointingOutIcon } from '@heroicons/react/24/outline';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  layoutHTML: string;
  onRegenerate: (modifications: string) => void;
  onConfirm: () => void;
}

export function PreviewModal({ isOpen, onClose, layoutHTML, onRegenerate, onConfirm }: PreviewModalProps) {
  const [modifications, setModifications] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [draggedElement, setDraggedElement] = useState<HTMLElement | null>(null);

  if (!isOpen) return null;

  const handleDragStart = (e: React.DragEvent) => {
    const target = e.target as HTMLElement;
    const section = target.closest('.draggable-section') as HTMLElement;
    if (section) {
      setIsDragging(true);
      setDraggedElement(section);
      e.dataTransfer.setData('text/plain', '');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isDragging || !draggedElement) return;

    const sections = document.querySelectorAll('.draggable-section');
    const mouseY = e.clientY;

    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const sectionMiddle = rect.top + rect.height / 2;

      if (mouseY < sectionMiddle) {
        section.parentNode?.insertBefore(draggedElement, section);
      } else {
        section.parentNode?.insertBefore(draggedElement, section.nextSibling);
      }
    });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedElement(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white w-full h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Website Preview</h2>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => onRegenerate(modifications)}
            >
              Regenerate
            </Button>
            <Button onClick={onConfirm}>
              Confirm Design
            </Button>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Preview Area */}
        <div 
          className="flex-1 overflow-auto p-4"
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div 
            className="max-w-4xl mx-auto bg-white"
            dangerouslySetInnerHTML={{ 
              __html: layoutHTML.replace(
                /<section/g, 
                '<section class="draggable-section" draggable="true"'
              ) 
            }} 
            onDragStart={handleDragStart}
          />
        </div>

        {/* Footer */}
        <div className="border-t p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-2">
              <ArrowsPointingOutIcon className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-500">
                Drag sections to reorder them
              </span>
            </div>
            <Input
              placeholder="Enter suggested modifications..."
              value={modifications}
              onChange={(e) => setModifications(e.target.value)}
              className="mb-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 