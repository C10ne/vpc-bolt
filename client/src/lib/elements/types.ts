// Element system types for basic HTML building blocks

export type ElementType = 
  | 'heading'
  | 'paragraph' 
  | 'image'
  | 'button'
  | 'form-field'
  | 'text-group';

export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export type FormFieldType = 'text' | 'email' | 'textarea' | 'select' | 'checkbox';

export interface ElementStyle {
  textColor?: string;
  backgroundColor?: string;
  fontSize?: string;
  fontWeight?: string;
  textAlign?: 'left' | 'center' | 'right';
  padding?: string;
  margin?: string;
  [key: string]: any;
}

// Base Element interface
export interface BaseElement {
  id: string;
  type: ElementType;
  editable: boolean;
  locked: boolean;
  style?: ElementStyle;
}

// Specific Element types
export interface HeadingElement extends BaseElement {
  type: 'heading';
  content: {
    text: string;
    level: HeadingLevel;
  };
}

export interface ParagraphElement extends BaseElement {
  type: 'paragraph';
  content: {
    text: string;
    rich?: boolean; // For future WYSIWYG support
  };
}

export interface ImageElement extends BaseElement {
  type: 'image';
  content: {
    src: string;
    alt: string;
    caption?: string;
  };
  properties: {
    width?: string;
    height?: string;
    objectFit?: 'cover' | 'contain' | 'fill';
  };
}

export interface ButtonElement extends BaseElement {
  type: 'button';
  content: {
    text: string;
    href?: string;
    onClick?: string;
  };
  properties: {
    variant: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
  };
}

export interface FormFieldElement extends BaseElement {
  type: 'form-field';
  content: {
    label: string;
    placeholder: string;
    value?: string;
    required?: boolean;
  };
  properties: {
    fieldType: FormFieldType;
    options?: string[]; // For select fields
  };
}

export interface TextGroupElement extends BaseElement {
  type: 'text-group';
  content: {
    elements: (HeadingElement | ParagraphElement)[];
  };
}

// Union type for all elements
export type Element = 
  | HeadingElement
  | ParagraphElement
  | ImageElement
  | ButtonElement
  | FormFieldElement
  | TextGroupElement;

// Element factory interface
export interface ElementDefinition {
  type: ElementType;
  displayName: string;
  defaultContent: any;
  editableProperties: string[];
  quickControlActions?: string[];
}

// Element editing context
export interface ElementEditingState {
  selectedElement: string | null;
  editingMode: 'content' | 'style' | 'properties';
  hasUnsavedChanges: boolean;
}