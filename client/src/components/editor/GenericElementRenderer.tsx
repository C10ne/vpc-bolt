import React from 'react';
import { Element as ElementData, ElementType } from '@shared/schema'; // Renamed to avoid conflict with JSX Element

interface GenericElementRendererProps {
  element: ElementData;
}

const GenericElementRenderer: React.FC<GenericElementRendererProps> = ({ element }) => {
  const { type, properties } = element;

  switch (type) {
    case 'Heading': {
      const { text = 'Default Heading', level = 'h2' } = properties as { text?: string; level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' };
      const Tag = level; // h1, h2, etc.
      return <Tag>{text}</Tag>;
    }
    case 'Paragraph': {
      // Assuming 'text' property based on previous examples, though schema comments mentioned 'htmlContent'
      // For consistency with 'Heading' and 'Button', using 'text'. Adjust if 'htmlContent' is strictly for Paragraph.
      const { text = 'Default paragraph text.' } = properties as { text?: string };
      return <p>{text}</p>;
    }
    case 'Image': {
      const { src = '', alt = 'Placeholder image' } = properties as { src?: string; alt?: string };
      if (!src) {
        return (
          <div style={{ width: '100px', height: '100px', border: '1px solid #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f0f0', color: '#888' }}>
            No Image
          </div>
        );
      }
      return <img src={src} alt={alt} style={{ maxWidth: '100%', height: 'auto', display: 'block' }} />;
    }
    case 'Button': {
      const { text = 'Button Text', style = 'default' } = properties as { text?: string; actionUrl?: string; style?: string };
      // actionUrl and style can be used for more complex button later
      // Basic button styling for now
      let buttonStyles: React.CSSProperties = {
        padding: '8px 16px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        cursor: 'pointer',
      };
      if (style === 'primary') {
        buttonStyles.backgroundColor = '#007bff';
        buttonStyles.color = 'white';
        buttonStyles.borderColor = '#007bff';
      }
      return <button style={buttonStyles}>{text}</button>;
    }
    case 'Group': {
      const {
        elements: childElements = [],
        layout = 'vertical',
        gap = '8px' // Default gap
      } = properties as { elements?: ElementData[]; layout?: 'horizontal' | 'vertical'; gap?: string | number };

      const groupStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: layout === 'horizontal' ? 'row' : 'column',
        gap: typeof gap === 'number' ? `${gap}px` : gap,
        padding: '4px', // Small padding to see group boundary
        // border: '1px dashed green', // Optional: for debugging group boundaries
      };

      return (
        <div style={groupStyle} className="element-group"> {/* Added a class for potential styling */}
          {childElements.map((childElement: ElementData) => ( // Explicitly type childElement
            <GenericElementRenderer key={childElement.id} element={childElement} />
          ))}
          {childElements.length === 0 && (
            <div style={{padding: '10px', color: '#888', fontSize: '0.9em', border: '1px dashed #eee', textAlign: 'center'}}>Empty Group</div>
          )}
        </div>
      );
    }
    case 'RichText': {
      const { htmlContent = '<p>Default rich text content.</p>' } = properties as { htmlContent?: string };
      // Basic styling for a rich text block
      const richTextStyle: React.CSSProperties = {
        padding: '10px',
        border: '1px solid #eee', // Light border to distinguish
        borderRadius: '4px',
        minHeight: '50px', // Ensure it's visible even if empty initially
      };
      return (
        <div
          style={richTextStyle}
          className="element-richtext"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      );
    }
    // Cases for other element types will be added later
    default:
      console.warn(`Unsupported element type: ${type}`, element);
      return (
        <div style={{ border: '1px dashed red', padding: '10px', color: '#888' }}>
          Unsupported element: {type}
          {/* Removing stringify for potentially large/circular objects in console
           - Properties: {JSON.stringify(properties)} */}
        </div>
      );
  }
};

export default GenericElementRenderer;
