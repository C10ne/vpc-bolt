import { useState } from "react";
import {
  Template as TemplateData,
  Section as SectionData,
  Component as ComponentData,
  Element as ElementData,
  ElementType
} from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
// Switch, Slider, ColorPicker might be used later or for specific element properties
// import { Switch } from "@/components/ui/switch";
// import { Slider } from "@/components/ui/slider";
// import { ColorPicker } from "@/components/ui/color-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


interface InspectorPanelProps {
  template: TemplateData;
  selectedElementId: string | null;
  onUpdateTemplate: (updatedTemplate: TemplateData) => void;
  showPanel: boolean;
  onTogglePanel: () => void;
}

export default function InspectorPanel({
  template,
  selectedElementId,
  onUpdateTemplate,
  showPanel,
  onTogglePanel,
}: InspectorPanelProps) {
  const [activeTab, setActiveTab] = useState("properties");

  const findSelectedElement = (): {
    elementType: "template" | "section" | "component" | "element" | null;
    element: TemplateData | SectionData | ComponentData | ElementData | null; // Aliased types
    section?: SectionData; // Aliased type
    component?: ComponentData; // Aliased type, NEW
    // sectionIndex and elementIndex are not strictly needed by the rest of the logic with new updateElement
  } => {
    if (!selectedElementId) {
      return { elementType: "template", element: template };
    }

    if (selectedElementId.startsWith("section-")) {
      const sectionId = parseInt(selectedElementId.replace("section-", ""));
      const section = template.sections.find((s) => s.id === sectionId);
      if (section) {
        return { elementType: "section", element: section, section };
      }
    }

    if (selectedElementId.startsWith("component-")) {
      const [, sectionIdStr, componentIdStr] = selectedElementId.split("-");
      const sectionId = parseInt(sectionIdStr);
      const componentId = parseInt(componentIdStr);
      const section = template.sections.find((s) => s.id === sectionId);
      if (section) {
        const component = section.components.find((c) => c.id === componentId);
        if (component) {
          return {
            elementType: "component",
            element: component,
            section,
            component, // Itself
          };
        }
      }
    }

    if (selectedElementId.startsWith("element-")) {
      const [, sectionIdStr, componentIdStr, elementIdStr] = selectedElementId.split("-");
      const sectionId = parseInt(sectionIdStr);
      const componentId = parseInt(componentIdStr);
      const elementId = parseInt(elementIdStr);
      const section = template.sections.find((s) => s.id === sectionId);
      if (section) {
        const component = section.components.find((c) => c.id === componentId);
        if (component) {
          const element = component.elements.find((e) => e.id === elementId);
          if (element) {
            return {
              elementType: "element",
              element,
              section,
              component, // Parent component of the element
            };
          }
        }
      }
    }
    return { elementType: null, element: null };
  };

  const {
    elementType: currentElementType,
    element: currentSelectedObject,
    section: parentSection,
    component: parentComponent
  } = findSelectedElement();


  const handleElementPropertyChange = (propertyName: string, value: any) => {
    // Re-fetch selected element data to ensure freshness, though for simple cases,
    // currentSelectedObject from InspectorPanel's scope might be okay.
    // Using currentSelectedObject for now as per instruction for simplicity.
    if (currentElementType === 'element' && currentSelectedObject) {
      const currentSchemaElement = currentSelectedObject as ElementData;
      const oldProperties = currentSchemaElement.properties || {};
      // Call updateElement with the new state of the element
      updateElement({
        ...currentSchemaElement,
        properties: {
          ...oldProperties,
          [propertyName]: value,
        },
      });
    }
  };

  const updateElement = (updatedData: any) => {
    if (!currentElementType) return;

    // Fetch fresh selection details, especially parent references for updates
    const {
      elementType,
      element: selectedObj, // Renamed to avoid conflict with updatedData
      section: parentSectionOfSelected,
      component: parentComponentOfSelected
    } = findSelectedElement();

    if (elementType === "template") {
      onUpdateTemplate({ ...template, ...updatedData });
      return;
    }

    if (elementType === "section" && parentSectionOfSelected) { // parentSectionOfSelected is the section itself here
      const updatedSection = updatedData as SectionData;
      const newSections = template.sections.map((s) =>
        s.id === updatedSection.id ? updatedSection : s
      );
      onUpdateTemplate({ ...template, sections: newSections });
      return;
    }

    if (elementType === "component" && parentSectionOfSelected) {
      const updatedComponent = updatedData as ComponentData;
      const newSections = template.sections.map(s => {
        if (s.id === parentSectionOfSelected.id) {
          return {
            ...s,
            components: s.components.map(c => c.id === updatedComponent.id ? updatedComponent : c)
          };
        }
        return s;
      });
      onUpdateTemplate({ ...template, sections: newSections });
      return;
    }

    if (elementType === "element" && parentComponentOfSelected && parentSectionOfSelected) {
      const updatedElement = updatedData as ElementData;
      const newSections = template.sections.map(s => {
        if (s.id === parentSectionOfSelected.id) {
          return {
            ...s,
            components: s.components.map(c => {
              if (c.id === parentComponentOfSelected.id) {
                return {
                  ...c,
                  elements: c.elements.map(el => el.id === updatedElement.id ? updatedElement : el)
                };
              }
              return c;
            })
          };
        }
        return s;
      });
      onUpdateTemplate({ ...template, sections: newSections });
      return;
    }
  };

  const renderElementProperties = () => {
    // Use the values from the top-level findSelectedElement call for rendering
    // currentSelectedObject, currentElementType are already available from component scope

    if (!currentSelectedObject) {
      return (
        <div className="text-center p-4 text-gray-500">
          Select an element to edit its properties
        </div>
      );
    }

    if (currentElementType === "template") {
      const currentTemplate = currentSelectedObject as TemplateData;
      return (
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Template Name</Label>
            <Input
              value={currentTemplate.name}
              onChange={(e) => updateElement({ ...currentTemplate, name: e.target.value })}
              className="w-full mt-1"
            />
          </div>
          <div>
            <Label className="text-sm font-medium">Title</Label>
            <Input
              value={currentTemplate.title}
              onChange={(e) => updateElement({ ...currentTemplate, title: e.target.value })}
              className="w-full mt-1"
            />
          </div>
          {/* Add more template properties here, e.g., colors, logoUrl from original */}
        </div>
      );
    }

    if (currentElementType === "section" && currentSelectedObject) {
      const currentSection = currentSelectedObject as SectionData;
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold">
              Section: {currentSection.name} (ID: {currentSection.id})
            </h3>
            <Badge variant={currentSection.editable === "locked-edit" ? "destructive" : "default"}>
              {currentSection.editable}
            </Badge>
          </div>
          <div>
            <Label className="text-sm font-medium">Name</Label>
            <Input
              value={currentSection.name}
              onChange={(e) => updateElement({ ...currentSection, name: e.target.value })}
              className="w-full mt-1"
              disabled={currentSection.editable === "locked-edit"}
            />
          </div>
          {/* Add more section properties like background, spacing from original, if needed */}
           <div>
            <Label className="text-sm font-medium">Spacing Top (px)</Label>
            <Input
              type="number"
              value={currentSection.spacing?.top || 0}
              onChange={(e) => updateElement({ ...currentSection, spacing: { ...currentSection.spacing, top: parseInt(e.target.value) }})}
              className="w-full mt-1"
            />
          </div>
          <div>
            <Label className="text-sm font-medium">Spacing Bottom (px)</Label>
            <Input
              type="number"
              value={currentSection.spacing?.bottom || 0}
              onChange={(e) => updateElement({ ...currentSection, spacing: { ...currentSection.spacing, bottom: parseInt(e.target.value) }})}
              className="w-full mt-1"
            />
          </div>
        </div>
      );
    }

    if (currentElementType === "element" && currentSelectedObject) {
      const currentElementTyped = currentSelectedObject as ElementData;
      const currentProps = currentElementTyped.properties || {};

      return (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">
            Element: {currentElementTyped.type} (ID: {currentElementTyped.id})
          </h3>
          {(() => {
            switch (currentElementTyped.type) {
              case 'Heading':
                return (
                  <>
                    <div>
                      <Label htmlFor={`element-text-${currentElementTyped.id}`}>Text</Label>
                      <Input
                        id={`element-text-${currentElementTyped.id}`}
                        value={currentProps.text || ''}
                        onChange={(e) => handleElementPropertyChange('text', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`element-level-${currentElementTyped.id}`}>Level</Label>
                      <Select
                        value={currentProps.level || 'h2'}
                        onValueChange={(value) => handleElementPropertyChange('level', value)}
                      >
                        <SelectTrigger id={`element-level-${currentElementTyped.id}`}>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="h1">H1</SelectItem>
                          <SelectItem value="h2">H2</SelectItem>
                          <SelectItem value="h3">H3</SelectItem>
                          <SelectItem value="h4">H4</SelectItem>
                          <SelectItem value="h5">H5</SelectItem>
                          <SelectItem value="h6">H6</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                );
              case 'Paragraph':
                return (
                  <div>
                    <Label htmlFor={`element-text-${currentElementTyped.id}`}>Text</Label>
                    <Textarea
                      id={`element-text-${currentElementTyped.id}`}
                      value={currentProps.text || ''} // Assuming 'text' for paragraph, schema said htmlContent for p
                      onChange={(e) => handleElementPropertyChange('text', e.target.value)}
                    />
                  </div>
                );
              case 'Image':
                return (
                  <>
                    <div>
                      <Label htmlFor={`element-src-${currentElementTyped.id}`}>Source URL</Label>
                      <Input
                        id={`element-src-${currentElementTyped.id}`}
                        value={currentProps.src || ''}
                        onChange={(e) => handleElementPropertyChange('src', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`element-alt-${currentElementTyped.id}`}>Alt Text</Label>
                      <Input
                        id={`element-alt-${currentElementTyped.id}`}
                        value={currentProps.alt || ''}
                        onChange={(e) => handleElementPropertyChange('alt', e.target.value)}
                      />
                    </div>
                  </>
                );
              case 'Button':
                return (
                  <>
                    <div>
                      <Label htmlFor={`element-text-${currentElementTyped.id}`}>Button Text</Label>
                      <Input
                        id={`element-text-${currentElementTyped.id}`}
                        value={currentProps.text || ''}
                        onChange={(e) => handleElementPropertyChange('text', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`element-actionUrl-${currentElementTyped.id}`}>Action URL</Label>
                      <Input
                        id={`element-actionUrl-${currentElementTyped.id}`}
                        value={currentProps.actionUrl || ''}
                        onChange={(e) => handleElementPropertyChange('actionUrl', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`element-style-${currentElementTyped.id}`}>Style</Label>
                      <Select
                        value={currentProps.style || 'default'}
                        onValueChange={(value) => handleElementPropertyChange('style', value)}
                      >
                        <SelectTrigger id={`element-style-${currentElementTyped.id}`}>
                          <SelectValue placeholder="Select style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">Default</SelectItem>
                          <SelectItem value="primary">Primary</SelectItem>
                          <SelectItem value="outline">Outline</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                );
              case 'Group': {
                const groupProps = currentProps as { elements?: ElementData[]; layout?: 'horizontal' | 'vertical'; gap?: string | number };
                return (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`group-layout-${currentElementTyped.id}`}>Layout</Label>
                      <Select
                        value={groupProps.layout || 'vertical'}
                        onValueChange={(value) => handleElementPropertyChange('layout', value as 'horizontal' | 'vertical')}
                      >
                        <SelectTrigger id={`group-layout-${currentElementTyped.id}`} className="w-full mt-1">
                          <SelectValue placeholder="Select layout" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vertical">Vertical</SelectItem>
                          <SelectItem value="horizontal">Horizontal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor={`group-gap-${currentElementTyped.id}`}>Gap (e.g., 8px, 1rem)</Label>
                      <Input
                        id={`group-gap-${currentElementTyped.id}`}
                        type="text"
                        value={groupProps.gap || '0px'}
                        onChange={(e) => handleElementPropertyChange('gap', e.target.value)}
                        placeholder="e.g., 8px, 0.5rem"
                        className="w-full mt-1"
                      />
                    </div>
                    <div>
                      <Label>Child Elements</Label>
                      <div className="text-sm text-gray-600 border p-2 rounded-md min-h-[50px] bg-gray-50 mt-1 max-h-40 overflow-y-auto">
                        {groupProps.elements && groupProps.elements.length > 0
                          ? groupProps.elements.map(el => (
                              <div key={el.id} className="p-1 border-b last:border-b-0 text-xs">
                                <strong>{el.type}</strong> (ID: {el.id})
                              </div>
                            ))
                          : <p className="text-xs italic">This group is currently empty.</p>}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Select child elements directly in the editor to modify them.</p>
                    </div>
                  </div>
                );
              }
              case 'RichText': {
                const richTextProps = currentProps as { htmlContent?: string };
                return (
                  <div className="space-y-2"> {/* Changed space-y-4 to space-y-2 for compactness */}
                    <Label htmlFor={`richtext-htmlcontent-${currentElementTyped.id}`}>HTML Content</Label>
                    <Textarea
                      id={`richtext-htmlcontent-${currentElementTyped.id}`}
                      value={richTextProps.htmlContent || ''}
                      onChange={(e) => handleElementPropertyChange('htmlContent', e.target.value)}
                      placeholder="<p>Enter <b>HTML</b> content here...</p>"
                      className="w-full font-mono text-xs mt-1" // Monospace for HTML editing
                      rows={8} // Decent number of rows for HTML
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Note: You are editing raw HTML. A WYSIWYG editor will be implemented later.
                    </p>
                  </div>
                );
              }
              default:
                return <p>Unsupported element type: {currentElementTyped.type}</p>;
            }
          })()}
        </div>
      );
    }

    if (currentElementType === "component" && currentSelectedObject) {
      const currentComponentTyped = currentSelectedObject as ComponentData;
      return (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">
            Component: {currentComponentTyped.type} (ID: {currentComponentTyped.id})
          </h3>
          <div>
            <Label>Editable Status:</Label>
            <Badge variant={currentComponentTyped.editable === "locked-edit" ? "destructive" : "default"} className="ml-2">
              {currentComponentTyped.editable}
            </Badge>
          </div>
          {currentComponentTyped.parameters && (
            <div>
              <Label>Parameters:</Label>
              <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
                {JSON.stringify(currentComponentTyped.parameters, null, 2)}
              </pre>
            </div>
          )}
          {currentComponentTyped.swappableWith && currentComponentTyped.swappableWith.length > 0 && (
            <div>
              <Label>Swappable With:</Label>
              <ul className="list-disc list-inside text-sm">
                {currentComponentTyped.swappableWith.map(type => <li key={type}>{type}</li>)}
              </ul>
            </div>
          )}
          <p className="text-xs text-gray-500 pt-2">
            Select individual elements within this component on the canvas to edit their specific properties.
          </p>
        </div>
      );
    }

    return (
      <div className="text-center p-4 text-gray-500">
        Select an element to edit its properties (or no properties available for this type).
      </div>
    );
  };

  return (
    <div
      className={cn(
        "w-80 bg-white border-l border-gray-200 flex-shrink-0 overflow-y-auto transition-all duration-300 ease-in-out h-full",
        showPanel ? "translate-x-0" : "translate-x-full md:translate-x-0 md:w-12" // Adjusted for persistent icon bar
      )}
    >
      <div className="p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
        <h2
          className={cn(
            "font-medium text-gray-800",
            showPanel ? "block" : "hidden md:block md:sr-only"
          )}
        >
          Inspector
        </h2>
        <button
          className="text-gray-500 hover:text-gray-700"
          onClick={onTogglePanel}
        >
          {/* Icon changes based on panel state */}
          {showPanel ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>

      <div className={cn(showPanel ? "block" : "hidden md:block")}>
        <Tabs
          defaultValue="properties"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 sticky top-[57px] bg-white z-[9]"> {/* Adjust top value based on header height */}
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="styles">Styles</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="properties" className="p-4">
            {renderElementProperties()}
          </TabsContent>
          <TabsContent value="styles" className="p-4">
            <div className="text-center p-4 text-gray-500">
              Style options will appear here. (Not implemented yet)
            </div>
          </TabsContent>
          <TabsContent value="settings" className="p-4">
            <div className="text-center p-4 text-gray-500">
              Advanced settings will appear here. (Not implemented yet)
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
