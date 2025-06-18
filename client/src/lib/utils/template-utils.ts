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

export function createNewSection(type: string, name?: string, status: ElementStatus = 'editable'): Section {
  const sectionName = name || type.charAt(0).toUpperCase() + type.slice(1); // Default name from type if not provided
  const sectionTemplates: Record<string, Omit<Section, 'id' | 'name'>> = { // name will be handled outside
    header: {
      type: 'header',
      // name: 'Header', // name is now dynamic
      status,
      data: { // Renamed properties to data
        background: '#3B82F6',
        textColor: '#ffffff',
      },
      components: [
        {
          id: nanoid(),
          name: 'Navbar', // Added name
          type: 'navbar',
          data: { // Renamed properties to data
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
      // name: 'Hero Section', // name is now dynamic
      status,
      data: { // Renamed properties to data
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
          name: 'Hero Content', // Added name
          type: 'hero-content',
          data: { // Renamed properties to data
            overlayOpacity: 0.4,
          }
        }
      ]
    },
    'featured-products': {
      type: 'featured-products',
      // name: 'Featured Products', // name is now dynamic
      status,
      data: { // Renamed properties to data
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
          name: 'Product Card', // Added name
          type: 'product-card',
          data: { // Renamed properties to data for consistency
            // id: nanoid(), // component id is top level
            name: 'Product Name', // This is specific data for product card, distinct from component name
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
      // name: 'Testimonials', // name is now dynamic
      status,
      data: { // Renamed properties to data
        heading: 'What Our Customers Say',
        background: '#F9FAFB'
      },
      components: [
        {
          id: nanoid(),
          name: 'Testimonial Card', // Added name
          type: 'testimonial-card',
          data: { // Renamed properties to data
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
      // name: 'Footer', // name is now dynamic
      status,
      data: { // Renamed properties to data
        background: '#1F2937',
        textColor: '#ffffff',
        mutedTextColor: '#9CA3AF'
      },
      components: [
        {
          id: nanoid(),
          name: 'Footer Content', // Added name
          type: 'footer-content',
          data: { // Renamed properties to data
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

  const sectionTemplateBase = sectionTemplates[type] || {
    type,
    status, // status is passed through
    data: {}, // Renamed properties to data
    components: []
  };

  return {
    ...sectionTemplateBase,
    id: nanoid(),
    name: sectionName, // Assign the determined name
  };
}

export function getStatusBadge(status: ElementStatus) {
  // Matching test expectations: { label, color, description }
  switch (status) {
    case 'editable':
      return {
        label: 'Editable', // Changed text to label
        color: 'green',    // Simplified color based on test
        description: 'Full access to edit content and structure.' // Added description
      };
    case 'locked-components':
      return {
        label: 'Components Locked', // Changed text to label
        color: 'yellow',           // Simplified color
        description: 'Content is editable, but components cannot be added or removed.' // Added description
      };
    case 'locked-editing':
      return {
        label: 'Editing Locked', // Changed text to label
        color: 'red',            // Simplified color
        description: 'Content and structure are locked.' // Added description
      };
    default:
      // @ts-expect-error handle unknown case for tests
      const _exhaustiveCheck: never = status; // Ensures all known statuses are handled
      return {
        label: 'Unknown',      // Changed text to label
        color: 'gray',         // Simplified color
        description: 'The status is not recognized.' // Added description
      };
  }
}

export function createComponent(type: string): Component {
  // Default name for the component, can be based on type
  const componentName = type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  const componentDataTemplates: Record<string, object> = { // Changed to store only data part
    'product-card': {
      name: 'New Product', // This is data.name, not component.name
      description: 'Product description goes here',
      price: 99.99,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
      buttonText: 'Add to Cart'
    },
    'testimonial-card': {
      name: 'Customer Name', // This is data.name
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956',
      rating: 5,
      text: 'Testimonial text goes here.'
    }
    // other component types would have their default data structure here
  };

  const defaultData = componentDataTemplates[type] || {};

  return {
    id: nanoid(),
    name: componentName, // Component's own name (e.g., "Product Card")
    type,
    data: defaultData // Changed properties to data
  };
}

export function findSectionAndComponent(template: TemplateContent | null, componentId: string): {
  section: Section | null;
  component: Component | null;
} {
  if (!template || !template.sections || !Array.isArray(template.sections)) {
    return { section: null, component: null };
  }
  for (const section of template.sections) {
    if (section && section.components && Array.isArray(section.components)) {
      const component = section.components.find(c => c.id === componentId);
      if (component) {
        return { section, component };
      }
    }
  }
  return { section: null, component: null };
}

export function canEditComponent(section: Section | null): boolean {
  if (!section) return false;
  return section.status !== 'locked-editing';
}

export function canAddComponent(section: Section | null): boolean {
  if (!section) return false;
  return section.status !== 'locked-components' && section.status !== 'locked-editing';
}

export function canDeleteComponent(section: Section | null): boolean {
  if (!section) return false;
  return section.status !== 'locked-components' && section.status !== 'locked-editing';
}

export function formatDateForDisplay(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString();
}
