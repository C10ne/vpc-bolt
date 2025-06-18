# Element System Documentation

The Element system provides basic HTML building blocks that can be composed into Components, enabling granular editing and modular page construction.

## Architecture Overview

```
Template → Section → Component → Element (NEW)
```

The Element system introduces a new layer between Components and raw content, allowing for:
- Individual element selection and editing
- Floating quick controls for common actions  
- Type-safe element definitions
- Reusable HTML building blocks

## Element Types

### 1. HeadingElement
**Purpose**: HTML headings (h1-h6) with editable text and level selection.

```typescript
const heading = elementRegistry.createElement('heading', {
  content: {
    text: 'My Heading',
    level: 'h2'
  },
  style: {
    textAlign: 'center',
    textColor: '#1f2937'
  }
});
```

**Quick Controls**: H1, H2, H3, H4, H5, H6 level buttons
**Editable Properties**: text, level, styling

### 2. ParagraphElement  
**Purpose**: HTML paragraphs with rich text support (future WYSIWYG).

```typescript
const paragraph = elementRegistry.createElement('paragraph', {
  content: {
    text: 'This is paragraph text that can be edited in-place.',
    rich: false // Future: enable rich text editing
  }
});
```

**Quick Controls**: Edit, Format (future)
**Editable Properties**: text, styling

### 3. ImageElement
**Purpose**: Images with caption support and object-fit controls.

```typescript
const image = elementRegistry.createElement('image', {
  content: {
    src: 'https://example.com/image.jpg',
    alt: 'Description',
    caption: 'Image caption'
  },
  properties: {
    objectFit: 'cover',
    width: '100%'
  }
});
```

**Quick Controls**: URL input, Upload (future), Object fit selector
**Editable Properties**: src, alt, caption, object fit, dimensions

### 4. ButtonElement
**Purpose**: Interactive buttons with link support and style variants.

```typescript
const button = elementRegistry.createElement('button', {
  content: {
    text: 'Click me',
    href: 'https://example.com'
  },
  properties: {
    variant: 'primary',
    size: 'md'
  }
});
```

**Quick Controls**: Variant selector, Size selector, Link settings
**Editable Properties**: text, href, variant, size, styling

### 5. FormFieldElement
**Purpose**: Form inputs with validation and multiple field types.

```typescript
const formField = elementRegistry.createElement('form-field', {
  content: {
    label: 'Email Address',
    placeholder: 'you@example.com',
    required: true
  },
  properties: {
    fieldType: 'email'
  }
});
```

**Quick Controls**: Field type selector, Required toggle, Options editor
**Editable Properties**: label, placeholder, required, field type, options

### 6. TextGroupElement
**Purpose**: Container for multiple text elements (headings + paragraphs).

```typescript
const textGroup = elementRegistry.createElement('text-group', {
  content: {
    elements: [headingElement, paragraphElement]
  }
});
```

**Quick Controls**: Add heading, Add paragraph
**Editable Properties**: child elements

## Usage Examples

### Creating Element-Based Components

```typescript
import { elementRegistry, createElementBasedComponent } from '@/lib/elements';

// Create elements
const heading = elementRegistry.createElement('heading', {
  content: { text: 'Welcome', level: 'h1' }
});

const paragraph = elementRegistry.createElement('paragraph', {
  content: { text: 'This is a demo of the Element system.' }
});

const button = elementRegistry.createElement('button', {
  content: { text: 'Get Started', href: '/start' },
  properties: { variant: 'primary' }
});

// Create component using elements
const component = createElementBasedComponent('element-container', [
  heading, paragraph, button
], {
  replacingLocked: false,
  editingLocked: false
});
```

### Rendering Elements

```typescript
import { ElementRenderer } from '@/lib/elements';

function MyComponent({ elements, selectedElementId, onElementUpdate }) {
  return (
    <div>
      {elements.map((element) => (
        <ElementRenderer
          key={element.id}
          element={element}
          isSelected={selectedElementId === element.id}
          onUpdate={(updates) => onElementUpdate(element.id, updates)}
          onSelect={() => setSelectedElementId(element.id)}
          previewMode={false}
        />
      ))}
    </div>
  );
}
```

### Element Registry Usage

```typescript
import { elementRegistry } from '@/lib/elements';

// Get all available element types
const definitions = elementRegistry.getAllDefinitions();

// Get specific element definition
const headingDef = elementRegistry.getDefinition('heading');

// Create element with defaults
const newElement = elementRegistry.createElement('paragraph');

// Create multiple elements from template
const elements = elementRegistry.createElementsFromTemplate([
  { type: 'heading', content: { text: 'Title', level: 'h2' } },
  { type: 'paragraph', content: { text: 'Description' } },
  { type: 'button', content: { text: 'Action' } }
]);
```

## Integration with Existing System

### Component Detection
Use helper functions to determine if a component uses Elements:

```typescript
import { componentUsesElements, getElementsFromComponent } from '@/lib/types';

if (componentUsesElements(component)) {
  const elements = getElementsFromComponent(component);
  // Render using ElementRenderer
} else {
  // Render using legacy component system
}
```

### Editor Integration
The Element system integrates with the existing editor context:

```typescript
// In editorContext.tsx - add element selection
type EditorAction = 
  | { type: 'SELECT_ELEMENT'; payload: string | null }
  | { type: 'UPDATE_ELEMENT'; payload: { elementId: string; updates: Partial<Element> } }
  // ... existing actions

// In editor state
interface EditorState {
  selectedElement?: string | null;
  // ... existing state
}
```

## Quick Controls System

Each element type can define quick control actions that appear as floating buttons:

```typescript
// In ElementDefinition
{
  type: 'heading',
  quickControlActions: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
}

// In Element components
{isSelected && !previewMode && (
  <div className="absolute -top-8 left-0 z-10 flex space-x-1 bg-white shadow-sm border rounded p-1">
    {quickControlActions.map(action => (
      <button key={action} onClick={() => handleAction(action)}>
        {action}
      </button>
    ))}
  </div>
)}
```

## Styling System

Elements support granular styling through the `style` property:

```typescript
interface ElementStyle {
  textColor?: string;
  backgroundColor?: string;
  fontSize?: string;
  fontWeight?: string;
  textAlign?: 'left' | 'center' | 'right';
  padding?: string;
  margin?: string;
  [key: string]: any;
}
```

## Future Enhancements

1. **WYSIWYG Editing**: Rich text editing for paragraph elements
2. **Media Library**: Upload and manage images
3. **Element Drag & Drop**: Reorder elements within components
4. **Custom Elements**: User-defined element types
5. **Element Templates**: Pre-configured element combinations
6. **Animation Support**: CSS animations and transitions
7. **Responsive Styling**: Device-specific element styles

## Best Practices

1. **Element Granularity**: Keep elements focused on single HTML concepts
2. **Content vs Styling**: Separate content (editable) from presentation (styling)
3. **Lock System**: Use `locked` property to prevent accidental edits
4. **Type Safety**: Leverage TypeScript for element definitions
5. **Performance**: Use React.memo for element components in lists
6. **Accessibility**: Ensure proper ARIA attributes and semantic HTML

## Migration from Legacy Components

To migrate existing components to use Elements:

1. Identify the HTML structure in the legacy component
2. Break down into individual Element types
3. Create Element definitions using `elementRegistry.createElement`
4. Update component to use `ElementRenderer`
5. Add Element editing support to the sidebar
6. Test element selection and editing functionality