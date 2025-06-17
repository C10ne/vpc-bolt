import React, { useState, useRef } from "react";
import {
  Template as TemplateData,
  Section as SectionData,
  Component as ComponentData,
  Element as ElementData,
  ElementType,
  ComponentType,
  EditableType
} from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { componentDefinitions } from "@/lib/components/definitions";
import { v4 as uuidv4 } from 'uuid'; // Import uuid

// Changed generateId to return string UUID for local default element creation (e.g. in component swap)
const generateId = (): string => uuidv4();

interface InspectorPanelProps {
  template: TemplateData;
  selectedElementId: string | null; // This is the prefixed ID, e.g., "section-uuid"
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
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const {
    elementType: currentElementType,
    element: currentSelectedObject,
    section: parentSectionOfSelected,
    component: parentComponentOfSelected
  } = findSelectedElement();

  function findSelectedElement(): {
    elementType: "template" | "section" | "component" | "element" | null;
    element: TemplateData | SectionData | ComponentData | ElementData | null;
    section?: SectionData;
    component?: ComponentData;
  } {
    if (!selectedElementId) {
      return { elementType: "template", element: template };
    }
    if (selectedElementId.startsWith("section-")) {
      const sectionId = selectedElementId.replace("section-", ""); // ID is now string
      const section = template.sections.find((s) => s.id === sectionId); // String comparison
      return { elementType: "section", element: section || null, section };
    }
    if (selectedElementId.startsWith("component-")) {
      const [, sectionId, componentId] = selectedElementId.split("-"); // IDs are strings
      const section = template.sections.find((s) => s.id === sectionId); // String comparison
      if (section) {
        const component = section.components.find((c) => c.id === componentId); // String comparison
        return { elementType: "component", element: component || null, section, component };
      }
    }
    if (selectedElementId.startsWith("element-")) {
      const [, sectionId, componentId, elementId] = selectedElementId.split("-"); // IDs are strings
      const section = template.sections.find((s) => s.id === sectionId); // String comparison
      if (section) {
        const component = section.components.find((c) => c.id === componentId); // String comparison
        if (component) {
          const element = component.elements.find((e) => e.id === elementId); // String comparison
          return { elementType: "element", element: element || null, section, component };
        }
      }
    }
    return { elementType: null, element: null, section: undefined, component: undefined };
  }

