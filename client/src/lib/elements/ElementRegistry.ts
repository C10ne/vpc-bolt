import { ElementDefinition, ElementType, Element } from './types';
import { v4 as uuidv4 } from 'uuid';

export class ElementRegistry {
  private static instance: ElementRegistry;
  private definitions: Map<ElementType, ElementDefinition> = new Map();

  private constructor() {
    this.registerDefaultElements();
  }

  static getInstance(): ElementRegistry {
    if (!ElementRegistry.instance) {
      ElementRegistry.instance = new ElementRegistry();
    }
    return ElementRegistry.instance;
  }

  private registerDefaultElements() {
    // Heading Element
    this.register({
      type: 'heading',
      displayName: 'Heading',
      defaultContent: {
        text: 'New Heading',
        level: 'h2'
      },
      editableProperties: ['text', 'level'],
      quickControlActions: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
    });

    // Paragraph Element
    this.register({
      type: 'paragraph',
      displayName: 'Paragraph',
      defaultContent: {
        text: 'New paragraph text. Click to edit.',
        rich: false
      },
      editableProperties: ['text'],
      quickControlActions: ['edit', 'format']
    });

    // Image Element
    this.register({
      type: 'image',
      displayName: 'Image',
      defaultContent: {
        src: '',
        alt: 'Image',
        caption: ''
      },
      editableProperties: ['src', 'alt', 'caption'],
      quickControlActions: ['upload', 'url', 'fit']
    });

    // Button Element
    this.register({
      type: 'button',
      displayName: 'Button',
      defaultContent: {
        text: 'Click me',
        href: '',
        onClick: ''
      },
      editableProperties: ['text', 'href'],
      quickControlActions: ['variant', 'size', 'link']
    });

    // Form Field Element
    this.register({
      type: 'form-field',
      displayName: 'Form Field',
      defaultContent: {
        label: 'Field Label',
        placeholder: 'Enter value...',
        value: '',
        required: false
      },
      editableProperties: ['label', 'placeholder', 'required'],
      quickControlActions: ['type', 'required', 'options']
    });

    // Text Group Element
    this.register({
      type: 'text-group',
      displayName: 'Text Group',
      defaultContent: {
        elements: []
      },
      editableProperties: ['elements'],
      quickControlActions: ['add-heading', 'add-paragraph']
    });
  }

  register(definition: ElementDefinition): void {
    this.definitions.set(definition.type, definition);
  }

  getDefinition(type: ElementType): ElementDefinition | undefined {
    return this.definitions.get(type);
  }

  getAllDefinitions(): ElementDefinition[] {
    return Array.from(this.definitions.values());
  }

  createElement(type: ElementType, overrides?: Partial<Element>): Element | null {
    const definition = this.getDefinition(type);
    if (!definition) {
      console.error(`Element type "${type}" not found in registry`);
      return null;
    }

    const baseElement = {
      id: uuidv4(),
      type,
      editable: true,
      locked: false,
      content: { ...definition.defaultContent },
      ...overrides
    };

    // Add type-specific properties
    switch (type) {
      case 'image':
        return {
          ...baseElement,
          properties: {
            width: 'auto',
            height: 'auto',
            objectFit: 'cover',
            ...overrides?.properties
          }
        } as Element;

      case 'button':
        return {
          ...baseElement,
          properties: {
            variant: 'primary',
            size: 'md',
            ...overrides?.properties
          }
        } as Element;

      case 'form-field':
        return {
          ...baseElement,
          properties: {
            fieldType: 'text',
            options: [],
            ...overrides?.properties
          }
        } as Element;

      default:
        return baseElement as Element;
    }
  }

  // Create multiple elements from a template
  createElementsFromTemplate(template: { type: ElementType; content?: any; properties?: any }[]): Element[] {
    return template.map(item => 
      this.createElement(item.type, { 
        content: item.content, 
        properties: item.properties 
      })
    ).filter(element => element !== null) as Element[];
  }

  // Utility method to get element type from HTML tag
  getElementTypeFromTag(tagName: string): ElementType | null {
    const tagMapping: Record<string, ElementType> = {
      'h1': 'heading',
      'h2': 'heading',
      'h3': 'heading',
      'h4': 'heading',
      'h5': 'heading',
      'h6': 'heading',
      'p': 'paragraph',
      'img': 'image',
      'button': 'button',
      'input': 'form-field',
      'textarea': 'form-field',
      'select': 'form-field'
    };

    return tagMapping[tagName.toLowerCase()] || null;
  }
}

// Export singleton instance
export const elementRegistry = ElementRegistry.getInstance();