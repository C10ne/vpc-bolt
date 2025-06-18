import React from 'react';
import { Element as ElementData } from '@shared/schema';
import { useEditor } from '@/lib/editorContext'; // Added
import { ElementPath } from '@/lib/editorContext'; // Assuming ElementPath is exported from context

interface GenericElementRendererProps {
  element: ElementData;
  isLocked: boolean; // Added
  elementPath: Omit<ElementPath, 'elementId'>; // sectionId, componentId. elementId is element.id
}

const GenericElementRenderer: React.FC<GenericElementRendererProps> = ({ element, isLocked, elementPath }) => {
  const { type, properties } = element;
  const { previewMode, updateElementContent } = useEditor(); // Added

  switch (type) {
    case 'Heading': {
      const { text = 'Default Heading', level = 'h2' } = properties as { text?: string; level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' };
      const Tag = level;
      // Basic contentEditable for Heading as well, if desired (not part of this specific subtask)
      // For now, Heading remains non-editable inline via this component.
      return <Tag data-element-id={element.id}>{text}</Tag>;
    }
    case 'Paragraph': {
      const initialText = properties.text || 'Default paragraph text.';
      return (
        <p
          data-element-id={element.id}
          contentEditable={!previewMode && !isLocked}
          suppressContentEditableWarning={true}
          onBlur={(e) => {
            if (!previewMode && !isLocked) {
              if (e.currentTarget.innerText !== initialText) { // Only update if content changed
                updateElementContent(
                  { ...elementPath, elementId: element.id },
                  e.currentTarget.innerText,
                  'Paragraph'
                );
              }
            }
          }}
          style={isLocked ? { cursor: 'not-allowed', opacity: 0.7 } : previewMode ? {} : { cursor: 'text' }}
        >
          {initialText}
        </p>
      );
    }
    case 'Image': {
      const { src = '', alt = 'Placeholder image' } = properties as { src?: string; alt?: string };
      if (!src) {
        return (
          <div data-element-id={element.id} style={{ width: '100px', height: '100px', border: '1px solid #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f0f0', color: '#888' }}>
            No Image
          </div>
        );
      }
      return <img data-element-id={element.id} src={src} alt={alt} style={{ maxWidth: '100%', height: 'auto', display: 'block' }} />;
    }
    case 'Button': {
      const { text = 'Button Text', style = 'default' } = properties as { text?: string; actionUrl?: string; style?: string };
      let buttonStyles: React.CSSProperties = { padding: '8px 16px', border: '1px solid #ccc', borderRadius: '4px', cursor: isLocked ? 'not-allowed' : 'pointer', opacity: isLocked ? 0.7 : 1 };
      if (style === 'primary') {
        buttonStyles.backgroundColor = '#007bff';
        buttonStyles.color = 'white';
        buttonStyles.borderColor = '#007bff';
      }
      // Buttons are not typically inline editable for their text via contentEditable here.
      // Text changes would go through InspectorPanel.
      return <button data-element-id={element.id} style={buttonStyles} disabled={isLocked}>{text}</button>;
    }
    case 'Group': {
      const {
        elements: childElements = [],
        layout = 'vertical',
        gap = '8px'
      } = properties as { elements?: ElementData[]; layout?: 'horizontal' | 'vertical'; gap?: string | number };

      const groupStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: layout === 'horizontal' ? 'row' : 'column',
        gap: typeof gap === 'number' ? `${gap}px` : gap,
        padding: '4px',
      };

      return (
        <div data-element-id={element.id} style={groupStyle} className="element-group">
          {childElements.map((childElement: ElementData) => (
            <GenericElementRenderer
              key={childElement.id}
              element={childElement}
              // Pass down isLocked from parent component (group itself doesn't have its own lock for children's content)
              // Children's lock status is determined by their parent component's lock.
              isLocked={isLocked}
              elementPath={{
                sectionId: elementPath.sectionId,
                componentId: elementPath.componentId,
                // elementId will be set by the child itself if it becomes editable
                // This elementPath is for the children of the group, they are distinct elements.
                // This is tricky: elementPath here is for the *Group* element.
                // If children become editable, they need their own specific path.
                // For now, children of a group are not made inline editable by this renderer directly.
                // Inline editing is only for top-level Paragraph/RichText in this pass.
                // To make children of Group inline editable, GenericComponentRenderer would need to pass
                // the full path down to its GenericElementRenderer calls.
                // Current subtask is only for Paragraph & RichText elements rendered directly by a component.
              }}
            />
          ))}
          {childElements.length === 0 && (
            <div style={{padding: '10px', color: '#888', fontSize: '0.9em', border: '1px dashed #eee', textAlign: 'center'}}>Empty Group</div>
          )}
        </div>
      );
    }
    case 'RichText': {
      const initialHtmlContent = properties.htmlContent || '<p>Default rich text.</p>';
      const richTextStyle: React.CSSProperties = {
        padding: '10px',
        border: '1px solid #eee',
        borderRadius: '4px',
        minHeight: '50px',
        cursor: isLocked ? 'not-allowed' : 'text',
        opacity: isLocked ? 0.7 : 1,
      };
      return (
        <div
          data-element-id={element.id}
          style={richTextStyle}
          className="element-richtext"
          contentEditable={!previewMode && !isLocked}
          suppressContentEditableWarning={true}
          dangerouslySetInnerHTML={{ __html: initialHtmlContent }}
          onBlur={(e) => {
            if (!previewMode && !isLocked) {
              if (e.currentTarget.innerHTML !== initialHtmlContent) { // Only update if content changed
                updateElementContent(
                  { ...elementPath, elementId: element.id },
                  e.currentTarget.innerHTML,
                  'RichText'
                );
              }
            }
          }}
        />
      );
    }
    default:
      console.warn(`Unsupported element type: ${type}`, element);
      return (
        <div data-element-id={element.id} style={{ border: '1px dashed red', padding: '10px', color: '#888' }}>
          Unsupported element: {type}
        </div>
      );
  }
};

export default GenericElementRenderer;
