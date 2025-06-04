import { ComponentInterface } from '../component.interface';
import { ComponentType, LockStatus } from '../../types'
import { v4 as uuidv4 } from 'uuid';

export class HeroImage implements ComponentInterface {
    id:string = uuidv4();
    type: ComponentType = 'hero-image';
    displayTitle: string | null;
    content = {
      title: 'Transform Your Business Online',
      subtitle: 'Create a professional website that converts visitors into customers.',
      buttonText: 'Get Started',
      buttonLink?: '',
      linkToSection?: '',
      backgroundImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1400&h=600&q=80',
    };
    editableStyle = {
      'linear-gradient(90deg, rgba(0,0,0,0.5) 0%, transparent 100%)';
    '#FFFFFF';
      'primary';
      'cover';
    };
    lockStatus: LockStatus[];
}

sections: [

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
      
    ],
  },
],