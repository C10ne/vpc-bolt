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
  const [localChanges, setLocalChanges] = useState<Partial<Element>>({});

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
  const mergedElement = { ...element, ...localChanges };

  const handleChange = (field: string, value: any) => {
    const updates = { ...localChanges };
    
    // Handle nested field updates
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      updates[parent as keyof Element] = {
        ...(mergedElement as any)[parent],
        [child]: value
      };
    } else {
      updates[field as keyof Element] = value;
    }
    
    setLocalChanges(updates);
    onUpdate?.(updates);
  };

  const handleContentChange = (field: string, value: any) => {
    handleChange('content', {
      ...mergedElement.content,
      [field]: value
    });
  };

  const handleStyleChange = (field: string, value: any) => {
    handleChange('style', {
      ...mergedElement.style,
      [field]: value
    });
  };

  const handlePropertiesChange = (field: string, value: any) => {
    handleChange('properties', {
      ...(mergedElement as any).properties,
      [field]: value
    });
  };

  const renderContentEditor = () => {
    switch (element.type) {
      case 'heading':
        return (
          <div className="space-y-3">
            <div>
              <Label htmlFor="heading-text">Text</Label>
              <Input
                id="heading-text"
                value={(mergedElement.content as any).text || ''}
                onChange={(e) => handleContentChange('text', e.target.value)}
                placeholder="Heading text"
              />
            </div>
            <div>
              <Label htmlFor="heading-level">Heading Level</Label>
              <Select
                value={(mergedElement.content as any).level || 'h2'}
                onValueChange={(value) => handleContentChange('level', value as HeadingLevel)}
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
                value={(mergedElement.content as any).text || ''}
                onChange={(e) => handleContentChange('text', e.target.value)}
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
                value={(mergedElement.content as any).src || ''}
                onChange={(e) => handleContentChange('src', e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <Label htmlFor="image-alt">Alt Text</Label>
              <Input
                id="image-alt"
                value={(mergedElement.content as any).alt || ''}
                onChange={(e) => handleContentChange('alt', e.target.value)}
                placeholder="Describe the image"
              />
            </div>
            <div>
              <Label htmlFor="image-caption">Caption</Label>
              <Input
                id="image-caption"
                value={(mergedElement.content as any)?.caption || ''}
                onChange={(e) => handleContentChange('caption', e.target.value)}
                placeholder="Image caption"
              />
            </div>
            <div>
              <Label htmlFor="object-fit">Object Fit</Label>
              <Select
                value={(mergedElement as any).properties?.objectFit || 'cover'}
                onValueChange={(value) => handlePropertiesChange('objectFit', value)}
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
                value={(mergedElement.content as any).text || ''}
                onChange={(e) => handleContentChange('text', e.target.value)}
                placeholder="Button text"
              />
            </div>
            <div>
              <Label htmlFor="button-href">Link URL</Label>
              <Input
                id="button-href"
                type="url"
                value={(mergedElement.content as any).href || ''}
                onChange={(e) => handleContentChange('href', e.target.value)}
                placeholder="https://example.com"
              />
            </div>
            <div>
              <Label htmlFor="button-variant">Style</Label>
              <Select
                value={(mergedElement as any).properties?.variant || 'primary'}
                onValueChange={(value) => handlePropertiesChange('variant', value)}
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
                value={(mergedElement as any).properties?.size || 'md'}
                onValueChange={(value) => handlePropertiesChange('size', value)}
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
                value={(mergedElement.content as any).label || ''}
                onChange={(e) => handleContentChange('label', e.target.value)}
                placeholder="Field label"
              />
            </div>
            <div>
              <Label htmlFor="field-placeholder">Placeholder</Label>
              <Input
                id="field-placeholder"
                value={(mergedElement.content as any).placeholder || ''}
                onChange={(e) => handleContentChange('placeholder', e.target.value)}
                placeholder="Placeholder text"
              />
            </div>
            <div>
              <Label htmlFor="field-type">Field Type</Label>
              <Select
                value={(mergedElement as any).properties?.fieldType || 'text'}
                onValueChange={(value) => handlePropertiesChange('fieldType', value as FormFieldType)}
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
                checked={(mergedElement.content as any).required || false}
                onCheckedChange={(checked) => handleContentChange('required', checked)}
              />
              <Label htmlFor="field-required">Required field</Label>
            </div>
          </div>
        );

      default:
        return (
          <p className="text-sm text-gray-500">
            No editor available for {element.type} elements.
          </p>
        );
    }
  };

  const renderStyleEditor = () => (
    <div className="space-y-3">
      <div>
        <Label htmlFor="text-color">Text Color</Label>
        <Input
          id="text-color"
          type="color"
          value={mergedElement.style?.textColor || '#000000'}
          onChange={(e) => handleStyleChange('textColor', e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="bg-color">Background Color</Label>
        <Input
          id="bg-color"
          type="color"
          value={mergedElement.style?.backgroundColor || '#ffffff'}
          onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="text-align">Text Alignment</Label>
        <Select
          value={mergedElement.style?.textAlign || 'left'}
          onValueChange={(value) => handleStyleChange('textAlign', value)}
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