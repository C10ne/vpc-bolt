import React, { useRef } from 'react';
import { Component as ComponentData, Element as ElementData } from '@shared/schema';
import GenericElementRenderer from './GenericElementRenderer';
import { useEditor } from '@/lib/editorContext';

interface GenericComponentRendererProps {
  component: ComponentData; // component.id is now string
  parentSectionId: string; // This is already a string
}

const GenericComponentRenderer: React.FC<GenericComponentRendererProps> = ({ component, parentSectionId }) => {
  const componentRef = useRef<HTMLDivElement>(null);
  const { state, selectComponent } = useEditor();
  const { previewMode } = state;
  const { type, elements, id, editable, parameters } = component; // id is now string

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

  // parentSectionIdAsNumber is no longer needed as ElementPath expects string IDs
  // const parentSectionIdAsNumber = parseInt(parentSectionId, 10);

  return (
    <div
      ref={componentRef}
      style={componentStyle}
      data-component-id={id} // id is string
      data-component-type={type}
      className={wrapperClassName}
      onClick={(e) => {
        if (!previewMode && editable !== 'locked-edit') {
          e.stopPropagation();
          // id is now string, selectComponent expects (string, string | null, node)
          selectComponent(parentSectionId, id, componentRef.current);
        }
      }}
    >
      <div style={headerStyle}>Component: {type} (ID: {id})</div>
      {parameters && Object.keys(parameters).length > 0 && !previewMode && (
        <pre style={{fontSize: '0.65em', lineHeight: '1.2', color: '#555', backgroundColor: '#f0f0f0', padding: '2px 4px', margin: '0 0 4px 0', borderRadius: '3px', whiteSpace: 'pre-wrap', wordBreak: 'break-all'}}>
          Params: {JSON.stringify(parameters)}
        </pre>
      )}

      {(elements || []).map((element: ElementData) => (
        <GenericElementRenderer
          key={element.id} // element.id is now string
          element={element}
          isLocked={editable === 'locked-edit'}
          elementPath={{
            sectionId: parentSectionId, // Pass as string
            componentId: id, // component.id is now string
          }}
        />
      ))}
      {elements === undefined && !previewMode && (
        <div style={{padding: '10px', fontSize: '0.8em', color: 'orange', border: '1px dashed orange', marginTop: '5px', textAlign: 'center'}}>
            Warning: Component (type: {type}, ID: {id}) has undefined 'elements' property. Rendered as empty.
        </div>
      )}
      {elements && elements.length === 0 && !previewMode && (
         <p className="text-xs text-gray-500 italic p-2 text-center">This component has no elements defined.</p>
      )}
    </div>
  );
};

export default GenericComponentRenderer;
