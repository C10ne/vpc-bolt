import { v4 as uuidv4 } from 'uuid';
// Import schema types
import {
  Template as TemplateData,
  Section as SectionData,
  Component as ComponentData,
  Element as ElementData, // This is the target structure for elements
  ComponentType,
  ElementType,
  EditableType,
  SectionType
} from '@shared/schema';
import { elementRegistry } from '../elements'; // elementRegistry now produces Element with string ID and unified properties

// Example template demonstrating the Element system, aligned with shared/schema.ts types
export const elementExamplesTemplate: TemplateData = {
  id: uuidv4(), // Template ID (string for client-side object)
  name: 'Element System Demo Template (UUIDs)',
  title: 'Element System Demo - UUID Version',
  description: 'Demonstrates the Element-based component system with string UUIDs and refactored ElementRegistry usage.',
  category: 'Examples',
  thumbnail: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=400&h=225&q=80',
  logoUrl: 'https://via.placeholder.com/120x40',
  colors: {
    primary: '#3b82f6',
    secondary: '#6366f1',
    accent: '#06b6d4',
  },
  sections: [
    {
      id: uuidv4(), // Section ID is string
      type: 'HeroSection' as SectionType,
      name: 'Interactive Element Showcase',
      editable: 'editable' as EditableType,
      properties: {
        sectionTitle: 'Interactive Element Demo',
        sectionSubtitle: 'Elements below are created via the updated ElementRegistry.',
        background: { type: 'color', color: '#eef2ff' },
      },
      spacing: { top: 48, bottom: 48, between: 24 },
      allowedComponentTypes: ['element-container' as ComponentType],
      components: [
        {
          id: uuidv4(), // Component ID is string
          type: 'element-container' as ComponentType,
          editable: 'editable' as EditableType,
          elements: [
            elementRegistry.createElement('heading', {
              properties: { text: 'Element Showcase (UUIDs)', level: 'h1', textAlign: 'center', textColor: '#1e3a8a' }
            }),
            elementRegistry.createElement('paragraph', {
              properties: { text: 'Using ElementRegistry with string UUIDs and unified properties.', textAlign: 'center', textColor: '#374151' }
            }),
            elementRegistry.createElement('image', {
              properties: {
                src: 'https://images.unsplash.com/photo-1604964432806-254d07c11f32?auto=format&fit=crop&w=800&h=400&q=80',
                alt: 'Developer setup',
                caption: 'Code and creativity',
                width: '100%',
                objectFit: 'contain',
                padding: '10px'
              }
            }),
            elementRegistry.createElement('button', {
              properties: {
                text: 'Explore Registry',
                actionUrl: '#registry',
                style: 'primary',
                size: 'lg',
                textAlign: 'center'
              }
            }),
            elementRegistry.createElement('form-field', {
              properties: {
                label: 'Full Name',
                placeholder: 'E.g., Ada Lovelace',
                required: true,
                fieldType: 'text'
              }
            }),
            elementRegistry.createElement('form-field', {
              properties: {
                label: 'Contact Email',
                placeholder: 'ada@example.com',
                required: true,
                fieldType: 'email'
              }
            }),
            elementRegistry.createElement('form-field', {
              properties: {
                label: 'Your Feedback',
                placeholder: 'Share your thoughts on the new element system...',
                required: false,
                fieldType: 'textarea'
              }
            }),
            elementRegistry.createElement('heading', {
              properties: { text: 'Key Refinements', level: 'h2', textAlign: 'left', textColor: '#1e3a8a' }
            }),
            elementRegistry.createElement('paragraph', { properties: { text: '✓ ElementRegistry creates schema-aligned elements.', textColor: '#166534' }}),
            elementRegistry.createElement('paragraph', { properties: { text: '✓ String UUIDs for all Section/Component/Element IDs.', textColor: '#166534' }}),
            elementRegistry.createElement('paragraph', { properties: { text: '✓ Properties object consolidates all element data.', textColor: '#166534' }}),
          ].filter(element => element !== null) as ElementData[],
          parameters: {
            styleOptions: {
              backgroundColor: '#ffffff',
              padding: '2rem',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            },
            usesElements: true
          },
          swappableWith: [],
        }
      ]
    }
  ]
};