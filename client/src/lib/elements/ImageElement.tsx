import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ImageElement } from './types';
import { Upload, ExternalLink } from 'lucide-react';

interface ImageElementProps {
  element: ImageElement;
  isSelected?: boolean;
  isEditing?: boolean;
  onUpdate?: (updates: Partial<ImageElement>) => void;
  onSelect?: () => void;
  previewMode?: boolean;
}

export default function ImageElementComponent({
  element,
  isSelected = false,
  isEditing = false,
  onUpdate,
  onSelect,
  previewMode = false
}: ImageElementProps) {
  const [editingCaption, setEditingCaption] = useState(element.content.caption || '');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [newUrl, setNewUrl] = useState(element.content.src);
  
  const handleCaptionEdit = (newCaption: string) => {
    setEditingCaption(newCaption);
  };
  
  const handleCaptionComplete = () => {
    if (onUpdate && editingCaption !== element.content.caption) {
      onUpdate({
        content: {
          ...element.content,
          caption: editingCaption
        }
      });
    }
  };
  
  const handleUrlUpdate = () => {
    if (onUpdate && newUrl !== element.content.src) {
      onUpdate({
        content: {
          ...element.content,
          src: newUrl
        }
      });
    }
    setShowUrlInput(false);
  };
  
  const handleObjectFitChange = (objectFit: 'cover' | 'contain' | 'fill') => {
    if (onUpdate) {
      onUpdate({
        properties: {
          ...element.properties,
          objectFit
        }
      });
    }
  };
  
  const elementStyles: React.CSSProperties = {
    width: element.properties.width,
    height: element.properties.height,
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
              setShowUrlInput(!showUrlInput);
            }}
            className="px-2 py-1 text-xs font-medium rounded transition bg-gray-100 text-gray-700 hover:bg-gray-200"
            title="Change image URL"
          >
            <ExternalLink className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // TODO: Implement file upload
            }}
            className="px-2 py-1 text-xs font-medium rounded transition bg-gray-100 text-gray-700 hover:bg-gray-200"
            title="Upload image"
          >
            <Upload className="w-3 h-3" />
          </button>
          {/* Object fit controls */}
          <select
            value={element.properties.objectFit || 'cover'}
            onChange={(e) => {
              e.stopPropagation();
              handleObjectFitChange(e.target.value as 'cover' | 'contain' | 'fill');
            }}
            className="px-2 py-1 text-xs border rounded"
            onClick={(e) => e.stopPropagation()}
          >
            <option value="cover">Cover</option>
            <option value="contain">Contain</option>
            <option value="fill">Fill</option>
          </select>
        </div>
      )}
      
      {/* URL Input */}
      {showUrlInput && !previewMode && (
        <div className="absolute -top-16 left-0 z-20 bg-white shadow-lg border rounded p-2 min-w-64">
          <input
            type="url"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="Enter image URL"
            className="w-full px-2 py-1 text-xs border rounded mb-2"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="flex space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleUrlUpdate();
              }}
              className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Update
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowUrlInput(false);
                setNewUrl(element.content.src);
              }}
              className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      <div className="image-wrapper" style={elementStyles}>
        {element.content.src ? (
          <img
            src={element.content.src}
            alt={element.content.alt}
            className={cn(
              "w-full h-auto rounded transition-all duration-200",
              element.properties.objectFit === 'cover' && "object-cover",
              element.properties.objectFit === 'contain' && "object-contain",
              element.properties.objectFit === 'fill' && "object-fill"
            )}
            data-element-id={element.id}
            data-element-type="image"
          />
        ) : (
          <div className="w-full h-32 bg-gray-200 rounded flex flex-col items-center justify-center text-gray-400">
            <Upload className="w-8 h-8 mb-2" />
            <span className="text-sm">No image selected</span>
            <span className="text-xs">Click to add image</span>
          </div>
        )}
        
        {/* Caption */}
        {(element.content.caption || isSelected) && (
          <div
            className={cn(
              "mt-2 text-sm text-gray-600 outline-none",
              isSelected && !previewMode && "bg-gray-50 p-1 rounded"
            )}
            contentEditable={!previewMode && element.editable && !element.locked && isSelected}
            suppressContentEditableWarning
            onInput={(e) => {
              const text = e.currentTarget.textContent || '';
              handleCaptionEdit(text);
            }}
            onBlur={() => {
              handleCaptionComplete();
            }}
            placeholder="Image caption..."
          >
            {editingCaption || 'Add caption...'}
          </div>
        )}
      </div>
      
      {/* Element Type Indicator */}
      {isSelected && !previewMode && (
        <div className="absolute -bottom-6 left-0 text-xs text-gray-500 bg-white px-2 py-1 rounded shadow-sm border">
          Image • {element.editable ? 'Editable' : 'Read-only'}
        </div>
      )}
    </div>
  );
}