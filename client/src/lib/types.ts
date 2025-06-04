
import { ReactNode } from 'react';

export type LockStatus = 'locked' | 'open' | 'locked-move' | 'locked-remove';

export interface ComponentSlot {
  id: string;
  allowedComponentTypes: string[];
  lockStatus: LockStatus[];
}

export interface SectionDefinition {
  id: string;
  type: string;
  layout: string;
  styles: string[];
  displayName: string;
  componentSlots: ComponentSlot[];
}

export interface ComponentDefinition {
  id: string;
  type: string;
  displayName: string;
  layout: string;
  styles: string[];
}

export interface EditableContent {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  linkToSection?: string;
  backgroundImage?: string;
  generic?: Record<string, any>;
}

export interface EditableStyle {
  backgroundColor?: string;
  buttonStyle?: 'primary' | 'secondary' | 'accent';
  padding?: {
    vertical: number;
    horizontal: number;
  };
  [key: string]: any;
}

export interface Component {
  definition: ComponentDefinition;
  editableContent: EditableContent;
  editableStyle: EditableStyle;
  lockStatus: LockStatus[];
}

export interface Section {
  definition: SectionDefinition;
  components: Component[];
  editableProperties: {
    padding?: number[];
    margin?: number[];
  };
}

export interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  layout: string;
  styles: string[];
}

export interface Template {
  definition: TemplateDefinition;
  editableProperties: {
    logo?: string;
    businessName?: string;
    address?: string;
    socialLinks?: {
      fb?: string;
      x?: string;
    };
  };
  editableStyles: {
    colorScheme: {
      primary: string;
      secondary: string;
      accent: string;
    };
    typography: {
      fontFamily: string;
      headingFont: string;
      bodyFont: string;
    };
  };
  sections: Section[];
}
