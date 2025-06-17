import { TemplateSettings } from '@/lib/types'

export const template: TemplateSettings = {
  id: 'business',
  name: 'Business Template',
  description: 'Professional template with 5 sections',
  thumbnail: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=400&h=225&q=80',
  layout: 'layout.tsx',
  metaData: {
    title: 'My Business',
    subtitle: 'Welcome to our business website',
    metaDescription: 'Professional business website template with modern design',
  },
  themeSettings: {
    logo: 'https://placeholder.pagebee.io/api/random//120/40',
    colorScheme: {
      primary: '#4361ee',
      secondary: '#3f37c9',
      accent: '#4cc9f0',
    },
    typography: {
      fontFamily: 'Inter, sans-serif',
      headingFont: 'Inter, sans-serif',
      bodyFont: 'Inter, sans-serif',
    }
  }
};
