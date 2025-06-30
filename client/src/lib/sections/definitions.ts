import {
  Section as SectionData,
  Component as ComponentData,
  Element as ElementData,
  SectionType,
  ComponentType,
  ElementType,
  EditableType // Ensure EditableType is imported
} from '@shared/schema';
import React from 'react';
import { v4 as uuidv4 } from 'uuid'; // Import uuid

// Changed newId to return string UUID
const newId = (): string => uuidv4();

// Using the refined SectionDefinition from subtask 4.3.1
export interface SectionDefinition {
  type: SectionType;
  name: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  defaultConfig?: {
    properties?: Record<string, any>;
    background?: string;
    spacing?: { top?: number; bottom?: number; between?: number };
    editable?: EditableType;
    allowedComponentTypes?: ComponentType[];
    maxComponents?: number;
    minComponents?: number;
  };
  defaultComponents: ComponentData[];
}

export const sectionDefinitions: SectionDefinition[] = [
  {
    type: 'HeroSection',
    name: 'Hero Banner',
    description: 'A large, prominent banner, usually at the top of a page.',
    defaultConfig: { // Using defaultConfig
      properties: {
        background: { type: 'color', color: '#f0f0f0' },
        text: { color: '#333333'}
      },
      spacing: { top: 20, bottom: 20, between: 10 }, // Top-level spacing
      allowedComponentTypes: ['HeroImage', 'HeroSlider'],
      editable: 'editable',
    },
    defaultComponents: [
      {
        id: newId(), // Will now be a string UUID
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
        swappableWith: ['HeroSlider' as ComponentType] // Example
      },
    ],
  },
  {
    type: 'FeaturedProductsSection',
    name: 'Product Showcase',
    description: 'Highlight a collection of your best products.',
    defaultConfig: {
      properties: {
        background: { type: 'color', color: '#ffffff' },
        text: { color: '#333333'}
      },
      spacing: { top: 40, bottom: 40, between: 16 },
      allowedComponentTypes: ['ProductCard'],
      maxComponents: 6,
      editable: 'editable',
    },
    defaultComponents: [
      {
        id: newId(),
        type: 'ProductCard',
        editable: 'editable',
        elements: [
          { id: newId(), type: 'Image', properties: { src: 'https://via.placeholder.com/300x200.png?text=Product+Image', alt: 'Product Image' } },
          { id: newId(), type: 'Heading', properties: { text: 'Sample Product', level: 'h3' } },
          { id: newId(), type: 'Paragraph', properties: { text: 'Short product description highlighting key features.' } },
          { id: newId(), type: 'Price', properties: { amount: '29.99', currencySymbol: '$' } },
          { id: newId(), type: 'Button', properties: { text: 'View Details', actionUrl: '#', style: 'default' } },
        ],
        parameters: {},
        swappableWith: []
      }
    ],
  },
  {
    type: 'FooterSection',
    name: 'Page Footer',
    description: 'The bottom section of your page, usually for links and copyright.',
    defaultConfig: {
      properties: {
        background: { type: 'color', color: '#333333' },
        text: { color: '#ffffff'}
      },
      spacing: { top: 30, bottom: 30, between: 10 },
      allowedComponentTypes: ['Links', 'SocialLinks', 'Copyright'],
      editable: 'editable',
    },
    defaultComponents: [
      {
        id: newId(),
        type: 'Copyright',
        editable: 'editable',
        elements: [
          { id: newId(), type: 'Paragraph', properties: { text: `© ${new Date().getFullYear()} Your Company. All rights reserved.` } }
        ],
        parameters: {},
        swappableWith: []
      }
    ],
  },
];
