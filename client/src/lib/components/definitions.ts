import { ComponentType, Element as ElementData, ElementType } from '@shared/schema'; // Assuming direct import path

// Helper to generate unique enough IDs for defaults (can be shared or redefined)
let lastId = Date.now() + 100000; // Offset from section ID generator to reduce immediate collision chance
const newId = (): number => {
  lastId += 1;
  return lastId;
};

export interface ComponentDefinition {
  type: ComponentType;
  name: string; // User-friendly name for UI, if needed
  description?: string; // Optional description
  defaultParameters?: Record<string, any>; // Default component parameters
  defaultElements: ElementData[];
}

export const componentDefinitions: ComponentDefinition[] = [
  {
    type: 'HeroImage', // Existing ComponentType
    name: 'Hero Image Display',
    description: 'A component that typically shows a large background image with text and a call to action.',
    defaultParameters: {
      verticalAlignment: 'center',
      horizontalAlignment: 'left',
      textColor: '#ffffff', // Example parameter
    },
    defaultElements: [
      {
        id: newId(),
        type: 'Heading',
        properties: { text: 'Dynamic Hero Title!', level: 'h1' },
      },
      {
        id: newId(),
        type: 'Paragraph',
        properties: { text: 'Describe your amazing product or service here. Make it compelling!' },
      },
      {
        id: newId(),
        type: 'Button',
        properties: { text: 'Get Started', actionUrl: '#', style: 'primary' },
      },
    ],
  },
  {
    type: 'ProductCard', // Existing ComponentType
    name: 'Product Card',
    description: 'Displays information about a single product, usually in a grid.',
    defaultParameters: {
      imageAspectRatio: '1:1',
      cardStyle: 'shadow', // e.g., 'flat', 'shadow'
    },
    defaultElements: [
      { id: newId(), type: 'Image', properties: { src: 'https://placeholder.pagebee.io/api/random//300x300.png?text=Product', alt: 'Product Image' } },
      { id: newId(), type: 'Heading', properties: { text: 'New Product', level: 'h3' } },
      { id: newId(), type: 'Paragraph', properties: { text: 'Brief product details and key selling points.' } },
      { id: newId(), type: 'Price', properties: { amount: '0.00', currencySymbol: '$' } }, // Adjusted from 'currency' to 'currencySymbol'
      { id: newId(), type: 'Button', properties: { text: 'More Info', actionUrl: '#', style: 'default' } },
    ],
  },
  {
    // Assuming 'RichTextComponent' will be added to ComponentType in shared/schema.ts
    // This component primarily wraps a RichText element.
    type: 'RichTextComponent' as ComponentType, // Renamed as per instruction, cast for now
    name: 'Rich Text Block',
    description: 'A block for flexible HTML content, ideal for articles or detailed descriptions.',
    defaultParameters: {
      maxWidth: '700px', // Example: constrain width for readability
    },
    defaultElements: [
      {
        id: newId(),
        type: 'RichText', // ElementType
        properties: { htmlContent: '<p>Start writing your <em>rich</em> and <strong>engaging</strong> content here...</p><h2>Subheading Example</h2><p>More details follow.</p>' },
      },
    ],
  },
  {
    // Assuming 'ButtonComponent' will be added to ComponentType in shared/schema.ts
    // This component primarily wraps a single Button element.
    type: 'ButtonComponent' as ComponentType, // Renamed as per instruction, cast for now
    name: 'Single Button',
    description: 'A component that renders a single, standalone button, often used for primary calls to action within a custom layout.',
    defaultParameters: {
      alignment: 'center', // e.g., 'left', 'center', 'right'
    },
    defaultElements: [
      {
        id: newId(),
        type: 'Button', // ElementType
        properties: { text: 'Click Me', style: 'default', actionUrl: '#' },
      },
    ],
  }
  // Add more component definitions as needed
];

// Notes:
// - The types 'RichTextComponent' and 'ButtonComponent' are new and would need to be added to the ComponentType union in `shared/schema.ts`.
//   This is handled by casting `as ComponentType` for now.
// - `defaultParameters` are for `ComponentData.parameters`.
// - `defaultElements` provides the initial `ElementData[]` for a component.
// - `newId()` is used for unique IDs for elements.
// - Properties for elements (e.g., `text`, `level`, `src`, `htmlContent`) should match what `GenericElementRenderer` and `InspectorPanel` expect for those ElementTypes.
// - Updated Price element properties to use `currencySymbol` instead of `currency` for consistency with example in section definitions.
// - Added some example parameters and richer default content.
// - Added `actionUrl` to the single ButtonComponent's default element.
// - Offset `lastId` for `newId` to further reduce any potential (though unlikely in this context) ID collision with section ID generator if they were ever to run in a shared global scope without reset.
// - Ensured `Element as ElementData` alias is used for clarity where `ElementData[]` is expected.
// - All ElementTypes used are existing/added in previous steps.
// - All existing ComponentTypes used (HeroImage, ProductCard) are from schema.
