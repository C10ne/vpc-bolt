import type { Element } from './elements/types';

// Legacy compatibility types
export type LockStatus = 'locked' | 'open' | 'locked-move' | 'locked-remove';

// Current component types used in templates
export type ComponentType = 
  | 'hero-image' 
  | 'video-hero' 
  | 'slider' 
  | 'features' 
  | 'testimonials' 
  | 'contact-form' 
  | 'footer'
  | 'element-container'; // New type for Element-based components

// Global settings for templates
export interface GlobalSettings {
  title: string;
  subtitle: string;
  metaDescription: string;
  logo: string;
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

// Section properties
export interface SectionProperties {
  backgroundStyle: 'color' | 'image' | 'gradient';
  backgroundColor?: string;
  backgroundImage?: string;
  gradientStartColor?: string;
  gradientEndColor?: string;
  gradientDirection?: string;
  padding: {
    vertical: number;
    horizontal: number;
  };
}

// Component content structure (flexible for different component types)
export interface ComponentContent {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundImage?: string;
  features?: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  testimonials?: Array<{
    image: string;
    name: string;
    position: string;
    quote: string;
    rating: number;
  }>;
  slides?: Array<{
    image: string;
    title: string;
    subtitle: string;
    buttonText: string;
  }>;
  // Add elements array for Element-based components
  elements?: Element[];
  [key: string]: any;
}

// Component style options
export interface ComponentStyleOptions {
  overlayColor?: string;
  textColor?: string;
  backgroundColor?: string;
  buttonStyle?: 'primary' | 'secondary' | 'outline';
  [key: string]: any;
}

// Current Component structure used in templates
export interface Component {
  id: string;
  type: ComponentType;
  content: ComponentContent;
  styleOptions?: ComponentStyleOptions;
  replacingLocked: boolean;
  editingLocked: boolean;
  // New property to indicate if this component uses Elements
  usesElements?: boolean;
}

// Section structure
export interface Section {
  id: string;
  name: string;
  title?: string;
  subtitle?: string;
  properties: SectionProperties;
  allowedComponents: ComponentType[];
  components: Component[];
}

// Page structure
export interface Page {
  templateId: string;
  name: string;
  globalSettings: GlobalSettings;
  sections: Section[];
}

// Template structure
export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  defaultPage: Page;
}

// Editor state
export interface EditorState {
  templates: Template[];
  currentPage: Page;
  templateSelected: boolean;
  selectedSection: string | null;
  selectedComponent: string | null;
  selectedElement?: string | null; // New for Element selection
  activeTool: string;
  previewDevice: 'desktop' | 'tablet' | 'mobile';
  unsavedChanges: boolean;
}

// Legacy types for backward compatibility
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

// Factory functions for creating Element-based components
export function createElementBasedComponent(
  type: ComponentType,
  elements: Element[],
  options?: {
    replacingLocked?: boolean;
    editingLocked?: boolean;
    styleOptions?: ComponentStyleOptions;
  }
): Component {
  return {
    id: crypto.randomUUID(),
    type,
    content: {
      elements
    },
    styleOptions: options?.styleOptions || {},
    replacingLocked: options?.replacingLocked || false,
    editingLocked: options?.editingLocked || false,
    usesElements: true
  };
}

// Helper function to check if a component uses Elements
export function componentUsesElements(component: Component): boolean {
  return component.usesElements === true || Boolean(component.content.elements && Array.isArray(component.content.elements));
}

// Helper function to get elements from a component
export function getElementsFromComponent(component: Component): Element[] {
  if (componentUsesElements(component) && component.content.elements) {
    return component.content.elements;
  }
  return [];
}