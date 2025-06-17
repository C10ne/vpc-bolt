import { Template } from './types';
import { v4 as uuidv4 } from 'uuid';
import { elementExamplesTemplate } from './templates/element-examples';

export const templates: Template[] = [
  {
    id: 'business',
    name: 'Business Website',
    description: 'Professional template with 5 sections',
    thumbnail: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=400&h=225&q=80',
    defaultPage: {
      templateId: 'business',
      name: 'Business Template',
      globalSettings: {
        title: 'Business Template',
        subtitle: 'A professional business website template',
        metaDescription: 'Professional business website template with modern design',
        logo: 'https://placeholder.pagebee.io/api/random//120/40',
        colorScheme: {
          primary: '#4361ee',
          secondary: '#3f37c9',
          accent: '#4cc9f0',
        },
      },
      sections: [
        {
          id: uuidv4(),
          name: 'Hero',
          properties: {
            backgroundStyle: 'image',
            padding: {
              vertical: 0,
              horizontal: 0,
            },
          },
          allowedComponents: ['hero-image', 'video-hero', 'slider'],
          components: [
            {
              id: uuidv4(),
              type: 'hero-image',
              content: {
                title: 'Transform Your Business Online',
                subtitle: 'Create a professional website that converts visitors into customers.',
                buttonText: 'Get Started',
                backgroundImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1400&h=600&q=80',
              },
              styleOptions: {
                overlayColor: 'linear-gradient(90deg, rgba(0,0,0,0.5) 0%, transparent 100%)',
                textColor: '#FFFFFF',
                buttonStyle: 'primary',
              },
              replacingLocked: false,
              editingLocked: false,
            },
          ],
        },
        {
          id: uuidv4(),
          name: 'Features',
          title: 'Our Services',
          subtitle: 'Comprehensive solutions to help your business grow and succeed in the digital landscape.',
          properties: {
            backgroundStyle: 'color',
            backgroundColor: '#FFFFFF',
            padding: {
              vertical: 64,
              horizontal: 24,
            },
          },
          allowedComponents: ['features'],
          components: [
            {
              id: uuidv4(),
              type: 'features',
              content: {
                features: [
                  {
                    icon: 'language',
                    title: 'Web Development',
                    description: 'Custom websites built for optimal performance and user experience.'
                  },
                  {
                    icon: 'trending_up',
                    title: 'SEO Optimization',
                    description: 'Drive traffic and improve your search rankings effectively.'
                  },
                  {
                    icon: 'smartphone',
                    title: 'Mobile Solutions',
                    description: 'Responsive designs that work flawlessly on all devices.'
                  }
                ]
              },
              replacingLocked: true,
              editingLocked: false,
            },
          ],
        },
        {
          id: uuidv4(),
          name: 'Testimonials',
          title: 'What Our Clients Say',
          subtitle: "Don't just take our word for it - hear from our satisfied customers.",
          properties: {
            backgroundStyle: 'color',
            backgroundColor: '#f8f9fa',
            padding: {
              vertical: 64,
              horizontal: 24,
            },
          },
          allowedComponents: ['testimonials'],
          components: [
            {
              id: uuidv4(),
              type: 'testimonials',
              content: {
                testimonials: [
                  {
                    image: 'https://randomuser.me/api/portraits/women/68.jpg',
                    name: 'Sarah Johnson',
                    position: 'CEO, TechStart Inc.',
                    quote: 'Working with this team transformed our online presence. Our conversion rates have increased by 150% since the new website launch.',
                    rating: 5
                  },
                  {
                    image: 'https://randomuser.me/api/portraits/men/32.jpg',
                    name: 'Michael Rodriguez',
                    position: 'Marketing Director, GrowthLabs',
                    quote: 'The attention to detail and the strategic approach to our website redesign exceeded our expectations. Highly recommended!',
                    rating: 4.5
                  }
                ]
              },
              replacingLocked: false,
              editingLocked: true,
            },
          ],
        },
        {
          id: uuidv4(),
          name: 'Contact',
          title: 'Get In Touch',
          subtitle: 'Ready to start your project? Contact us today for a free consultation.',
          properties: {
            backgroundStyle: 'color',
            backgroundColor: '#FFFFFF',
            padding: {
              vertical: 64,
              horizontal: 24,
            },
          },
          allowedComponents: ['contact-form'],
          components: [
            {
              id: uuidv4(),
              type: 'contact-form',
              content: {
                buttonText: 'Send Message'
              },
              replacingLocked: false,
              editingLocked: false,
            },
          ],
        },
        {
          id: uuidv4(),
          name: 'Footer',
          properties: {
            backgroundStyle: 'color',
            backgroundColor: '#212529',
            padding: {
              vertical: 64,
              horizontal: 24,
            },
          },
          allowedComponents: ['footer'],
          components: [
            {
              id: uuidv4(),
              type: 'footer',
              content: {
                logo: '',
                description: 'Creating beautiful, functional websites for businesses of all sizes.',
                services: {
                  title: 'Services',
                  items: ['Web Development', 'SEO Optimization', 'Mobile Solutions', 'E-commerce']
                },
                company: {
                  title: 'Company',
                  items: ['About Us', 'Our Team', 'Careers', 'Contact']
                },
                connect: {
                  title: 'Connect',
                  social: ['facebook', 'twitter', 'linkedin', 'instagram'],
                  contact: 'info@example.com<br>+1 (555) 123-4567'
                },
                copyright: '© 2023 Business Template. All rights reserved.'
              },
              replacingLocked: false,
              editingLocked: false,
            },
          ],
        },
      ],
    },
  },
  {
    id: 'ecommerce',
    name: 'E-commerce Landing',
    description: 'Optimized for product showcases',
    thumbnail: 'https://images.unsplash.com/photo-1556742031-c6961e8560b0?auto=format&fit=crop&w=400&h=225&q=80',
    defaultPage: {
      templateId: 'ecommerce',
      name: 'E-commerce Landing',
      globalSettings: {
        title: 'E-commerce Template',
        subtitle: 'Showcase your products beautifully',
        metaDescription: 'E-commerce landing page template to showcase your products',
        logo: 'https://placeholder.pagebee.io/api/random//120/40',
        colorScheme: {
          primary: '#4361ee',
          secondary: '#3f37c9',
          accent: '#4cc9f0',
        },
      },
      sections: [
        {
          id: uuidv4(),
          name: 'Hero',
          properties: {
            backgroundStyle: 'image',
            padding: {
              vertical: 0,
              horizontal: 0,
            },
          },
          allowedComponents: ['hero-image', 'slider'],
          components: [
            {
              id: uuidv4(),
              type: 'slider',
              content: {
                slides: [
                  {
                    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1400&h=600&q=80',
                    title: 'Summer Collection',
                    subtitle: 'Discover our new summer products with 20% off',
                    buttonText: 'Shop Now',
                  },
                  {
                    image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=1400&h=600&q=80',
                    title: 'Special Deals',
                    subtitle: 'Limited time offers on selected items',
                    buttonText: 'View Deals',
                  }
                ]
              },
              styleOptions: {
                overlayColor: 'rgba(0,0,0,0.5)',
                textColor: '#FFFFFF',
                buttonStyle: 'primary',
              },
              replacingLocked: false,
              editingLocked: false,
            },
          ],
        },
        // Additional sections would be defined here
      ],
    },
  },
  {
    id: 'portfolio',
    name: 'Portfolio',
    description: 'Showcase your work professionally',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=400&h=225&q=80',
    defaultPage: {
      templateId: 'portfolio',
      name: 'Portfolio',
      globalSettings: {
        title: 'My Portfolio',
        subtitle: 'Showcasing my professional work',
        metaDescription: 'Professional portfolio website template',
        logo: 'https://placeholder.pagebee.io/api/random//120/40',
        colorScheme: {
          primary: '#4361ee',
          secondary: '#3f37c9',
          accent: '#4cc9f0',
        },
      },
      sections: [
        // Portfolio sections would be defined here
      ],
    },
  },
  {
    id: 'blog',
    name: 'Blog',
    description: 'Clean design for content creators',
    thumbnail: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=400&h=225&q=80',
    defaultPage: {
      templateId: 'blog',
      name: 'Blog',
      globalSettings: {
        title: 'My Blog',
        subtitle: 'Thoughts, stories and ideas',
        metaDescription: 'Clean blog website template for content creators',
        logo: 'https://placeholder.pagebee.io/api/random//120/40',
        colorScheme: {
          primary: '#4361ee',
          secondary: '#3f37c9',
          accent: '#4cc9f0',
        },
      },
      sections: [
        // Blog sections would be defined here
      ],
    },
  },
  {
    id: 'restaurant',
    name: 'Restaurant',
    description: 'Food-focused with menu integration',
    thumbnail: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=400&h=225&q=80',
    defaultPage: {
      templateId: 'restaurant',
      name: 'Restaurant',
      globalSettings: {
        title: 'Restaurant Name',
        subtitle: 'Fine dining experience',
        metaDescription: 'Restaurant website template with menu integration',
        logo: 'https://placeholder.pagebee.io/api/random//120/40',
        colorScheme: {
          primary: '#4361ee',
          secondary: '#3f37c9',
          accent: '#4cc9f0',
        },
      },
      sections: [
        // Restaurant sections would be defined here
      ],
    },
  },
  {
    id: 'event',
    name: 'Event Landing Page',
    description: 'Promote your upcoming events',
    thumbnail: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=400&h=225&q=80',
    defaultPage: {
      templateId: 'event',
      name: 'Event Landing Page',
      globalSettings: {
        title: 'Event Name',
        subtitle: 'Date and Location',
        metaDescription: 'Event landing page template to promote your upcoming events',
        logo: 'https://placeholder.pagebee.io/api/random//120/40',
        colorScheme: {
          primary: '#4361ee',
          secondary: '#3f37c9',
          accent: '#4cc9f0',
        },
      },
      sections: [
        // Event sections would be defined here
      ],
    },
  },
  elementExamplesTemplate,
];
