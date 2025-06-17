import { v4 as uuidv4 } from 'uuid';
import {
  Template as TemplateData,
  Section as SectionData,
  Component as ComponentData,
  Element as ElementData,
  ComponentType,
  ElementType,
  EditableType,
  SectionType
} from '@shared/schema';
import { elementRegistry } from '../../elements'; // Corrected path for elementRegistry

export const template: TemplateData = {
  id: uuidv4(),
  name: 'Business Website',
  title: 'My Business Co.',
  description: 'A professional and modern template for businesses, featuring a clean layout and essential sections.',
  category: 'Business',
  thumbnail: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=400&h=225&q=80',
  logoUrl: 'https://via.placeholder.com/150x50?text=BusinesCo',
  colors: {
    primary: '#4A90E2',
    secondary: '#50E3C2',
    accent: '#F5A623',
  },
  sections: [
    // Header Section
    {
      id: uuidv4(),
      type: 'HeaderSection' as SectionType,
      name: 'Page Header',
      editable: 'editable' as EditableType,
      properties: {
        stickyHeader: true,
        background: { type: 'color', color: '#ffffff' },
        padding: { vertical: 10, horizontal: 20}
      },
      spacing: { top: 0, bottom: 0, between: 0 },
      allowedComponentTypes: ['Header' as ComponentType],
      components: [
        {
          id: uuidv4(),
          type: 'Header' as ComponentType,
          editable: 'editable' as EditableType,
          elements: [
            elementRegistry.createElement('Image', {
              properties: { src: 'https://via.placeholder.com/150x50?text=BusinesCo', alt: 'Business Co. Logo', width: '150px', height: 'auto', objectFit: 'contain' }
            }) as ElementData,
            elementRegistry.createElement('Group', {
              properties: {
                layout: 'horizontal',
                gap: '20px',
                alignment: 'center',
                elements: [
                  elementRegistry.createElement('Button', { properties: { text: 'Home', style: 'link', actionUrl: '#home' } }),
                  elementRegistry.createElement('Button', { properties: { text: 'About', style: 'link', actionUrl: '#about' } }),
                  elementRegistry.createElement('Button', { properties: { text: 'Services', style: 'link', actionUrl: '#services' } }),
                  elementRegistry.createElement('Button', { properties: { text: 'Contact', style: 'link', actionUrl: '#contact' } }),
                ].filter(Boolean) as ElementData[] // Filter nulls from inner elements array
              }
            }) as ElementData,
            elementRegistry.createElement('Button', {
              properties: { text: 'Get Quote', style: 'primary', actionUrl: '#quote' }
            }) as ElementData,
          ].filter(Boolean) as ElementData[],
          parameters: { layout: 'spaceBetween' },
        }
      ]
    },
    // Hero Section
    {
      id: uuidv4(),
      type: 'HeroSection' as SectionType,
      name: 'Main Hero',
      editable: 'editable' as EditableType,
      properties: {
        background: {
          type: 'image',
          imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&h=600&q=80',
          overlayColor: 'rgba(0,0,0,0.4)'
        },
        text: { color: '#ffffff' },
      },
      spacing: { top: 80, bottom: 80, between: 20 },
      allowedComponentTypes: ['HeroImage' as ComponentType],
      components: [
        {
          id: uuidv4(),
          type: 'HeroImage' as ComponentType,
          editable: 'editable' as EditableType,
          elements: [
            elementRegistry.createElement('Heading', {
              properties: { text: 'Grow Your Business With Us', level: 'h1', textAlign: 'center', textColor: '#FFFFFF' }
            }) as ElementData,
            elementRegistry.createElement('Paragraph', {
              properties: { text: 'We provide innovative solutions to boost your productivity and success. Join us now!', textAlign: 'center', textColor: '#f0f0f0', fontSize: '1.1rem' }
            }) as ElementData,
            elementRegistry.createElement('Button', {
              properties: { text: 'Discover Our Services', actionUrl: '#services', style: 'primary', size: 'lg', textAlign: 'center' }
            }) as ElementData,
          ].filter(Boolean) as ElementData[],
          parameters: { contentAlignment: 'center' }
        }
      ]
    },
    // About Us Section (using RichTextComponent)
    {
      id: uuidv4(),
      type: 'BasicSection' as SectionType,
      name: 'About Us',
      editable: 'editable' as EditableType,
      properties: {
        background: { type: 'color', color: '#f9f9f9' },
      },
      spacing: { top: 50, bottom: 50, between: 20 },
      allowedComponentTypes: ['RichTextComponent' as ComponentType],
      components: [
        {
          id: uuidv4(),
          type: 'RichTextComponent' as ComponentType,
          editable: 'editable' as EditableType,
          elements: [
            elementRegistry.createElement('RichText', {
              properties: {
                htmlContent: '<h2>About Our Company</h2><p>Founded in <strong>2024</strong>, BusinesCo has been dedicated to providing top-notch services in the tech industry. Our team of experts is passionate about helping businesses like yours achieve their goals through innovative technology and strategic insights. We believe in collaboration, integrity, and pushing the boundaries of what\'s possible.</p><p>Learn more about our journey and the values that drive us.</p>'
              }
            }) as ElementData,
          ].filter(Boolean) as ElementData[],
          parameters: { textContainerMaxWidth: '800px' }
        }
      ]
    }
  ]
};