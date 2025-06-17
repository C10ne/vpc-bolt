import { v4 as uuidv4 } from 'uuid';
import { Template } from '../types';
import { elementRegistry } from '../elements';

// Example template demonstrating the Element system
export const elementExamplesTemplate: Template = {
  id: 'element-examples',
  name: 'Element System Demo',
  description: 'Demonstrates the new Element-based component system',
  thumbnail: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=400&h=225&q=80',
  defaultPage: {
    templateId: 'element-examples',
    name: 'Element System Demo',
    globalSettings: {
      title: 'Element System Demo',
      subtitle: 'Showcasing modular HTML building blocks',
      metaDescription: 'Demo template showing the Element system with editable components',
      logo: 'https://placeholder.pagebee.io/api/random//120/40',
      colorScheme: {
        primary: '#3b82f6',
        secondary: '#6366f1',
        accent: '#06b6d4',
      },
    },
    sections: [
      {
        id: uuidv4(),
        name: 'Element Demo',
        title: 'Element System Demonstration',
        subtitle: 'Click on any element below to edit it using the new Element system.',
        properties: {
          backgroundStyle: 'color',
          backgroundColor: '#f8fafc',
          padding: {
            vertical: 48,
            horizontal: 24,
          },
        },
        allowedComponents: ['element-container'],
        components: [
          {
            id: uuidv4(),
            type: 'element-container',
            content: {
              elements: [
                // Example heading element
                elementRegistry.createElement('heading', {
                  content: {
                    text: 'Welcome to the Element System',
                    level: 'h1'
                  },
                  style: {
                    textAlign: 'center',
                    textColor: '#1f2937'
                  }
                }),
                
                // Example paragraph element
                elementRegistry.createElement('paragraph', {
                  content: {
                    text: 'This demonstrates the new Element system where components are built from modular, editable HTML building blocks. Each element can be individually selected, edited, and styled.'
                  },
                  style: {
                    textAlign: 'center',
                    textColor: '#6b7280'
                  }
                }),
                
                // Example image element
                elementRegistry.createElement('image', {
                  content: {
                    src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&h=400&q=80',
                    alt: 'Analytics dashboard',
                    caption: 'Modern web analytics interface'
                  },
                  properties: {
                    width: '100%',
                    objectFit: 'cover'
                  }
                }),
                
                // Example button element
                elementRegistry.createElement('button', {
                  content: {
                    text: 'Try Element Editing',
                    href: '#demo'
                  },
                  properties: {
                    variant: 'primary',
                    size: 'lg'
                  },
                  style: {
                    textAlign: 'center'
                  }
                }),
                
                // Example form field elements
                elementRegistry.createElement('form-field', {
                  content: {
                    label: 'Your Name',
                    placeholder: 'Enter your full name',
                    required: true
                  },
                  properties: {
                    fieldType: 'text'
                  }
                }),
                
                elementRegistry.createElement('form-field', {
                  content: {
                    label: 'Email Address',
                    placeholder: 'you@example.com',
                    required: true
                  },
                  properties: {
                    fieldType: 'email'
                  }
                }),
                
                elementRegistry.createElement('form-field', {
                  content: {
                    label: 'Message',
                    placeholder: 'Tell us what you think about the Element system...',
                    required: false
                  },
                  properties: {
                    fieldType: 'textarea'
                  }
                }),
                
                // Another heading for the features section
                elementRegistry.createElement('heading', {
                  content: {
                    text: 'Element System Features',
                    level: 'h2'
                  },
                  style: {
                    textAlign: 'left',
                    textColor: '#1f2937'
                  }
                }),
                
                // Feature list using paragraphs
                elementRegistry.createElement('paragraph', {
                  content: {
                    text: '✓ Individual element selection and editing'
                  },
                  style: {
                    textColor: '#059669'
                  }
                }),
                
                elementRegistry.createElement('paragraph', {
                  content: {
                    text: '✓ Floating quick controls for common actions'
                  },
                  style: {
                    textColor: '#059669'
                  }
                }),
                
                elementRegistry.createElement('paragraph', {
                  content: {
                    text: '✓ Granular styling and content editing'
                  },
                  style: {
                    textColor: '#059669'
                  }
                }),
                
                elementRegistry.createElement('paragraph', {
                  content: {
                    text: '✓ Type-safe element definitions and registry'
                  },
                  style: {
                    textColor: '#059669'
                  }
                })
              ].filter(element => element !== null)
            },
            styleOptions: {
              backgroundColor: '#ffffff',
              padding: '2rem'
            },
            replacingLocked: false,
            editingLocked: false,
            usesElements: true
          }
        ]
      }
    ]
  }
};
