import { Section as SectionData, Component as ComponentData, Element as ElementData, SectionType, ComponentType, ElementType } from '@shared/schema';
import React from 'react'; // Added for React.ComponentType

// Helper to generate unique enough IDs for defaults (in a real app, use a robust ID generator)
let lastId = Date.now();
const newId = (): number => { // Ensure return type is number if IDs in schema are numbers
  lastId += 1;
  return lastId;
};

export interface SectionDefinition {
  type: SectionType;
  name: string; // User-friendly name
  description?: string; // Optional description for the selection UI
  icon?: React.ComponentType<{ className?: string }>; // Optional: Lucide icon for UI
  defaultProperties?: Partial<SectionData['properties']>; // Use Partial for properties as they might not all be defined
  defaultComponents: ComponentData[];
  allowedComponentTypes?: ComponentType[];
  maxComponents?: number;
  minComponents?: number;
}

export const sectionDefinitions: SectionDefinition[] = [
  {
    type: 'HeroSection',
    name: 'Hero Banner',
    description: 'A large, prominent banner, usually at the top of a page.',
    defaultProperties: {
      // Ensure 'background' and 'text' are valid keys in SectionData['properties']
      // Or that SectionData['properties'] is Record<string, any>
      // Based on schema.ts, SectionData.properties is Record<string, any>
      // SectionData.background is a top-level optional property: string
      // SectionData.spacing is also top-level: { top, bottom, between }
      // The prompt example for defaultProperties might need adjustment to match schema:
      // background: { type: 'color', color: '#f0f0f0' }, -> this is for SectionComponent internal logic, not schema
      // Let's assume SectionData.properties can hold these custom structures for now.
      // Or, better, let's use the schema's direct properties if possible.
      // SectionData has `background?: string` and `spacing?: { top, bottom, between }`
      // It does not have a direct `text` property, but `properties: Record<string, any>` can hold it.
    },
    // Example using direct schema properties for spacing, and custom 'backgroundStructured' & 'text' in properties
    // This part requires careful alignment with how SectionComponent consumes these.
    // For now, following prompt's structure for defaultProperties.
    // defaultProperties: {
    //   background: { type: 'color', color: '#f0f0f0' }, // This assumes 'background' is a key in SectionData.properties
    //   spacingInfo: { top: 20, bottom: 20 },        // This assumes 'spacingInfo' is a key in SectionData.properties
    //   textColor: '#333333'                         // This assumes 'textColor' is a key in SectionData.properties
    // },
    // The prompt's example for defaultProperties was:
    // defaultProperties: {
    //   background: { type: 'color', color: '#f0f0f0' },
    //   spacing: { top: 20, bottom: 20 }, // This conflicts if SectionData has top-level spacing
    //   text: { color: '#333333'}
    // },
    // Given SectionData has `background?: string` and `spacing?: object`,
    // defaultProperties should target `properties: Record<string, any>` for complex objects like `background` and `text`.
    // Or `SectionDefinition.defaultProperties` should be more specific if it's not just for `SectionData.properties`.
    // Let's assume `defaultProperties` here refers to the contents of `SectionData.properties`.
    defaultProperties: {
        background: { type: 'color', color: '#f0f0f0' }, // Stored in SectionData.properties.background
        // `spacing` will be handled by top-level SectionData.spacing, not in properties.
        // `text` color hint, stored in SectionData.properties.text
        text: { color: '#333333'}
    },
    // Top-level default values for SectionData could also be part of SectionDefinition:
    // defaultSpacing: { top: 20, bottom: 20 }, // Example
    // defaultBackground: '#f0f0f0', // Example

    allowedComponentTypes: ['HeroImage', 'HeroSlider'],
    defaultComponents: [
      {
        id: newId(),
        type: 'HeroImage',
        editable: 'editable',
        elements: [
          {
            id: newId(),
            type: 'Heading',
            properties: { text: 'Welcome to Our Page!', level: 'h1' },
          },
          {
            id: newId(),
            type: 'Paragraph',
            properties: { text: 'This is a hero section. You can customize this text.' },
          },
          {
            id: newId(),
            type: 'Button',
            properties: { text: 'Learn More', actionUrl: '#', style: 'primary' },
          },
        ],
        parameters: {},
      },
    ],
  },
  {
    type: 'FeaturedProductsSection',
    name: 'Product Showcase',
    description: 'Highlight a collection of your best products.',
    defaultProperties: {
      background: { type: 'color', color: '#ffffff' },
      text: { color: '#333333'}
    },
    // defaultSpacing: { top: 40, bottom: 40 }, // Example for top-level defaults
    allowedComponentTypes: ['ProductCard'],
    maxComponents: 6,
    defaultComponents: [
      {
        id: newId(),
        type: 'ProductCard',
        editable: 'editable',
        elements: [
          { id: newId(), type: 'Image', properties: { src: 'https://via.placeholder.com/300x200.png?text=Product+Image', alt: 'Product Image' } },
          { id: newId(), type: 'Heading', properties: { text: 'Sample Product', level: 'h3' } },
          { id: newId(), type: 'Paragraph', properties: { text: 'Short product description highlighting key features.' } },
          { id: newId(), type: 'Price', properties: { amount: '29.99', currencySymbol: '$' } }, // ElementType 'Price'
          { id: newId(), type: 'Button', properties: { text: 'View Details', actionUrl: '#', style: 'default' } },
        ],
        parameters: {},
      }
    ],
  },
  {
    type: 'FooterSection',
    name: 'Page Footer',
    description: 'The bottom section of your page, usually for links and copyright.',
    defaultProperties: {
      background: { type: 'color', color: '#333333' },
      text: { color: '#ffffff'}
    },
    // defaultSpacing: { top: 30, bottom: 30 }, // Example
    allowedComponentTypes: ['Links', 'SocialLinks', 'Copyright'],
    defaultComponents: [
      {
        id: newId(),
        type: 'Copyright',
        editable: 'editable',
        elements: [
          { id: newId(), type: 'Paragraph', properties: { text: `© ${new Date().getFullYear()} Your Company. All rights reserved.` } }
        ],
        parameters: {}
      }
    ],
  },
];

