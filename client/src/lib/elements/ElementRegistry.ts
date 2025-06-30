import { ElementDefinition, ElementType, Element } from './types'; // Imports updated Element and ElementDefinition
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
      defaultProperties: { // Changed from defaultContent
        text: 'New Heading',
        level: 'h2', // Default level
        // Example: include style-related properties directly if they are common defaults
        textAlign: 'left',
        textColor: '#333333',
      },
      // editableProperties should list keys from the new 'properties' structure
      editableProperties: ['text', 'level', 'textAlign', 'textColor', 'fontSize', 'fontWeight'],
      quickControlActions: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] // These might map to level changes
    });

    // Paragraph Element
    this.register({
      type: 'paragraph',
      displayName: 'Paragraph',
      defaultProperties: {
        text: 'New paragraph text. Click to edit.',
        // rich: false, // If 'rich' was for WYSIWYG, it's a mode, not direct property
        textAlign: 'left',
        textColor: '#555555',
      },
      editableProperties: ['text', 'textAlign', 'textColor', 'fontSize', 'fontWeight'],
      quickControlActions: ['edit', 'format'] // 'format' is generic, specific actions like 'bold' would be better
    });

    // Image Element
    this.register({
      type: 'image',
      displayName: 'Image',
      defaultProperties: { // Consolidate src, alt, caption and previous hardcoded properties
        src: 'https://via.placeholder.com/400x200.png?text=Placeholder+Image',
        alt: 'Placeholder Image',
        caption: '',
        width: '100%', // Default width
        height: 'auto',  // Default height
        objectFit: 'cover', // Default objectFit
      },
      editableProperties: ['src', 'alt', 'caption', 'width', 'height', 'objectFit', 'padding', 'margin'],
      quickControlActions: ['upload', 'url', 'fit'] // 'fit' could map to objectFit
    });

    // Button Element
    this.register({
      type: 'button',
      displayName: 'Button',
      defaultProperties: {
        text: 'Click me',
        href: '#', // Default link
        // onClick: '', // onClick handlers are complex for properties, usually managed by component logic
        variant: 'primary', // Default variant
        size: 'md',       // Default size
        textAlign: 'center', // Example style property
      },
      editableProperties: ['text', 'href', 'variant', 'size', 'textAlign', 'textColor', 'backgroundColor'],
      quickControlActions: ['variant', 'size', 'link']
    });

    // Form Field Element
    this.register({
      type: 'form-field', // This is a custom type, might need mapping to schema elements
      displayName: 'Form Field',
      defaultProperties: {
        label: 'Field Label',
        placeholder: 'Enter value...',
        value: '',
        required: false,
        fieldType: 'text', // Default fieldType
        options: [], // For select fields
      },
      editableProperties: ['label', 'placeholder', 'value', 'required', 'fieldType', 'options'],
      quickControlActions: ['type', 'required', 'options']
    });

    // Text Group Element (This is like schema's 'Group' but with specific text element children)
    // For this refactor, its defaultProperties would define its own characteristics,
    // not necessarily its children, as children are part of the Element's 'properties.elements' array if it's a group.
    // The current Element definition is flat. If 'text-group' is meant to contain other elements,
    // its 'properties' should have an 'elements' array, like: properties: { elements: Element[] }
    // This aligns with how the 'Group' element was defined in shared/schema.ts
    this.register({
      type: 'text-group',
      displayName: 'Text Group',
      defaultProperties: {
        // Example properties for a group itself
        layout: 'vertical', // 'horizontal' | 'vertical'
        gap: '8px',         // Gap between elements in the group
        elements: []        // Child elements would go here
      },
      // editableProperties for the group itself, not its children directly
      editableProperties: ['layout', 'gap'],
      quickControlActions: ['add-heading', 'add-paragraph'] // Actions to add children to properties.elements
    });
  }

  register(definition: ElementDefinition): void {
    this.definitions.set(definition.type, definition);
  }

  getDefinition(type: ElementType): ElementDefinition | undefined {
    const definition = this.definitions.get(type);
    if (!definition && type !== 'unknown') { // Prevent infinite loop for 'unknown'
        console.warn(`No definition found for element type "${type}", attempting to find 'unknown'.`);
        return this.definitions.get('unknown'); // Fallback to 'unknown' if defined
    }
    return definition;
  }

  getAllDefinitions(): ElementDefinition[] {
    return Array.from(this.definitions.values());
  }

  // Refactored createElement method
  createElement(type: ElementType, overrides?: { properties?: Record<string, any> }): Element | null {
    const definition = this.getDefinition(type);
    if (!definition) {
      console.error(`Element type "${type}" not found in registry, and no 'unknown' fallback defined.`);
      return null;
    }

    // Start with default properties from the definition
    const finalProperties = {
      ...(definition.defaultProperties || {}),
      ...(overrides?.properties || {})
    };

    return {
      id: uuidv4(), // Generates string UUID
      type: definition.type, // Use type from definition (could be 'unknown' if original type not found)
      properties: finalProperties,
    };
  }

  // Refactored createElementsFromTemplate method
  // Assumes templateItems provide properties directly compatible with Element.properties
  createElementsFromTemplate(templateItems: { type: ElementType; properties?: Record<string, any> }[]): Element[] {
    return templateItems.map(item =>
      this.createElement(item.type, { properties: item.properties })
    ).filter(element => element !== null) as Element[]; // Filter out nulls and cast
  }

  // Utility method to get element type from HTML tag (remains largely the same)
  getElementTypeFromTag(tagName: string): ElementType | null {
    const tagMapping: Record<string, ElementType> = {
      'h1': 'heading', 'h2': 'heading', 'h3': 'heading', 'h4': 'heading', 'h5': 'heading', 'h6': 'heading',
      'p': 'paragraph',
      'img': 'image',
      'button': 'button',
      'input': 'form-field', // Or map to more specific types if available
      'textarea': 'form-field', // Or map to 'paragraph' with rich text, or custom 'textarea' ElementType
      'select': 'form-field'  // Or custom 'select' ElementType
    };
    const elementType = tagMapping[tagName.toLowerCase()];
    if (!elementType) {
        console.warn(`No ElementType mapping for HTML tag: ${tagName}`);
        return 'unknown'; // Fallback to 'unknown'
    }
    return elementType;
  }
}

// Export singleton instance
export const elementRegistry = ElementRegistry.getInstance();