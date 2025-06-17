import React from 'react';
import { Component as ComponentData } from '@shared/schema'; // Renamed to avoid conflict
import GenericElementRenderer from './GenericElementRenderer';

interface GenericComponentRendererProps {
  component: ComponentData;
}

const GenericComponentRenderer: React.FC<GenericComponentRendererProps> = ({ component }) => {
  const { type, elements, id } = component;

  // Basic styling for the component wrapper
  const componentStyle: React.CSSProperties = {
    border: '1px solid #007bff', // Blue border for components
    padding: '10px',
    margin: '10px 0',
    borderRadius: '4px',
  };

  const headerStyle: React.CSSProperties = {
    fontSize: '0.8em',
    color: '#6c757d', // Muted color for component type
    marginBottom: '5px',
  };

  return (
    <div style={componentStyle} data-component-id={id} data-component-type={type}>
      <div style={headerStyle}>Component: {type}</div>
      {elements.map((element) => (
        <GenericElementRenderer key={element.id} element={element} />
      ))}
    </div>
  );
};

export default GenericComponentRenderer;
