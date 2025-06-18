import { v4 as uuidv4 } from 'uuid';
import {
  Template as TemplateData,
  SectionType,
  ComponentType,
  ElementType,
  EditableType,
  Element as ElementData
} from '@shared/schema'; // Adjusted path as per business template
import { elementRegistry } from '../../elements'; // Adjusted path as per business template

export const template: TemplateData = {
  id: uuidv4(),
  name: 'Showcase Template',
  title: 'Features Showcase',
  description: 'A template to demonstrate components and features outlined in requirements.md.',
  category: 'Showcase',
  thumbnail: 'https://via.placeholder.com/400x225?text=Showcase', // Placeholder image
  logoUrl: 'https://via.placeholder.com/150x50?text=ShowcaseLogo', // Placeholder logo
  colors: {
    primary: '#007bff', // Example primary color
    secondary: '#6c757d', // Example secondary color
    accent: '#17a2b8', // Example accent color
  },
  sections: [
    // Top Bar Section
    {
      id: uuidv4(),
      type: 'TopBarSection' as SectionType, // Assuming a generic or custom section type
      name: 'Page Top Bar',
      editable: 'editable' as EditableType,
      properties: {
        background: { type: 'color', color: '#f8f9fa' }, // Light grey background
        padding: { vertical: 8, horizontal: 16 }
      },
      spacing: { top: 0, bottom: 0, between: 10 },
      allowedComponentTypes: ['TopBarControls' as ComponentType], // Placeholder component type
      components: [
        {
          id: uuidv4(),
          type: 'TopBarControls' as ComponentType, // Placeholder
          editable: 'editable' as EditableType,
          elements: [
            // Placeholder elements for styling, responsive selectors, preview buttons
            elementRegistry.createElement('Paragraph', { properties: { text: '[Template Styling Controls Placeholder]' } }),
            elementRegistry.createElement('Paragraph', { properties: { text: '[Responsive Preview Selectors Placeholder]' } }),
            elementRegistry.createElement('Paragraph', { properties: { text: '[Preview Options/Buttons Placeholder]' } })
          ].filter(Boolean) as ElementData[],
          parameters: { layout: 'space-between', alignment: 'center' } // Example parameters
        }
      ]
    },
    // Editor Area Section
    {
      id: uuidv4(),
      type: 'MainContentSection' as SectionType, // Assuming a generic or custom section type
      name: 'Editor Showcase Area',
      editable: 'editable' as EditableType,
      properties: {
        background: { type: 'color', color: '#ffffff' }, // White background
        padding: { vertical: 20, horizontal: 20 }
      },
      spacing: { top: 10, bottom: 10, between: 15 },
      allowedComponentTypes: [
        'ShowcaseHeading' as ComponentType,
        'ShowcaseParagraph' as ComponentType,
        'ShowcaseImage' as ComponentType,
        'ShowcaseGroup' as ComponentType
      ], // Placeholder component types
      components: [
        // Placeholders for showcase elements - will be detailed in next steps
        {
          id: uuidv4(),
          type: 'ShowcaseHeading' as ComponentType,
          editable: 'editable' as EditableType,
          elements: [elementRegistry.createElement('Heading', { properties: { text: 'Showcase Heading Element', level: 'h1' } })].filter(Boolean) as ElementData[],
          parameters: {}
        },
        {
          id: uuidv4(),
          type: 'ShowcaseParagraph' as ComponentType,
          editable: 'editable' as EditableType,
          elements: [elementRegistry.createElement('Paragraph', { properties: { text: 'This is a showcase paragraph with  clichés. It will support WYSIWYG.' } })].filter(Boolean) as ElementData[],
          parameters: {}
        },
        {
          id: uuidv4(),
          type: 'ShowcaseImage' as ComponentType,
          editable: 'editable' as EditableType,
          elements: [elementRegistry.createElement('Image', { properties: { src: 'https://via.placeholder.com/600x300?text=Showcase+Image', alt: 'Showcase Image' } })].filter(Boolean) as ElementData[],
          parameters: {}
        },
        {
          id: uuidv4(),
          type: 'ShowcaseGroup' as ComponentType,
          editable: 'editable' as EditableType,
          elements: [
            elementRegistry.createElement('Group', {
              properties: {
                layout: 'horizontal',
                gap: '10px',
                alignment: 'center',
                elements: [
                  elementRegistry.createElement('Image', { properties: { src: 'https://via.placeholder.com/32x32?text=Icon', alt: 'Icon', width: '32px', height: '32px' } }),
                  elementRegistry.createElement('Paragraph', { properties: { text: 'Form element with icon placeholder' } })
                ].filter(Boolean) as ElementData[]
              }
            })
          ].filter(Boolean) as ElementData[],
          parameters: {}
        }
      ]
    },
    // Right Sidebar Section
    {
      id: uuidv4(),
      type: 'SidebarSection' as SectionType, // Assuming a generic or custom section type
      name: 'Element Inspector Sidebar',
      editable: 'locked' as EditableType, // Sidebar structure might be fixed
      properties: {
        background: { type: 'color', color: '#e9ecef' }, // Another light grey
        padding: { vertical: 15, horizontal: 15 }
      },
      spacing: { top: 0, bottom: 0, between: 10 },
      allowedComponentTypes: ['InspectorPlaceholder' as ComponentType], // Placeholder
      components: [
        {
          id: uuidv4(),
          type: 'InspectorPlaceholder' as ComponentType,
          editable: 'locked' as EditableType,
          elements: [
            elementRegistry.createElement('Paragraph', { properties: { text: 'Right Sidebar: Selected element details and editable options will appear here.' } })
          ].filter(Boolean) as ElementData[],
          parameters: {}
        }
      ]
    }
  ]
};