  const handleElementPropertyChange = (propertyName: string, value: any) => {
    if (currentElementType === 'element' && currentSelectedObject) {
      const currentSchemaElement = currentSelectedObject as ElementData;
      const oldProperties = currentSchemaElement.properties || {};
      updateElement({
        ...currentSchemaElement,
        properties: { ...oldProperties, [propertyName]: value },
      });
    }
  };

  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleElementPropertyChange('src', reader.result as string);
      };
      reader.readAsDataURL(file);
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const handleComponentSwap = (targetComponentType: ComponentType) => {
    const {
      element: currentSelectedComponentObj,
      section: parentSectionForSwap
    } = findSelectedElement();

    if (currentElementType !== 'component' || !currentSelectedComponentObj || !parentSectionForSwap) {
      console.warn("Swap conditions not met.");
      return;
    }
    const currentSelectedComponent = currentSelectedComponentObj as ComponentData;
    if (currentSelectedComponent.type === targetComponentType) return;

    const definition = componentDefinitions.find(def => def.type === targetComponentType);
    let newElements: ElementData[] = [];
    let newParameters: Record<string, any> = {};

    if (definition) {
      // newId() now returns string UUIDs
      newElements = definition.defaultElements.map(el => ({ ...el, id: generateId() }));
      newParameters = { ...(definition.defaultParameters || {}) };
    }

    const swappedComponentData: ComponentData = {
      ...currentSelectedComponent,
      type: targetComponentType,
      elements: newElements,
      parameters: newParameters,
      swappableWith: currentSelectedComponent.swappableWith,
    };
    updateElement(swappedComponentData);
  };

  const updateElement = (updatedData: any) => {
    const {
      elementType: freshElementType,
      element: freshSelectedObj,
      section: freshParentSection,
      component: freshParentComponent
    } = findSelectedElement();

    if (!freshElementType || !freshSelectedObj) return;

    // All ID comparisons are now string to string
    if (freshElementType === "template") {
      onUpdateTemplate({ ...template, ...updatedData });
    } else if (freshElementType === "section" && freshParentSection) {
      const updatedSection = updatedData as SectionData;
      onUpdateTemplate({
        ...template,
        sections: template.sections.map(s => s.id === updatedSection.id ? updatedSection : s),
      });
    } else if (freshElementType === "component" && freshParentSection) {
      const updatedComponent = updatedData as ComponentData;
      onUpdateTemplate({
        ...template,
        sections: template.sections.map(s =>
          s.id === freshParentSection.id ?
          { ...s, components: s.components.map(c => c.id === updatedComponent.id ? updatedComponent : c) } :
          s
        ),
      });
    } else if (freshElementType === "element" && freshParentComponent && freshParentSection) {
      const updatedElement = updatedData as ElementData;
      onUpdateTemplate({
        ...template,
        sections: template.sections.map(s =>
          s.id === freshParentSection.id ?
          { ...s, components: s.components.map(c =>
              c.id === freshParentComponent.id ?
              { ...c, elements: c.elements.map(el => el.id === updatedElement.id ? updatedElement : el) } :
              c
            )} :
          s
        ),
      });
    }
  };

  const renderElementProperties = () => {
    // ... (rest of renderElementProperties - no changes to its internal logic needed due to ID type change,
    // as comparisons are on `currentSelectedObject.id` which is now string, and IDs in UI are for display/keys)
    // The existing JSX for displaying IDs will just display the string UUIDs.
    // All IDs passed to Label htmlFor or Input id should be strings, which they are.
    if (!currentSelectedObject) {
      return <div className="text-center p-4 text-gray-500">Select an element to edit its properties</div>;
    }

    if (currentElementType === "template") {
      const currentTemplate = currentSelectedObject as TemplateData;
      return (
        <div className="space-y-4 p-1">
          <h3 className="text-sm font-semibold">Template Properties</h3>
          <div><Label htmlFor="template-name">Name</Label><Input id="template-name" value={currentTemplate.name} onChange={e => updateElement({...currentTemplate, name: e.target.value})} /></div>
          <div><Label htmlFor="template-title">Title</Label><Input id="template-title" value={currentTemplate.title} onChange={e => updateElement({...currentTemplate, title: e.target.value})} /></div>
        </div>
      );
    }

    if (currentElementType === "section" && currentSelectedObject) {
      const currentSection = currentSelectedObject as SectionData;
      const isSectionContentLocked = currentSection.editable === 'locked-edit';
      return (
         <div className="space-y-3 p-1">
          <h3 className="text-sm font-semibold">Section: {currentSection.name} (ID: {currentSection.id})</h3>
          <div><Label>Editable Status: <Badge variant={isSectionContentLocked ? "destructive" : "default"}>{currentSection.editable}</Badge></Label></div>
          <div>
            <Label htmlFor={`section-name-${currentSection.id}`}>Name</Label>
            <Input id={`section-name-${currentSection.id}`} value={currentSection.name} disabled={isSectionContentLocked} onChange={e => updateElement({...currentSection, name: e.target.value})} />
          </div>
          <div>
            <Label htmlFor={`section-spacing-top-${currentSection.id}`}>Spacing Top (px)</Label>
            <Input type="number" id={`section-spacing-top-${currentSection.id}`} value={currentSection.spacing?.top || 0} disabled={isSectionContentLocked} onChange={e => updateElement({...currentSection, spacing: {...currentSection.spacing, top: parseInt(e.target.value) || 0 }})}/>
          </div>
           <div>
            <Label htmlFor={`section-spacing-bottom-${currentSection.id}`}>Spacing Bottom (px)</Label>
            <Input type="number" id={`section-spacing-bottom-${currentSection.id}`} value={currentSection.spacing?.bottom || 0} disabled={isSectionContentLocked} onChange={e => updateElement({...currentSection, spacing: {...currentSection.spacing, bottom: parseInt(e.target.value) || 0 }})}/>
          </div>
        </div>
      );
    }

    if (currentElementType === "element" && currentSelectedObject) {
      const currentElementTyped = currentSelectedObject as ElementData;
      const currentProps = currentElementTyped.properties || {};
      const isElementContentLocked = parentComponentOfSelected?.editable === 'locked-edit';

      let elementSpecificUI;
      switch (currentElementTyped.type) {
        case 'Heading':
          elementSpecificUI = (
            <>
              <div><Label htmlFor={`el-text-${currentElementTyped.id}`}>Text</Label><Input id={`el-text-${currentElementTyped.id}`} value={currentProps.text || ''} disabled={isElementContentLocked} onChange={(e) => handleElementPropertyChange('text', e.target.value)}/></div>
              <div><Label htmlFor={`el-level-${currentElementTyped.id}`}>Level</Label><Select value={currentProps.level || 'h2'} disabled={isElementContentLocked} onValueChange={(v) => handleElementPropertyChange('level', v)}><SelectTrigger id={`el-level-${currentElementTyped.id}`}><SelectValue/></SelectTrigger><SelectContent><SelectItem value="h1">H1</SelectItem><SelectItem value="h2">H2</SelectItem><SelectItem value="h3">H3</SelectItem><SelectItem value="h4">H4</SelectItem><SelectItem value="h5">H5</SelectItem><SelectItem value="h6">H6</SelectItem></SelectContent></Select></div>
            </>
          ); break;
        case 'Paragraph':
          elementSpecificUI = (<div><Label htmlFor={`el-text-${currentElementTyped.id}`}>Text</Label><Textarea id={`el-text-${currentElementTyped.id}`} value={currentProps.text || ''} disabled={isElementContentLocked} onChange={(e) => handleElementPropertyChange('text', e.target.value)}/></div>);
          break;
        case 'Image': {
          const imageProps = currentProps as { src?: string; alt?: string };
          elementSpecificUI = (
            <div className="space-y-3">
              <div>
                <Label htmlFor={`image-src-input-${currentElementTyped.id}`}>Image URL (src)</Label>
                <Input id={`image-src-input-${currentElementTyped.id}`} type="text" value={imageProps.src || ''} onChange={(e) => handleElementPropertyChange('src', e.target.value)} placeholder="Enter image URL or upload" className="w-full mt-1" disabled={isElementContentLocked} />
              </div>
              <div>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageFileChange} className="hidden" disabled={isElementContentLocked} id={`image-file-input-${currentElementTyped.id}`} />
                <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="w-full mt-1" disabled={isElementContentLocked}>Upload/Choose Image</Button>
              </div>
              <div>
                <Label htmlFor={`image-alt-input-${currentElementTyped.id}`}>Alt Text</Label>
                <Input id={`image-alt-input-${currentElementTyped.id}`} type="text" value={imageProps.alt || ''} onChange={(e) => handleElementPropertyChange('alt', e.target.value)} placeholder="Enter alt text" className="w-full mt-1" disabled={isElementContentLocked} />
              </div>
              {imageProps.src && ( <div> <Label>Preview:</Label> <div className="mt-1 border rounded-md p-2 flex justify-center items-center bg-gray-50 max-h-48 overflow-hidden"> <img src={imageProps.src} alt={imageProps.alt || 'Preview'} className="max-w-full max-h-40 object-contain" /> </div> </div> )}
            </div>
          ); break;
        }
        case 'Button':
          elementSpecificUI = (
            <>
              <div><Label htmlFor={`el-text-${currentElementTyped.id}`}>Button Text</Label><Input id={`el-text-${currentElementTyped.id}`} value={currentProps.text || ''} disabled={isElementContentLocked} onChange={(e) => handleElementPropertyChange('text', e.target.value)}/></div>
              <div><Label htmlFor={`el-action-${currentElementTyped.id}`}>Action URL</Label><Input id={`el-action-${currentElementTyped.id}`} value={currentProps.actionUrl || ''} disabled={isElementContentLocked} onChange={(e) => handleElementPropertyChange('actionUrl', e.target.value)}/></div>
              <div><Label htmlFor={`el-style-${currentElementTyped.id}`}>Style</Label><Select value={currentProps.style || 'default'} disabled={isElementContentLocked} onValueChange={(v) => handleElementPropertyChange('style', v)}><SelectTrigger id={`el-style-${currentElementTyped.id}`}><SelectValue/></SelectTrigger><SelectContent><SelectItem value="default">Default</SelectItem><SelectItem value="primary">Primary</SelectItem><SelectItem value="outline">Outline</SelectItem></SelectContent></Select></div>
            </>
          ); break;
        case 'Group': {
          const groupProps = currentProps as { layout?: 'horizontal' | 'vertical'; gap?: string | number; elements?: ElementData[] };
          elementSpecificUI = (
            <>
              <div><Label htmlFor={`el-layout-${currentElementTyped.id}`}>Layout</Label><Select value={groupProps.layout || 'vertical'} disabled={isElementContentLocked} onValueChange={(v) => handleElementPropertyChange('layout', v as 'horizontal' | 'vertical')}><SelectTrigger id={`el-layout-${currentElementTyped.id}`}><SelectValue/></SelectTrigger><SelectContent><SelectItem value="vertical">Vertical</SelectItem><SelectItem value="horizontal">Horizontal</SelectItem></SelectContent></Select></div>
              <div><Label htmlFor={`el-gap-${currentElementTyped.id}`}>Gap</Label><Input id={`el-gap-${currentElementTyped.id}`} value={groupProps.gap || '0px'} disabled={isElementContentLocked} onChange={(e) => handleElementPropertyChange('gap', e.target.value)}/></div>
              <div><Label>Child Elements ({groupProps.elements?.length || 0})</Label><div className="text-xs text-gray-500 border p-1 rounded-md bg-gray-50 max-h-20 overflow-y-auto">{groupProps.elements?.map(el => <div key={el.id}>{el.type} (ID:{el.id})</div>) || "Empty"}</div></div>
            </>
          ); break;
        }
        case 'RichText': {
          elementSpecificUI = (
            <>
              <div><Label htmlFor={`el-html-${currentElementTyped.id}`}>HTML Content</Label><Textarea id={`el-html-${currentElementTyped.id}`} rows={8} className="font-mono text-xs" value={currentProps.htmlContent || ''} disabled={isElementContentLocked} onChange={(e) => handleElementPropertyChange('htmlContent', e.target.value)}/></div>
              <p className="text-xs text-gray-500">Raw HTML editing. WYSIWYG later.</p>
            </>
          ); break;
        }
        default:
          elementSpecificUI = <p>Unsupported element type: {currentElementTyped.type}</p>;
      }
      return (
        <div className="space-y-3 p-1">
          <h3 className="text-sm font-semibold">Element: {currentElementTyped.type} (ID: {currentElementTyped.id})</h3>
          {parentComponentOfSelected && <Label className="text-xs">Parent Comp Editable: <Badge variant={parentComponentOfSelected.editable === 'locked-edit' ? 'destructive' : 'default'}>{parentComponentOfSelected.editable}</Badge></Label>}
          {elementSpecificUI}
        </div>
      );
    }

    if (currentElementType === "component" && currentSelectedObject) {
      const currentComponent = currentSelectedObject as ComponentData;
      const isComponentContentLocked = currentComponent.editable === 'locked-edit';
      const isComponentLockedForReplaceBySelf = currentComponent.editable === 'locked-replacing';
      const isComponentLockedForReplaceByParent = parentSectionOfSelected?.editable === 'locked-replacing';
      const disableSwapUI = isComponentLockedForReplaceBySelf || isComponentLockedForReplaceByParent;

      const componentInfo = (
        <div className="space-y-3 p-1">
          <h3 className="text-sm font-semibold">Component: {currentComponent.type} (ID: {currentComponent.id})</h3>
          <div><Label>Editable Status: <Badge variant={isComponentContentLocked ? "destructive" : "default"}>{currentComponent.editable}</Badge></Label></div>
          {parentSectionOfSelected && <Label className="text-xs">Parent Section Editable: <Badge variant={parentSectionOfSelected.editable === 'locked-replacing' ? 'destructive' : 'default'}>{parentSectionOfSelected.editable}</Badge></Label>}
          {currentComponent.parameters && Object.keys(currentComponent.parameters).length > 0 && (
            <div><Label>Parameters:</Label><pre className="text-xs bg-gray-100 p-2 rounded mt-1 max-h-28 overflow-auto">{JSON.stringify(currentComponent.parameters, null, 2)}</pre></div>
          )}
          {(!currentComponent.parameters || Object.keys(currentComponent.parameters).length === 0) && <p className="text-xs text-gray-500">No parameters for this component.</p>}
          <p className="text-xs text-gray-500 pt-2">Select individual elements on the canvas to edit their properties.</p>
        </div>
      );

      if (currentComponent.swappableWith && currentComponent.swappableWith.length > 0) {
        return (
          <>
            {componentInfo}
            <div className="mt-4 pt-4 border-t">
              <Label htmlFor="component-swap-select" className="text-sm font-medium text-gray-700 block mb-1">Swap with another component:</Label>
              <Select onValueChange={(value) => { if (value) handleComponentSwap(value as ComponentType); }} disabled={disableSwapUI}>
                <SelectTrigger id="component-swap-select" className="w-full"><SelectValue placeholder="Select a component type..." /></SelectTrigger>
                <SelectContent>
                  {currentComponent.swappableWith.map(swapType => {
                    const def = componentDefinitions.find(d => d.type === swapType);
                    return (<SelectItem key={swapType} value={swapType} disabled={swapType === currentComponent.type}>{def ? def.name : swapType}{def && def.description && <span className="text-xs text-gray-500 ml-2 hidden md:inline">({def.description})</span>}</SelectItem>);
                  })}
                </SelectContent>
              </Select>
              {disableSwapUI && <p className="text-xs text-red-500 mt-1">Swapping is disabled.</p>}
            </div>
          </>
        );
      }
      return componentInfo;
    }
    return <div className="text-center p-4 text-gray-500">Select an item or no properties available.</div>;
  };

  return (
    <div className={cn("w-80 bg-white border-l border-gray-200 flex-shrink-0 overflow-y-auto transition-all duration-300 ease-in-out h-full", showPanel ? "translate-x-0" : "translate-x-full md:translate-x-0 md:w-12")}>
      <div className="p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
        <h2 className={cn("font-medium text-gray-800", showPanel ? "block" : "hidden md:block md:sr-only")}>Inspector</h2>
        <button className="text-gray-500 hover:text-gray-700" onClick={onTogglePanel}>
          {showPanel ? (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>) : (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>)}
        </button>
      </div>
      <div className={cn(showPanel ? "block" : "hidden md:block")}>
        <Tabs defaultValue="properties" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 sticky top-[57px] bg-white z-[9]">
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="styles">Styles</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="properties" className="p-4">{renderElementProperties()}</TabsContent>
          <TabsContent value="styles" className="p-4"><div className="text-center p-4 text-gray-500">Style options (Not implemented).</div></TabsContent>
          <TabsContent value="settings" className="p-4"><div className="text-center p-4 text-gray-500">Advanced settings (Not implemented).</div></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
