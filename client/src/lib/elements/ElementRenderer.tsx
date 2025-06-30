import React from 'react';
import { Element } from './types';
import HeadingElementComponent from './HeadingElement';
import ParagraphElementComponent from './ParagraphElement';
import ImageElementComponent from './ImageElement';
import ButtonElementComponent from './ButtonElement';
import FormFieldElementComponent from './FormFieldElement';

interface ElementRendererProps {
  element: Element;
  isSelected?: boolean;
  isEditing?: boolean;
  onUpdate?: (updates: Partial<Element>) => void;
  onSelect?: () => void;
  previewMode?: boolean;
}

export default function ElementRenderer({
  element,
  isSelected = false,
  isEditing = false,
  onUpdate,
  onSelect,
  previewMode = false
}: ElementRendererProps) {
  
  const commonProps = {
    isSelected,
    isEditing,
    onUpdate,
    onSelect,
    previewMode
  };

  switch (element.type) {
    case 'heading':
      return (
        <HeadingElementComponent
          element={element}
          {...commonProps}
        />
      );

    case 'paragraph':
      return (
        <ParagraphElementComponent
          element={element}
          {...commonProps}
        />
      );

    case 'image':
      return (
        <ImageElementComponent
          element={element}
          {...commonProps}
        />
      );

    case 'button':
      return (
        <ButtonElementComponent
          element={element}
          {...commonProps}
        />
      );

    case 'form-field':
      return (
        <FormFieldElementComponent
          element={element}
          {...commonProps}
        />
      );

    case 'text-group':
      // Text group renders its child elements
      return (
        <div className="text-group space-y-2">
          {element.content.elements?.map((childElement: Element) => (
            <ElementRenderer
              key={childElement.id}
              element={childElement}
              {...commonProps}
              onUpdate={(updates) => {
                // Update the child element within the text group
                if (onUpdate) {
                  const updatedElements = element.content.elements.map((el: Element) =>
                    el.id === childElement.id ? { ...el, ...updates } : el
                  );
                  onUpdate({
                    content: {
                      ...element.content,
                      elements: updatedElements
                    }
                  });
                }
              }}
            />
          ))}
        </div>
      );

    default:
      console.warn(`Unknown element type: ${element.type}`);
      return (
        <div className="p-4 border border-red-300 bg-red-50 text-red-700 rounded">
          <p className="font-medium">Unknown Element</p>
          <p className="text-sm">Type: {element.type}</p>
        </div>
      );
  }
}