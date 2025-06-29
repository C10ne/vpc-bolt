import type { Template } from '@shared/schema';

export const templates: Template[] = [
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
    sections: [
      {
        id: 'hero-section',
        type: 'hero',
        name: 'Hero Section',
        components: [
          {
            id: 'hero-content',
            type: 'hero-banner',
            name: 'Main Hero Banner',
            data: {
              title: 'Transform Your Business Online',
              subtitle: 'Create a professional website that converts visitors into customers.',
              buttonText: 'Get Started',
              backgroundImage: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1400&h=600',
            },
          },
        ],
      },
      {
        id: 'features-section',
        type: 'features',
        name: 'Features Section',
        components: [
          {
            id: 'features-grid',
            type: 'feature-grid',
            name: 'Feature Grid',
            data: {
              title: 'Why Choose Us',
              features: [
                {
                  icon: 'star',
                  title: 'Premium Quality',
                  description: 'High-quality products and services that exceed expectations.',
                },
                {
                  icon: 'shield',
                  title: 'Secure & Reliable',
                  description: 'Your data and transactions are protected with enterprise-grade security.',
                },
                {
                  icon: 'clock',
                  title: '24/7 Support',
                  description: 'Round-the-clock customer support to help you whenever you need it.',
                },
              ],
            },
          },
        ],
      },
    ],
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
    sections: [
      {
        id: 'element-showcase',
        type: 'showcase',
        name: 'Element Showcase',
        components: [
          {
            id: 'element-demo',
            type: 'element-container',
            name: 'Element Demo Container',
            data: {
              elements: [
                {
                  id: 'demo-heading',
                  type: 'heading',
                  content: {
                    text: 'Element System Demo',
                    level: 'h1',
                  },
                  style: {
                    textAlign: 'center',
                    textColor: '#7c3aed',
                  },
                },
                {
                  id: 'demo-paragraph',
                  type: 'paragraph',
                  content: {
                    text: 'This template showcases the new element-based system where each component is built from individual, editable elements.',
                  },
                  style: {
                    textAlign: 'center',
                  },
                },
                {
                  id: 'demo-button',
                  type: 'button',
                  content: {
                    text: 'Try Interactive Elements',
                    href: '#interactive',
                  },
                  properties: {
                    variant: 'primary',
                    size: 'lg',
                  },
                },
              ],
            },
          },
        ],
      },
    ],
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
    sections: [
      {
        id: 'portfolio-hero',
        type: 'hero',
        name: 'Portfolio Hero',
        components: [
          {
            id: 'portfolio-intro',
            type: 'hero-banner',
            name: 'Portfolio Introduction',
            data: {
              title: 'Creative Portfolio',
              subtitle: 'Showcasing exceptional work and creative solutions.',
              buttonText: 'View Portfolio',
              backgroundImage: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1400&h=600',
            },
          },
        ],
      },
      {
        id: 'gallery-section',
        type: 'gallery',
        name: 'Project Gallery',
        components: [
          {
            id: 'project-gallery',
            type: 'image-gallery',
            name: 'Project Gallery',
            data: {
              title: 'Featured Projects',
              images: [
                {
                  src: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400&h=300',
                  alt: 'Project 1',
                  caption: 'Creative Design Project',
                },
                {
                  src: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=300',
                  alt: 'Project 2',
                  caption: 'Web Development',
                },
                {
                  src: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400&h=300',
                  alt: 'Project 3',
                  caption: 'Brand Identity',
                },
              ],
            },
          },
        ],
      },
    ],
  },
];