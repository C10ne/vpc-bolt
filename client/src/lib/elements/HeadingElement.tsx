import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { HeadingElement, HeadingLevel } from './types';

interface HeadingElementProps {
  element: HeadingElement;
  isSelected?: boolean;
  isEditing?: boolean;
  onUpdate?: (updates: Partial<HeadingElement>) => void;
  onSelect?: () => void;
  previewMode?: boolean;
}

export default function HeadingElementComponent({
  element,
  isSelected = false,
  isEditing = false,
  onUpdate,
  onSelect,
  previewMode = false
}: HeadingElementProps) {
  const [editingText, setEditingText] = useState(element.content.text);
  
  const Tag = element.content.level as keyof JSX.IntrinsicElements;
  
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
  
  const handleLevelChange = (level: HeadingLevel) => {
    if (onUpdate) {
      onUpdate({
        content: {
          ...element.content,
          level
        }
      });
    }
  };
  
  // Default styles based on heading level
  const getDefaultStyles = (level: HeadingLevel) => {
    const styles = {
      h1: 'text-4xl font-bold',
      h2: 'text-3xl font-bold', 
      h3: 'text-2xl font-semibold',
      h4: 'text-xl font-semibold',
      h5: 'text-lg font-medium',
      h6: 'text-base font-medium'
    };
    return styles[level];
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
          {(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as HeadingLevel[]).map((level) => (
            <button
              key={level}
              onClick={(e) => {
                e.stopPropagation();
                handleLevelChange(level);
              }}
              className={cn(
                "px-2 py-1 text-xs font-medium rounded transition",
                element.content.level === level 
                  ? "bg-blue-500 text-white" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              {level.toUpperCase()}
            </button>
          ))}
        </div>
      )}
      
      <Tag
        className={cn(
          getDefaultStyles(element.content.level),
          "outline-none transition-all duration-200"
        )}
        style={elementStyles}
        contentEditable={!previewMode && element.editable && !element.locked}
        suppressContentEditableWarning
        onInput={(e) => {
          const text = e.currentTarget.textContent || '';
          handleTextEdit(text);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            e.currentTarget.blur();
          }
        }}
        onBlur={() => {
          handleTextComplete();
        }}
        data-element-id={element.id}
        data-element-type="heading"
      >
        {editingText}
      </Tag>
      
      {/* Element Type Indicator */}
      {isSelected && !previewMode && (
        <div className="absolute -bottom-6 left-0 text-xs text-gray-500 bg-white px-2 py-1 rounded shadow-sm border">
          {element.content.level.toUpperCase()} • {element.editable ? 'Editable' : 'Read-only'}
        </div>
      )}
    </div>
  );
}