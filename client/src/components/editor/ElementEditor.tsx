import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, Settings } from 'lucide-react';
import type { Element, ElementType, HeadingLevel, FormFieldType } from '@/lib/elements/types';
import { elementRegistry } from '@/lib/elements';

interface ElementEditorProps {
  element: Element | null;
  onUpdate?: (updates: Partial<Element>) => void;
  onDelete?: () => void;
  onClose?: () => void;
}

export default function ElementEditor({
  element,
  onUpdate,
  onDelete,
  onClose
}: ElementEditorProps) {
  // Local changes state removed for now, assuming parent will manage state via onUpdate
  // const [localChanges, setLocalChanges] = useState<Partial<Element>>({});

  if (!element) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">No Element Selected</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            Select an element on the canvas to edit its properties.
          </p>
        </CardContent>
      </Card>
    );
  }

  const definition = elementRegistry.getDefinition(element.type);
  // Use element directly as mergedElement, as localChanges is removed.
  // Parent (InspectorPanel) will manage the state and pass updated element.
  const mergedElement = element;

  const handlePropertyChange = (propertyName: string, value: any) => {
    const newProperties = {
      ...mergedElement.properties,
      [propertyName]: value,
    };
    // Call onUpdate with the new complete properties object
    // The onUpdate signature is Partial<Element>, so we send { properties: newProperties }
    onUpdate?.({ properties: newProperties });
  };

  // renderContentEditor and renderStyleEditor will now use mergedElement.properties directly
  // and call handlePropertyChange.

  const renderContentEditor = () => {
    // Ensure element.properties exists, defaulting to empty object if not
    const props = mergedElement.properties || {};

    switch (element.type) {
      case 'heading':
        return (
          <div className="space-y-3">
            <div>
              <Label htmlFor="heading-text">Text</Label>
              <Input
                id="heading-text"
                value={props.text || ''}
                onChange={(e) => handlePropertyChange('text', e.target.value)}
                placeholder="Heading text"
              />
            </div>
            <div>
              <Label htmlFor="heading-level">Heading Level</Label>
              <Select
                value={props.level || 'h2'}
                onValueChange={(value) => handlePropertyChange('level', value as HeadingLevel)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="h1">H1 - Main Title</SelectItem>
                  <SelectItem value="h2">H2 - Section Title</SelectItem>
                  <SelectItem value="h3">H3 - Subsection</SelectItem>
                  <SelectItem value="h4">H4 - Small Heading</SelectItem>
                  <SelectItem value="h5">H5 - Minor Heading</SelectItem>
                  <SelectItem value="h6">H6 - Smallest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'paragraph':
        return (
          <div className="space-y-3">
            <div>
              <Label htmlFor="paragraph-text">Text</Label>
              <Textarea
                id="paragraph-text"
                value={props.text || ''}
                onChange={(e) => handlePropertyChange('text', e.target.value)}
                placeholder="Paragraph text"
                rows={4}
              />
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="space-y-3">
            <div>
              <Label htmlFor="image-src">Image URL</Label>
              <Input
                id="image-src"
                type="url"
                value={props.src || ''}
                onChange={(e) => handlePropertyChange('src', e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <Label htmlFor="image-alt">Alt Text</Label>
              <Input
                id="image-alt"
                value={props.alt || ''}
                onChange={(e) => handlePropertyChange('alt', e.target.value)}
                placeholder="Describe the image"
              />
            </div>
            <div>
              <Label htmlFor="image-caption">Caption</Label>
              <Input
                id="image-caption"
                value={props.caption || ''}
                onChange={(e) => handlePropertyChange('caption', e.target.value)}
                placeholder="Image caption"
              />
            </div>
            <div>
              <Label htmlFor="object-fit">Object Fit</Label>
              <Select
                value={props.objectFit || 'cover'}
                onValueChange={(value) => handlePropertyChange('objectFit', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cover">Cover</SelectItem>
                  <SelectItem value="contain">Contain</SelectItem>
                  <SelectItem value="fill">Fill</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'button':
        return (
          <div className="space-y-3">
            <div>
              <Label htmlFor="button-text">Button Text</Label>
              <Input
                id="button-text"
                value={props.text || ''}
                onChange={(e) => handlePropertyChange('text', e.target.value)}
                placeholder="Button text"
              />
            </div>
            <div>
              <Label htmlFor="button-href">Link URL</Label>
              <Input
                id="button-href"
                type="url"
                value={props.href || ''}
                onChange={(e) => handlePropertyChange('href', e.target.value)}
                placeholder="https://example.com"
              />
            </div>
            <div>
              <Label htmlFor="button-variant">Style</Label>
              <Select
                value={props.variant || 'primary'}
                onValueChange={(value) => handlePropertyChange('variant', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">Primary</SelectItem>
                  <SelectItem value="secondary">Secondary</SelectItem>
                  <SelectItem value="outline">Outline</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="button-size">Size</Label>
              <Select
                value={props.size || 'md'}
                onValueChange={(value) => handlePropertyChange('size', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sm">Small</SelectItem>
                  <SelectItem value="md">Medium</SelectItem>
                  <SelectItem value="lg">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'form-field':
        return (
          <div className="space-y-3">
            <div>
              <Label htmlFor="field-label">Label</Label>
              <Input
                id="field-label"
                value={props.label || ''}
                onChange={(e) => handlePropertyChange('label', e.target.value)}
                placeholder="Field label"
              />
            </div>
            <div>
              <Label htmlFor="field-placeholder">Placeholder</Label>
              <Input
                id="field-placeholder"
                value={props.placeholder || ''}
                onChange={(e) => handlePropertyChange('placeholder', e.target.value)}
                placeholder="Placeholder text"
              />
            </div>
            <div>
              <Label htmlFor="field-type">Field Type</Label>
              <Select
                value={props.fieldType || 'text'}
                onValueChange={(value) => handlePropertyChange('fieldType', value as FormFieldType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="textarea">Textarea</SelectItem>
                  <SelectItem value="select">Select</SelectItem>
                  <SelectItem value="checkbox">Checkbox</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="field-required"
                checked={props.required || false}
                onCheckedChange={(checked) => handlePropertyChange('required', checked)}
              />
              <Label htmlFor="field-required">Required field</Label>
            </div>
          </div>
        );

      default:
        // Attempt to render based on definition.editableProperties if available
        if (definition?.editableProperties) {
          return (
            <div className="space-y-3">
              {definition.editableProperties.map(propName => (
                <div key={propName}>
                  <Label htmlFor={`prop-${propName}`}>{propName.charAt(0).toUpperCase() + propName.slice(1)}</Label>
                  <Input
                    id={`prop-${propName}`}
                    value={props[propName] || ''}
                    onChange={(e) => handlePropertyChange(propName, e.target.value)}
                    placeholder={`Enter ${propName}`}
                  />
                </div>
              ))}
            </div>
          );
        }
        return (
          <p className="text-sm text-gray-500">
            No specific editor for {element.type} elements. Generic editor based on definition used if available.
          </p>
        );
    }
  };

  const renderStyleEditor = () => {
    // Example style properties that might be in element.properties
    const props = mergedElement.properties || {};
    // This section can be expanded or made dynamic using definition.editableProperties if some are style-specific
    return (
      <div className="space-y-3">
        <div>
          <Label htmlFor="text-color">Text Color</Label>
          <Input
            id="text-color"
            type="color" // Using input type color for simplicity, can be enhanced
            value={props.textColor || '#000000'}
            onChange={(e) => handlePropertyChange('textColor', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="bg-color">Background Color</Label>
          <Input
            id="bg-color"
            type="color"
            value={props.backgroundColor || '#ffffff'}
            onChange={(e) => handlePropertyChange('backgroundColor', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="text-align">Text Alignment</Label>
          <Select
            value={props.textAlign || 'left'}
            onValueChange={(value) => handlePropertyChange('textAlign', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Left</SelectItem>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="right">Right</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* Add more common style properties here, e.g., padding, margin, fontSize, fontWeight */}
        <div>
          <Label htmlFor="padding">Padding (e.g., 10px, 5px 10px)</Label>
          <Input
            id="padding"
            value={props.padding || ''}
            onChange={(e) => handlePropertyChange('padding', e.target.value)}
            placeholder="e.g., 10px or 5px 10px"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Element Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm flex items-center gap-2">
                {definition?.displayName || element.type}
                <Badge variant={element.properties?.locked ? 'destructive' : 'secondary'} className="text-xs">
                  {element.properties?.locked ? 'Locked' : 'Editable'}
                </Badge>
              </CardTitle>
              <p className="text-xs text-gray-500">Element ID: {element.id.slice(0, 8)}...</p>
            </div>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handlePropertyChange('locked', !element.properties?.locked)}
                title={element.properties?.locked ? 'Unlock element' : 'Lock element'}
              >
                <Settings className="w-3 h-3" />
              </Button>
              {onDelete && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={onDelete}
                  title="Delete element"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Content Editor */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Properties</CardTitle> {/* Changed from Content to Properties */}
        </CardHeader>
        <CardContent>
          {element.properties?.locked ? (
            <p className="text-sm text-gray-500">
              This element is locked and cannot be edited.
            </p>
          ) : (
            renderContentEditor() // This now renders all property editors based on type or definition
          )}
        </CardContent>
      </Card>

      {/* Style Editor - This could be merged into Properties or made dynamic */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Styling (from Properties)</CardTitle>
        </CardHeader>
        <CardContent>
          {element.properties?.locked ? (
            <p className="text-sm text-gray-500">
              This element is locked and cannot be styled.
            </p>
          ) : (
            renderStyleEditor() // This renders common style properties from element.properties
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      {definition?.quickControlActions && !element.properties?.locked && (
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="right">Right</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Element Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm flex items-center gap-2">
                {definition?.displayName || element.type}
                <Badge variant={element.locked ? 'destructive' : 'secondary'} className="text-xs">
                  {element.locked ? 'Locked' : 'Editable'}
                </Badge>
              </CardTitle>
              <p className="text-xs text-gray-500">Element ID: {element.id.slice(0, 8)}...</p>
            </div>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleChange('locked', !element.locked)}
                title={element.locked ? 'Unlock element' : 'Lock element'}
              >
                <Settings className="w-3 h-3" />
              </Button>
              {onDelete && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={onDelete}
                  title="Delete element"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Content Editor */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Content</CardTitle>
        </CardHeader>
        <CardContent>
          {element.locked ? (
            <p className="text-sm text-gray-500">
              This element is locked and cannot be edited.
            </p>
          ) : (
            renderContentEditor()
          )}
        </CardContent>
      </Card>

      {/* Style Editor */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Styling</CardTitle>
        </CardHeader>
        <CardContent>
          {element.locked ? (
            <p className="text-sm text-gray-500">
              This element is locked and cannot be styled.
            </p>
          ) : (
            renderStyleEditor()
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      {definition?.quickControlActions && !element.locked && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {definition.quickControlActions.map((action) => (
                <Badge
                  key={action}
                  variant="outline"
                  className="cursor-pointer hover:bg-gray-100"
                >
                  {action}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}