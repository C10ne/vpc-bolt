
import { Template, TemplateDefinition, Section } from '../types';

export abstract class BaseTemplate implements Template {
  definition: TemplateDefinition;
  sections: Section[] = [];
  editableProperties = {
    logo: '',
    businessName: '',
    address: '',
    socialLinks: {
      fb: '',
      x: ''
    }
  };
  editableStyles = {
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
  };

  constructor(definition: TemplateDefinition) {
    this.definition = definition;
  }

  abstract initialize(): void;
  
  protected addSection(section: Section) {
    this.sections.push(section);
  }
}