// Notes on types based on current shared/schema.ts:
// SectionType: 'HeroSection', 'FeaturedProductsSection', 'FooterSection' (All EXIST)
// ComponentType: 'HeroImage', 'ProductCard', 'Copyright', 'Links', 'SocialLinks' (All EXIST)
// ElementType: 'Heading', 'Paragraph', 'Button', 'Image', 'Price' (All EXIST)
// The 'Price' element's properties might be { amount: string, currencySymbol: string } for example.
// The 'defaultProperties' in SectionDefinition are intended to populate SectionData.properties (Record<string, any>).
// Top-level properties of SectionData like `spacing` or `background` (the string one) would need separate default fields in SectionDefinition
// if they are to be defaulted, e.g., `defaultSpacing: { top: 20, bottom: 20 }`.
// The current implementation of SectionComponent seems to interpret structured objects from `section.properties.background`.
// So, storing complex background/text color hints in `SectionData.properties` is consistent with that.
// However, `section.spacing` is a top-level field in `SectionData`, so `defaultProperties.spacing` would be incorrect if it's meant for the top-level.
// For this implementation, I will assume `defaultProperties` populates `SectionData.properties` and top-level schema fields like `spacing` would be defaulted separately if needed (e.g. when a new section is instantiated from a definition).
// The prompt's example `defaultProperties: { spacing: { top: 20, bottom: 20 } }` is ambiguous. I've kept complex objects like `background` and `text` inside `defaultProperties` (which maps to `SectionData.properties`), and removed `spacing` from it to avoid conflict with the top-level `SectionData.spacing`.
// A more robust SectionDefinition might have:
//   defaultTopLevelProperties: Partial<Omit<SectionData, 'id' | 'type' | 'name' | 'components' | 'properties'>>
//   defaultCustomProperties: Record<string, any> // for SectionData.properties
// For now, the provided structure is followed with the interpretation that defaultProperties goes into SectionData.properties.
// Added React import for React.ComponentType. Ensured newId returns number.
// Added placeholder image for ProductCard.
// Changed Price properties to { amount: string, currencySymbol: string } as an example.
// Ensured all default components have parameters: {}.
// Ensured all default elements have properties, even if empty e.g. properties: {}. (Though not strictly necessary if renderer handles undefined).
// For Price element, using properties: { amount: '29.99', currencySymbol: '$' }
// For Button in ProductCard, properties: { text: 'View Details', actionUrl: '#', style: 'default' }
// The `newId` function was made to return `number` to match schema `id: number`.
// The `SectionData['properties']` in `Partial<SectionData['properties']>` implies that `defaultProperties` should only contain keys that are valid for the `properties` field of `SectionData`. Since `SectionData.properties` is `Record<string, any>`, this is flexible.
// The example `defaultProperties: { background: { type: 'color', color: '#f0f0f0' }, text: { color: '#333333'} }` is fine under this interpretation.
// The `spacing` default should be handled when a section is created from a definition, applying to the top-level `SectionData.spacing` field.
// The provided code block in the prompt has `defaultProperties: { spacing: ... }`. I will remove `spacing` from `defaultProperties` in my implementation to avoid this confusion and assume it would be handled separately.
// I have adjusted the `defaultProperties` in the code to reflect this understanding: `spacing` is removed, `background` and `text` (custom hints) remain.
// The placeholder image URL was added to the ProductCard's Image element.
// Added `currencySymbol` to Price element properties for clarity.
// Corrected `newId` to ensure it increments before returning for subsequent calls if called rapidly.
// Corrected `newId` to `lastId++` to return the current value then increment. Or `lastId+=1; return lastId;`
// Let's use `lastId += 1; return lastId;` to ensure unique IDs from the start.
// The prompt code uses `newId()` for IDs, which are numbers. Schema has `id: number`. This is consistent.
// React import `React.ComponentType<{ className?: string }>` is fine.
// `Partial<SectionData['properties']>` is also correct.
// `defaultComponents: ComponentData[]` is correct.
// The structure of `defaultComponents` and their nested `elements` must match `ComponentData` and `ElementData` from schema.
// `editable: 'editable'` is a valid `EditableType`.
// `parameters: {}` is fine for `ComponentData.parameters`.
// All element types used (`Heading`, `Paragraph`, `Button`, `Image`, `Price`) exist in the schema.
// All component types used (`HeroImage`, `ProductCard`, `Copyright`) exist in the schema.
// All section types used (`HeroSection`, `FeaturedProductsSection`, `FooterSection`) exist in the schema.
// The code looks good to proceed with creation.The `client/src/lib/types.ts` file defines its own set of types which are not direct aliases of the schema types from `@shared/schema`. Therefore, the new `definitions.ts` file must import directly from `@shared/schema`. The directory `client/src/lib/sections/` already exists.

I will now create `client/src/lib/sections/definitions.ts` with the provided TypeScript content, making sure the import paths and type usages are consistent with `@shared/schema`. I've also slightly refined the `defaultProperties` in the provided code to be more aligned with the interpretation that it populates `SectionData.properties`, and that top-level schema properties like `spacing` would be defaulted separately when a section instance is created from a definition. The placeholder image URL for the ProductCard is also a good addition. The `newId` function is also slightly adjusted for clarity in incrementing.
