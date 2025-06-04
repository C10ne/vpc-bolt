import { nanoid } from 'nanoid';
import { 
  Template, 
  TemplateContent, 
  Section, 
  Component, 
  ElementStatus 
} from '../types';

export function createEmptyTemplate(name = 'New Template'): TemplateContent {
  return {
    id: nanoid(),
    name,
    globalStyles: {
      colorScheme: {
        primary: '#3B82F6',
        secondary: '#6366F1',
        accent: '#8B5CF6',
        background: '#ffffff',
        text: '#111827',
        muted: '#6B7280',
      },
      typography: {
        fontFamily: 'Inter, sans-serif',
        headingFont: 'Inter, sans-serif',
        bodyFont: 'Inter, sans-serif',
      },
      title: 'Untitled',
      subtitle: 'My new website',
      metaDescription: 'A website built with VisualBuilder',
    },
    sections: []
  };
}

export function createNewSection(type: string, name: string, status: ElementStatus = 'editable'): Section {
  const sectionTemplates: Record<string, Omit<Section, 'id'>> = {
    header: {
      type: 'header',
      name: 'Header',
      status,
      properties: {
        background: '#3B82F6',
        textColor: '#ffffff',
      },
      components: [
        {
          id: nanoid(),
          type: 'navbar',
          properties: {
            links: [
              { id: nanoid(), text: 'Home', url: '#' },
              { id: nanoid(), text: 'About', url: '#' },
              { id: nanoid(), text: 'Contact', url: '#' },
            ],
            logo: {
              text: 'Brand Name',
              badge: ''
            }
          }
        }
      ]
    },
    hero: {
      type: 'hero',
      name: 'Hero Section',
      status,
      properties: {
        heading: 'Welcome to our Website',
        subheading: 'A brief description goes here.',
        buttonText: 'Get Started',
        buttonUrl: '#',
        background: {
          type: 'image',
          value: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da'
        }
      },
      components: [
        {
          id: nanoid(),
          type: 'hero-content',
          properties: {
            overlayOpacity: 0.4,
          }
        }
      ]
    },
    'featured-products': {
      type: 'featured-products',
      name: 'Featured Products',
      status,
      properties: {
        heading: 'Featured Products',
        buttonText: 'View All',
        buttonUrl: '#',
        background: '#ffffff',
        spacing: {
          top: 12,
          bottom: 12
        }
      },
      components: [
        {
          id: nanoid(),
          type: 'product-card',
          properties: {
            id: nanoid(),
            name: 'Product Name',
            description: 'Product description goes here',
            price: 99.99,
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
            buttonText: 'Add to Cart'
          }
        }
      ]
    },
    testimonials: {
      type: 'testimonials',
      name: 'Testimonials',
      status,
      properties: {
        heading: 'What Our Customers Say',
        background: '#F9FAFB'
      },
      components: [
        {
          id: nanoid(),
          type: 'testimonial-card',
          properties: {
            name: 'Customer Name',
            avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956',
            rating: 5,
            text: 'Testimonial text goes here.'
          }
        }
      ]
    },
    footer: {
      type: 'footer',
      name: 'Footer',
      status,
      properties: {
        background: '#1F2937',
        textColor: '#ffffff',
        mutedTextColor: '#9CA3AF'
      },
      components: [
        {
          id: nanoid(),
          type: 'footer-content',
          properties: {
            columns: [
              {
                id: nanoid(),
                title: 'Brand Name',
                content: 'Brief description of your company.'
              },
              {
                id: nanoid(),
                title: 'Links',
                links: [
                  { id: nanoid(), text: 'Home', url: '#' },
                  { id: nanoid(), text: 'About', url: '#' },
                  { id: nanoid(), text: 'Contact', url: '#' }
                ]
              }
            ],
            copyright: '© 2023 Brand Name. All rights reserved.'
          }
        }
      ]
    }
  };

  const sectionTemplate = sectionTemplates[type] || {
    type,
    name,
    status,
    properties: {},
    components: []
  };

  return {
    ...sectionTemplate,
    id: nanoid()
  };
}

export function getStatusBadge(status: ElementStatus) {
  switch (status) {
    case 'editable':
      return {
        text: 'Editable',
        icon: 'unlock',
        color: 'text-green-500'
      };
    case 'locked-components':
      return {
        text: 'Components Locked',
        icon: 'lock',
        color: 'text-amber-500'
      };
    case 'locked-editing':
      return {
        text: 'Editing Locked',
        icon: 'lock',
        color: 'text-red-500'
      };
    default:
      return {
        text: 'Unknown',
        icon: 'help-circle',
        color: 'text-gray-500'
      };
  }
}

export function createComponent(type: string): Component {
  const componentTemplates: Record<string, Omit<Component, 'id'>> = {
    'product-card': {
      type: 'product-card',
      properties: {
        name: 'New Product',
        description: 'Product description goes here',
        price: 99.99,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
        buttonText: 'Add to Cart'
      }
    },
    'testimonial-card': {
      type: 'testimonial-card',
      properties: {
        name: 'Customer Name',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956',
        rating: 5,
        text: 'Testimonial text goes here.'
      }
    }
  };

  const componentTemplate = componentTemplates[type] || {
    type,
    properties: {}
  };

  return {
    ...componentTemplate,
    id: nanoid()
  };
}

export function findSectionAndComponent(template: TemplateContent, componentId: string): {
  section: Section | null;
  component: Component | null;
} {
  for (const section of template.sections) {
    const component = section.components.find(c => c.id === componentId);
    if (component) {
      return { section, component };
    }
  }
  return { section: null, component: null };
}

export function canEditComponent(section: Section): boolean {
  return section.status !== 'locked-editing';
}

export function canAddComponent(section: Section): boolean {
  return section.status !== 'locked-components' && section.status !== 'locked-editing';
}

export function canDeleteComponent(section: Section): boolean {
  return section.status !== 'locked-components' && section.status !== 'locked-editing';
}

export function formatDateForDisplay(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString();
}
