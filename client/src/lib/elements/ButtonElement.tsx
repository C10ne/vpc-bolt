import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ButtonElement } from './types';
import { Link, Settings } from 'lucide-react';

interface ButtonElementProps {
  element: ButtonElement;
  isSelected?: boolean;
  isEditing?: boolean;
  onUpdate?: (updates: Partial<ButtonElement>) => void;
  onSelect?: () => void;
  previewMode?: boolean;
}

export default function ButtonElementComponent({
  element,
  isSelected = false,
  isEditing = false,
  onUpdate,
  onSelect,
  previewMode = false
}: ButtonElementProps) {
  const [editingText, setEditingText] = useState(element.content.text);
  const [showSettings, setShowSettings] = useState(false);
  const [editingHref, setEditingHref] = useState(element.content.href || '');
  
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
  
  const handleVariantChange = (variant: 'primary' | 'secondary' | 'outline') => {
    if (onUpdate) {
      onUpdate({
        properties: {
          ...element.properties,
          variant
        }
      });
    }
  };
  
  const handleSizeChange = (size: 'sm' | 'md' | 'lg') => {
    if (onUpdate) {
      onUpdate({
        properties: {
          ...element.properties,
          size
        }
      });
    }
  };
  
  const handleHrefUpdate = () => {
    if (onUpdate) {
      onUpdate({
        content: {
          ...element.content,
          href: editingHref
        }
      });
    }
    setShowSettings(false);
  };
  
  const getVariantClasses = () => {
    const variant = element.properties.variant;
    const size = element.properties.size || 'md';
    
    const variantClasses = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700',
      secondary: 'bg-gray-600 text-white hover:bg-gray-700',
      outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
    };
    
    const sizeClasses = {
      sm: 'px-3 py-1 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg'
    };
    
    return `${variantClasses[variant]} ${sizeClasses[size]}`;
  };
  
  const elementStyles: React.CSSProperties = {
    color: element.style?.textColor,
    backgroundColor: element.style?.backgroundColor,
    padding: element.style?.padding,
    margin: element.style?.margin,
  };
  
  return (
    <div 
      className={cn(
        "element-container relative group inline-block",
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
          {/* Variant selector */}
          <select
            value={element.properties.variant}
            onChange={(e) => {
              e.stopPropagation();
              handleVariantChange(e.target.value as 'primary' | 'secondary' | 'outline');
            }}
            className="px-2 py-1 text-xs border rounded"
            onClick={(e) => e.stopPropagation()}
          >
            <option value="primary">Primary</option>
            <option value="secondary">Secondary</option>
            <option value="outline">Outline</option>
          </select>
          
          {/* Size selector */}
          <select
            value={element.properties.size || 'md'}
            onChange={(e) => {
              e.stopPropagation();
              handleSizeChange(e.target.value as 'sm' | 'md' | 'lg');
            }}
            className="px-2 py-1 text-xs border rounded"
            onClick={(e) => e.stopPropagation()}
          >
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
          </select>
          
          {/* Link settings */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowSettings(!showSettings);
            }}
            className="px-2 py-1 text-xs font-medium rounded transition bg-gray-100 text-gray-700 hover:bg-gray-200"
            title="Link settings"
          >
            <Link className="w-3 h-3" />
          </button>
        </div>
      )}
      
      {/* Link Settings Panel */}
      {showSettings && !previewMode && (
        <div className="absolute -top-20 left-0 z-20 bg-white shadow-lg border rounded p-2 min-w-64">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Link URL:
          </label>
          <input
            type="url"
            value={editingHref}
            onChange={(e) => setEditingHref(e.target.value)}
            placeholder="https://example.com"
            className="w-full px-2 py-1 text-xs border rounded mb-2"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="flex space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleHrefUpdate();
              }}
              className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowSettings(false);
                setEditingHref(element.content.href || '');
              }}
              className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      <button
        className={cn(
          "font-medium rounded transition-all duration-200 outline-none",
          getVariantClasses(),
          !previewMode && element.editable && !element.locked && "focus-within:ring-2 focus-within:ring-blue-500"
        )}
        style={elementStyles}
        onClick={(e) => {
          if (previewMode && element.content.href) {
            window.open(element.content.href, '_blank');
          } else if (!previewMode) {
            e.preventDefault();
          }
        }}
        data-element-id={element.id}
        data-element-type="button"
      >
        <span
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
          className="outline-none"
        >
          {editingText}
        </span>
      </button>
      
      {/* Element Type Indicator */}
      {isSelected && !previewMode && (
        <div className="absolute -bottom-6 left-0 text-xs text-gray-500 bg-white px-2 py-1 rounded shadow-sm border">
          Button • {element.properties.variant} • {element.editable ? 'Editable' : 'Read-only'}
        </div>
      )}
    </div>
  );
}