import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ParagraphElement } from './types';

interface ParagraphElementProps {
  element: ParagraphElement;
  isSelected?: boolean;
  isEditing?: boolean;
  onUpdate?: (updates: Partial<ParagraphElement>) => void;
  onSelect?: () => void;
  previewMode?: boolean;
}

export default function ParagraphElementComponent({
  element,
  isSelected = false,
  isEditing = false,
  onUpdate,
  onSelect,
  previewMode = false
}: ParagraphElementProps) {
  const [editingText, setEditingText] = useState(element.content.text);
  
  const handleTextEdit = (newText: string) => {
    setEditingText(newText);
  };
  
  const handleTextComplete = () => {
    if (onUpdate && editingText !== element.content.text) {
      onUpdate({
        content: {
          ...element.content,
          text: editingText
        }
      });
    }
  };
  
  const elementStyles: React.CSSProperties = {
    color: element.style?.textColor,
    backgroundColor: element.style?.backgroundColor,
    fontSize: element.style?.fontSize,
    fontWeight: element.style?.fontWeight,
    textAlign: element.style?.textAlign,
    padding: element.style?.padding,
    margin: element.style?.margin,
  };
  
  return (
    <div 
      className={cn(
        "element-container relative group",
        isSelected && !previewMode && "ring-2 ring-blue-500",
        element.locked && "cursor-not-allowed opacity-75"
      )}
      onClick={(e) => {
        if (!previewMode && !element.locked) {
          e.stopPropagation();
          onSelect?.();
        }
      }}
    >
      {/* Quick Controls */}
      {isSelected && !previewMode && !element.locked && (
        <div className="absolute -top-8 left-0 z-10 flex space-x-1 bg-white shadow-sm border rounded p-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Focus the paragraph for editing
              const p = e.currentTarget.parentElement?.nextElementSibling as HTMLElement;
              p?.focus();
            }}
            className="px-2 py-1 text-xs font-medium rounded transition bg-gray-100 text-gray-700 hover:bg-gray-200"
            title="Edit text"
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // TODO: Implement rich text formatting
            }}
            className="px-2 py-1 text-xs font-medium rounded transition bg-gray-100 text-gray-700 hover:bg-gray-200"
            title="Format text"
          >
            Format
          </button>
        </div>
      )}
      
      <p
        className={cn(
          "text-base leading-relaxed outline-none transition-all duration-200",
          isSelected && !previewMode && "bg-blue-50"
        )}
        style={elementStyles}
        contentEditable={!previewMode && element.editable && !element.locked}
        suppressContentEditableWarning
        onInput={(e) => {
          const text = e.currentTarget.textContent || '';
          handleTextEdit(text);
        }}
        onBlur={() => {
          handleTextComplete();
        }}
        data-element-id={element.id}
        data-element-type="paragraph"
      >
        {editingText}
      </p>
      
      {/* Element Type Indicator */}
      {isSelected && !previewMode && (
        <div className="absolute -bottom-6 left-0 text-xs text-gray-500 bg-white px-2 py-1 rounded shadow-sm border">
          Paragraph • {element.editable ? 'Editable' : 'Read-only'}
        </div>
      )}
    </div>
  );
}