import { ComponentType, Element as ElementData, ElementType } from '@shared/schema';
import { v4 as uuidv4 } from 'uuid'; // Import uuid

// Changed newId to return string UUID
const newId = (): string => uuidv4();

export interface ComponentDefinition {
  type: ComponentType;
  name: string;
  description?: string;
  defaultParameters?: Record<string, any>;
  defaultElements: ElementData[]; // Elements will now have string IDs
}

export const componentDefinitions: ComponentDefinition[] = [
  {
    type: 'HeroImage',
    name: 'Hero Image Display',
    description: 'A component that typically shows a large background image with text and a call to action.',
    defaultParameters: {
      verticalAlignment: 'center',
      horizontalAlignment: 'left',
      textColor: '#ffffff',
    },
    defaultElements: [
      {
        id: newId(), // String UUID
        type: 'Heading',
        properties: { text: 'Dynamic Hero Title!', level: 'h1' },
      },
      {
        id: newId(), // String UUID
        type: 'Paragraph',
        properties: { text: 'Describe your amazing product or service here. Make it compelling!' },
      },
      {
        id: newId(), // String UUID
        type: 'Button',
        properties: { text: 'Get Started', actionUrl: '#', style: 'primary' },
      },
    ],
  },
  {
    type: 'ProductCard',
    name: 'Product Card',
    description: 'Displays information about a single product, usually in a grid.',
    defaultParameters: {
      imageAspectRatio: '1:1',
      cardStyle: 'shadow',
    },
    defaultElements: [
      { id: newId(), type: 'Image', properties: { src: 'https://via.placeholder.com/300x300.png?text=Product', alt: 'Product Image' } },
      { id: newId(), type: 'Heading', properties: { text: 'New Product', level: 'h3' } },
      { id: newId(), type: 'Paragraph', properties: { text: 'Brief product details and key selling points.' } },
      { id: newId(), type: 'Price', properties: { amount: '0.00', currencySymbol: '$' } },
      { id: newId(), type: 'Button', properties: { text: 'More Info', actionUrl: '#', style: 'default' } },
    ],
  },
  {
    type: 'RichTextComponent', // This ComponentType was added to schema
    name: 'Rich Text Block',
    description: 'A block for flexible HTML content, ideal for articles or detailed descriptions.',
    defaultParameters: {
      maxWidth: '700px',
    },
    defaultElements: [
      {
        id: newId(), // String UUID
        type: 'RichText', // ElementType
        properties: { htmlContent: '<p>Start writing your <em>rich</em> and <strong>engaging</strong> content here...</p><h2>Subheading Example</h2><p>More details follow.</p>' },
      },
    ],
  },
  {
    type: 'ButtonComponent', // This ComponentType was added to schema
    name: 'Single Button',
    description: 'A component that renders a single, standalone button, often used for primary calls to action within a custom layout.',
    defaultParameters: {
      alignment: 'center',
    },
    defaultElements: [
      {
        id: newId(), // String UUID
        type: 'Button', // ElementType
        properties: { text: 'Click Me', style: 'default', actionUrl: '#' },
      },
    ],
  }
];
