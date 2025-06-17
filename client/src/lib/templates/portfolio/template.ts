
import { TemplateSettings } from '@/lib/types';

export const template: TemplateSettings = {
  id: 'portfolio',
  name: 'Portfolio Template',
  description: 'Professional portfolio template with showcase sections',
  thumbnail: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=400&h=225&q=80',
  layout: 'layout.tsx',
  metaData: {
    title: 'My Portfolio',
    subtitle: 'Welcome to my creative space',
    metaDescription: 'Professional portfolio showcasing my work and skills',
  },
  themeSettings: {
    logo: 'https://placeholder.pagebee.io/api/random//120/40',
    colorScheme: {
      primary: '#6366f1',
      secondary: '#4f46e5',
      accent: '#818cf8',
    },
    typography: {
      fontFamily: 'Inter, sans-serif',
      headingFont: 'Inter, sans-serif',
      bodyFont: 'Inter, sans-serif',
    }
  }
};
