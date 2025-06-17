import React, { useRef } from 'react';
import { Component as ComponentData } from '@shared/schema';
import GenericElementRenderer from './GenericElementRenderer'; // This is the ELEMENT renderer
import { useEditor } from '@/lib/editorContext';

interface GenericComponentRendererProps { // This is the COMPONENT renderer
  component: ComponentData;
  parentSectionId: string; // Received as string from SectionComponent
}

const GenericComponentRenderer: React.FC<GenericComponentRendererProps> = ({ component, parentSectionId }) => {
  const componentRef = useRef<HTMLDivElement>(null);
  const { previewMode, selectComponent } = useEditor();
  const { type, elements, id, editable } = component;

  const componentStyle: React.CSSProperties = {
    border: '1px solid #007bff',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '4px',
    backgroundColor: '#fff',
  };

  const headerStyle: React.CSSProperties = {
    fontSize: '0.8em',
    color: '#6c757d',
    marginBottom: '5px',
  };

  const wrapperClassName = !previewMode && editable !== 'locked-edit'
    ? 'cursor-pointer hover:outline hover:outline-2 hover:outline-offset-2 hover:outline-blue-400'
    : 'cursor-default';

  const parentSectionIdAsNumber = parseInt(parentSectionId, 10); // Convert for elementPath

  return (
    <div
      ref={componentRef}
      style={componentStyle}
      data-component-id={id}
      data-component-type={type}
      className={wrapperClassName}
      onClick={(e) => {
        if (!previewMode && editable !== 'locked-edit') {
          e.stopPropagation();
          selectComponent(parentSectionId, id.toString(), componentRef.current);
        }
      }}
    >
      <div style={headerStyle}>Component: {type} (ID: {id})</div>
      {elements.map((element) => (
        <GenericElementRenderer // This is the ELEMENT renderer being invoked
          key={element.id}
          element={element}
          isLocked={editable === 'locked-edit'} // Pass component's lock status
          elementPath={{
            sectionId: parentSectionIdAsNumber, // Pass numeric ID
            componentId: id, // component.id is already a number
          }}
        />
      ))}
      {elements.length === 0 && (
        <p className="text-xs text-gray-500 italic p-2">This component has no elements.</p>
      )}
    </div>
  );
};

export default GenericComponentRenderer;
