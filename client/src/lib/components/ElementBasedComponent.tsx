import React from 'react';
import { cn } from '@/lib/utils';
import { Component, componentUsesElements, getElementsFromComponent } from '@/lib/types';
import { ElementRenderer } from '@/lib/elements';
import type { Element } from '@/lib/elements/types';

interface ElementBasedComponentProps {
  component: Component;
  isSelected?: boolean;
  selectedElementId?: string | null;
  onComponentSelect?: () => void;
  onElementSelect?: (elementId: string) => void;
  onElementUpdate?: (elementId: string, updates: Partial<Element>) => void;
  onComponentUpdate?: (updates: Partial<Component>) => void;
  previewMode?: boolean;
}

export default function ElementBasedComponent({
  component,
  isSelected = false,
  selectedElementId = null,
  onComponentSelect,
  onElementSelect,
  onElementUpdate,
  onComponentUpdate,
  previewMode = false
}: ElementBasedComponentProps) {
  
  // Check if this component uses the Element system
  if (!componentUsesElements(component)) {
    return (
      <div className="p-4 border border-yellow-300 bg-yellow-50 text-yellow-700 rounded">
        <p className="font-medium">Legacy Component</p>
        <p className="text-sm">This component doesn't use the Element system yet.</p>
        <p className="text-sm">Type: {component.type}</p>
      </div>
    );
  }

  const elements = getElementsFromComponent(component);

  const handleElementUpdate = (elementId: string, updates: Partial<Element>) => {
    if (onElementUpdate) {
      onElementUpdate(elementId, updates);
    } else if (onComponentUpdate) {
      // Fallback: update the component directly
      const updatedElements = elements.map(el => 
        el.id === elementId ? { ...el, ...updates } : el
      );
      onComponentUpdate({
        content: {
          ...component.content,
          elements: updatedElements
        }
      });
    }
  };

  return (
    <div 
      className={cn(
        "component-container relative",
        isSelected && !previewMode && "ring-2 ring-green-500",
        component.editingLocked && "cursor-not-allowed opacity-75"
      )}
      onClick={(e) => {
        if (!previewMode && !component.editingLocked) {
          e.stopPropagation();
          onComponentSelect?.();
        }
      }}
      data-component-id={component.id}
      data-component-type={component.type}
    >
      {/* Component-level indicator */}
      {isSelected && !previewMode && (
        <div className="absolute -top-6 left-0 text-xs text-green-600 bg-white px-2 py-1 rounded shadow-sm border border-green-200">
          Element-based Component • {component.type}
        </div>
      )}
      
      {/* Component wrapper with styling */}
      <div 
        className="element-container space-y-4"
        style={{
          backgroundColor: component.styleOptions?.backgroundColor,
          color: component.styleOptions?.textColor,
          padding: component.styleOptions?.padding,
        }}
      >
        {elements.length === 0 ? (
          <div className="p-8 border-2 border-dashed border-gray-300 text-center text-gray-500">
            <p className="font-medium">No Elements</p>
            <p className="text-sm">This component doesn't have any elements yet.</p>
            {!previewMode && (
              <button className="mt-2 px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600">
                Add Element
              </button>
            )}
          </div>
        ) : (
          elements.map((element) => (
            <ElementRenderer
              key={element.id}
              element={element}
              isSelected={selectedElementId === element.id}
              previewMode={previewMode}
              onSelect={() => onElementSelect?.(element.id)}
              onUpdate={(updates) => handleElementUpdate(element.id, updates)}
            />
          ))
        )}
      </div>
    </div>
  );
}