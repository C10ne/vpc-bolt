
import { Template } from '@/lib/types';

export const businessTemplate: Template = {
  definition: {
    id: 'business',
    name: 'Business Template',
    description: 'Professional template with 5 sections',
    thumbnail: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=400&h=225&q=80',
    layout: 'layout.tsx',
    styles: ['../global/bootstrap.scss', '../../colors.scss', 'css/dark.css']
  },
  editableProperties: {
    logo: 'https://via.placeholder.com/120x40',
    businessName: 'Business Name',
    address: 'Default Address',
    socialLinks: {
      fb: '',
      x: ''
    }
  },
  editableStyles: {
    colorScheme: {
      primary: '#4361ee',
      secondary: '#3f37c9',
      accent: '#4cc9f0'
    },
    typography: {
      fontFamily: 'Inter, sans-serif',
      headingFont: 'Inter, sans-serif',
      bodyFont: 'Inter, sans-serif'
    }
  },
  sections: []
};
