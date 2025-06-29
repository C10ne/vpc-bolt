import type { TemplateRecord } from '@shared/schema';

// Mock templates data that matches the database schema
export const templates: TemplateRecord[] = [
  {
    id: 1,
    name: 'Business Template',
    title: 'Professional Business Website',
    category: 'business',
    description: 'A clean, professional template perfect for businesses and corporate websites.',
    thumbnail: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=225',
    logoUrl: 'https://via.placeholder.com/120x40/4361ee/ffffff?text=LOGO',
    colors: {
      primary: '#4361ee',
      secondary: '#3f37c9',
      accent: '#4cc9f0',
    },
    metadata: {
      author: 'PageCraft',
      tags: ['business', 'professional', 'corporate'],
      version: '1.0.0',
    },
    createdAt: new Date('2024-01-01T00:00:00Z'),
  },
  {
    id: 2,
    name: 'Element System Demo Template',
    title: 'Element System Showcase',
    category: 'demo',
    description: 'Demonstrates the new element-based component system with interactive examples.',
    thumbnail: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400&h=225',
    logoUrl: 'https://via.placeholder.com/120x40/7c3aed/ffffff?text=ELEMENTS',
    colors: {
      primary: '#7c3aed',
      secondary: '#a855f7',
      accent: '#c084fc',
    },
    metadata: {
      author: 'PageCraft',
      tags: ['demo', 'elements', 'showcase'],
      version: '1.0.0',
    },
    createdAt: new Date('2024-01-02T00:00:00Z'),
  },
  {
    id: 3,
    name: 'Showcase Template',
    title: 'Portfolio & Showcase',
    category: 'portfolio',
    description: 'Perfect for showcasing your work, portfolio, or creative projects.',
    thumbnail: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400&h=225',
    logoUrl: 'https://via.placeholder.com/120x40/059669/ffffff?text=SHOWCASE',
    colors: {
      primary: '#059669',
      secondary: '#0d9488',
      accent: '#14b8a6',
    },
    metadata: {
      author: 'PageCraft',
      tags: ['portfolio', 'showcase', 'creative'],
      version: '1.0.0',
    },
    createdAt: new Date('2024-01-03T00:00:00Z'),
  },
];