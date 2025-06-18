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
import { Trash2, ArrowUp, ArrowDown } from "lucide-react"; // For component actions
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
import { v4 as uuidv4 } from 'uuid';
import { useEditor, ElementPath } from "@/lib/editorContext";
import { componentDefinitions as editorComponentDefinitions } from "@/lib/components/definitions";
import { ComponentType as SchemaComponentType, ElementType as SchemaElementType } from "@shared/schema";
import ElementEditor from "./editor/ElementEditor";
import { Element as ClientElement, ElementType as ClientElementType } from "@/lib/elements/types";
import { elementRegistry } from "@/lib/elements/ElementRegistry";
import { Trash2, ArrowUp, ArrowDown, GripVertical } from "lucide-react"; // Added icons for element actions

const generateId = (): string => uuidv4();

interface InspectorPanelProps {
  // template: TemplateData; // Removed
  // selectedElementId: string | null; // Removed
  // onUpdateTemplate: (updatedTemplate: TemplateData) => void; // Removed
  showPanel: boolean;
  onTogglePanel: () => void;
}

export default function InspectorPanel({
  // template, // Removed
  // selectedElementId, // Removed
  // onUpdateTemplate, // Removed
  showPanel,
  onTogglePanel,
}: InspectorPanelProps) {
  const [activeTab, setActiveTab] = useState("properties");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Get state and actions from useEditor
  const {
    state: editorState,
    toggleUserLevel,
    updatePageProperties,
    updateSectionProperties,
    updateComponentProperties,
    updateElementProperties,
    replaceComponent,
    addComponentToSection,
    deleteComponentFromSection,
    reorderComponentInSection,
    addElementToComponent,
    deleteElementFromComponentPath,
    reorderElementInComponentPath,
    addSectionToPage,
    deleteSection, // Added for current task
    reorderSection // Added for current task
  } = useEditor();
  const { currentUserLevel, currentPage, currentFocusedElementId } = editorState;

  const {
    elementType: currentElementType,
    element: currentSelectedObject,
    section: parentSectionOfSelected,
    component: parentComponentOfSelected
  } = findSelectedElement();

  function findSelectedElement(): {
    elementType: "template" | "section" | "component" | "element" | null;
    element: TemplateData | SectionData | ComponentData | ElementData | null; // TemplateData might change to Page global settings
    section?: SectionData;
    component?: ComponentData;
  } {
    if (!currentFocusedElementId || !currentPage) {
      // If nothing is focused, or no page data, treat as template/page level.
      // The 'element' here could represent global page settings.
      // This part might need further refinement based on how global page settings are structured and edited.
      return { elementType: "template", element: currentPage as unknown as TemplateData }; // Cast for now
    }
    if (currentFocusedElementId.startsWith("section-")) {
      const sectionId = currentFocusedElementId.replace("section-", "");
      const section = currentPage.sections.find((s) => s.id === sectionId);
      return { elementType: "section", element: section as unknown as SectionData || null, section: section as unknown as SectionData };
    }
    if (currentFocusedElementId.startsWith("component-")) {
      const [, sectionId, componentId] = currentFocusedElementId.split("-");
      const section = currentPage.sections.find((s) => s.id === sectionId);
      if (section) {
        const component = section.components.find((c) => c.id === componentId);
        return { elementType: "component", element: component as unknown as ComponentData || null, section: section as unknown as SectionData, component: component as unknown as ComponentData };
      }
    }
    if (currentFocusedElementId.startsWith("element-")) {
      const [, sectionId, componentId, elementId] = currentFocusedElementId.split("-");
      const section = currentPage.sections.find((s) => s.id === sectionId);
      if (section) {
        const component = section.components.find((c) => c.id === componentId);
        if (component) {
          const element = component.elements.find((e) => e.id === elementId);
          return { elementType: "element", element: element as unknown as ElementData || null, section: section as unknown as SectionData, component: component as unknown as ComponentData };
        }
      }
    }
    return { elementType: null, element: null, section: undefined, component: undefined };
  }

  const handleElementPropertyChange = (propertyName: string, value: any) => {
    if (currentElementType === 'element' && currentSelectedObject && parentComponentOfSelected && parentSectionOfSelected) {
      const currentSchemaElement = currentSelectedObject as ElementData;
      const newProperties = { ...currentSchemaElement.properties, [propertyName]: value };
      if (updateElementProperties) {
        const path: ElementPath = {
          sectionId: parentSectionOfSelected.id,
          componentId: parentComponentOfSelected.id,
          elementId: currentSchemaElement.id,
        };
        updateElementProperties(path, newProperties);
      }
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

    // replaceComponent is already available from context. It might need adjustment
    // if its signature or behavior is different from what's expected here.
    // For now, assuming it can be called directly or with minor adaptation.
    if (replaceComponent) {
        replaceComponent(parentSectionForSwap.id, currentSelectedComponent.id, targetComponentType);
    } else {
        console.error("replaceComponent function not available in context");
    }

    // Old logic for creating swappedComponentData locally:
    // const definition = componentDefinitions.find(def => def.type === targetComponentType);
    // let newElements: ElementData[] = [];
    // let newParameters: Record<string, any> = {};
    // if (definition) {
    //   newElements = definition.defaultElements.map(el => ({ ...el, id: generateId() }));
    //   newParameters = { ...(definition.defaultParameters || {}) };
    // }
    // const swappedComponentData: ComponentData = {
    //   ...currentSelectedComponent,
    //   type: targetComponentType,
    //   elements: newElements,
    //   parameters: newParameters,
    //   swappableWith: currentSelectedComponent.swappableWith,
    // };
    // updateElement(swappedComponentData); // This line will be removed
  };

  // updateElement function is being replaced by direct context calls
  // For example, instead of updateElement({ ...currentTemplate, name: e.target.value })
  // it will be updatePageProperties({ name: e.target.value })

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"; // Added for Color Picker
import { HexColorPicker } from "react-colorful"; // Added for Color Picker

// ... (imports remain the same)

import { componentDefinitions as editorComponentDefinitions } from "@/lib/components/definitions";
import { ComponentType as SchemaComponentType, ElementType as SchemaElementType } from "@shared/schema";
import ElementEditor from "./editor/ElementEditor";
import { Element as ClientElement, ElementType as ClientElementType } from "@/lib/elements/types";
import { elementRegistry } from "@/lib/elements/ElementRegistry";
import { Trash2, ArrowUp, ArrowDown, GripVertical } from "lucide-react"; // Added icons for element actions


// Helper function for rendering color picker (moved from EditPanel)
const renderColorPicker = (
  label: string,
  color: string | undefined, // Allow undefined
  onChange: (color: string) => void,
  disabled?: boolean
) => (
  <div>
    <Label className="text-sm font-medium text-gray-700 mb-1">{label}</Label>
    <div className="flex items-center">
      <Dialog>
        <DialogTrigger asChild disabled={disabled}>
          <div
            className={cn(
              "w-10 h-10 rounded-md mr-3 border",
              disabled ? "cursor-not-allowed bg-gray-100" : "cursor-pointer"
            )}
            style={{ backgroundColor: color || '#transparent' }} // Default to transparent if undefined
          />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[250px]"> {/* Adjusted width */}
          <DialogHeader>
            <DialogTitle>Choose a color</DialogTitle>
          </DialogHeader>
          <HexColorPicker color={color || '#ffffff'} onChange={onChange} /> {/* Default to white for picker if undefined */}
          <Input value={color || ''} onChange={(e) => onChange(e.target.value)} className="mt-2" />
        </DialogContent>
      </Dialog>
      <Input
        type="text"
        className="w-40"
        value={color || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
    </div>
  </div>
);

export default function InspectorPanel({
  // template, // Removed
  // selectedElementId, // Removed
  // onUpdateTemplate, // Removed
  showPanel,
  onTogglePanel,
}: InspectorPanelProps) {
  const [activeTab, setActiveTab] = useState("properties");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Get state and actions from useEditor
  const {
    state: editorState,
    toggleUserLevel,
    updatePageProperties,
    updateSectionProperties,
    updateComponentProperties,
    updateElementProperties,
    replaceComponent,
    addComponentToSection,
    deleteComponentFromSection,
    reorderComponentInSection,
    addElementToComponent,
    deleteElementFromComponentPath,
    reorderElementInComponentPath,
    addSectionToPage,
    deleteSection, // Added for current task
    reorderSection // Added for current task
  } = useEditor();
  const { currentUserLevel, currentPage, currentFocusedElementId } = editorState;

  const {
    elementType: currentElementType,
    element: currentSelectedObject,
    section: parentSectionOfSelected, // This is the selected section itself if elementType is 'section'
    component: parentComponentOfSelected
  } = findSelectedElement();

  function findSelectedElement(): {
    elementType: "template" | "section" | "component" | "element" | null;
    element: TemplateData | SectionData | ComponentData | ElementData | null;
    section?: SectionData;
    component?: ComponentData;
  } {
    if (!currentFocusedElementId || !currentPage) {
      return { elementType: "template", element: currentPage as unknown as TemplateData };
    }
    if (currentFocusedElementId.startsWith("section-")) {
      const sectionId = currentFocusedElementId.replace("section-", "");
      const section = currentPage.sections.find((s) => s.id === sectionId);
      return { elementType: "section", element: section as unknown as SectionData || null, section: section as unknown as SectionData };
    }
    if (currentFocusedElementId.startsWith("component-")) {
      const [, sectionId, componentId] = currentFocusedElementId.split("-");
      const section = currentPage.sections.find((s) => s.id === sectionId);
      if (section) {
        const component = section.components.find((c) => c.id === componentId);
        return { elementType: "component", element: component as unknown as ComponentData || null, section: section as unknown as SectionData, component: component as unknown as ComponentData };
      }
    }
    if (currentFocusedElementId.startsWith("element-")) {
      const [, sectionId, componentId, elementId] = currentFocusedElementId.split("-");
      const section = currentPage.sections.find((s) => s.id === sectionId);
      if (section) {
        const component = section.components.find((c) => c.id === componentId);
        if (component) {
          const element = component.elements.find((e) => e.id === elementId);
          return { elementType: "element", element: element as unknown as ElementData || null, section: section as unknown as SectionData, component: component as unknown as ComponentData };
        }
      }
    }
    return { elementType: null, element: null, section: undefined, component: undefined };
  }

  const handleElementPropertyChange = (propertyName: string, value: any) => {
    if (currentElementType === 'element' && currentSelectedObject && parentComponentOfSelected && parentSectionOfSelected && updateElementProperties) {
      const currentSchemaElement = currentSelectedObject as ElementData;
      const newProperties = { ...currentSchemaElement.properties, [propertyName]: value };
      const path: ElementPath = {
        sectionId: parentSectionOfSelected.id,
        componentId: parentComponentOfSelected.id,
        elementId: currentSchemaElement.id,
      };
      updateElementProperties(path, newProperties);
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

    if (replaceComponent) {
        replaceComponent(parentSectionForSwap.id, currentSelectedComponent.id, targetComponentType);
    } else {
        console.error("replaceComponent function not available in context");
    }
  };

  const renderElementProperties = () => {
    if (!currentSelectedObject || !currentPage) {
      return <div className="text-center p-4 text-gray-500">Select an element to edit its properties</div>;
    }

    // Template/Page level properties
    if (currentElementType === "template" && currentPage && updatePageProperties) {
      const pageGlobalSettings = currentPage.globalSettings;
      const [newSectionName, setNewSectionName] = useState("");

      return (
        <div className="space-y-4 p-1">
          <div>
            <h3 className="text-sm font-semibold">Page Properties</h3>
            <div><Label htmlFor="page-name">Name (Internal)</Label><Input id="page-name" value={currentPage.name} onChange={e => updatePageProperties && updatePageProperties({ name: e.target.value})} /></div>
            <div><Label htmlFor="page-title">Site Title</Label><Input id="page-title" value={pageGlobalSettings?.title || ''} onChange={e => updatePageProperties && updatePageProperties({ globalSettings: { ...pageGlobalSettings, title: e.target.value }})} /></div>
            {/* Add more global settings fields as needed */}
          </div>

          <div className="pt-4 mt-4 border-t">
            <h4 className="text-sm font-semibold mb-2">Sections ({currentPage.sections?.length || 0})</h4>
            {currentPage.sections && currentPage.sections.length > 0 ? (
              <div className="space-y-1 max-h-60 overflow-y-auto bg-gray-50 p-2 rounded-md border mb-2">
                {currentPage.sections.map((sec, index) => {
                  // Assuming ClientTypes.Section has an 'editable' like property, or we check schema equivalent
                  // For MVP, let's assume sections are generally editable unless a specific 'locked' property exists.
                  // This needs alignment with how section editability is defined (e.g., in SchemaSection if that's the source of truth for this flag)
                  // For now, assume `sec.editable` might come from a potential cast to SchemaSection if ClientTypes.Section doesn't have it.
                  // Let's assume client sections mirror schema's editable field for now.
                  const isSectionLocked = (sec as unknown as SchemaSectionData).editable === 'locked-edit';
                  const canManage = !isSectionLocked; // Simplified: only locked-edit prevents reorder/delete

                  return (
                    <div key={sec.id} className="flex items-center justify-between p-1.5 bg-white rounded border text-xs group">
                      <GripVertical className="h-3.5 w-3.5 text-gray-400 mr-1 group-hover:text-gray-600 cursor-grab" />
                      <span title={`ID: ${sec.id}`} className="flex-grow truncate">{sec.name} ({sec.properties.sectionType || 'Custom'})</span>
                      <div className="flex items-center flex-shrink-0">
                        <Button
                          variant="ghost" size="xs"
                          onClick={() => reorderSection && canManage && reorderSection(sec.id, 'up')}
                          disabled={!canManage || index === 0}
                          title={!canManage ? "Section locked" : (index === 0 ? "Already at top" : "Move up")}
                          className="disabled:text-gray-400 px-1"
                        > <ArrowUp className="h-3.5 w-3.5" /> </Button>
                        <Button
                          variant="ghost" size="xs"
                          onClick={() => reorderSection && canManage && reorderSection(sec.id, 'down')}
                          disabled={!canManage || index === currentPage.sections.length - 1}
                          title={!canManage ? "Section locked" : (index === currentPage.sections.length - 1 ? "Already at bottom" : "Move down")}
                          className="disabled:text-gray-400 px-1"
                        > <ArrowDown className="h-3.5 w-3.5" /> </Button>
                        <Button
                          variant="ghost" size="xs"
                          onClick={() => deleteSection && canManage && deleteSection(sec.id)}
                          disabled={!canManage}
                          title={!canManage ? "Section locked" : "Delete section"}
                          className="text-red-500 hover:text-red-700 disabled:text-gray-400 px-1"
                        > <Trash2 className="h-3.5 w-3.5" /> </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-gray-500 mb-2">No sections on this page.</p>
            )}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full">Add New Section</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Section</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="new-section-name" className="text-right">Name</Label>
                    <Input
                      id="new-section-name"
                      value={newSectionName}
                      onChange={(e) => setNewSectionName(e.target.value)}
                      className="col-span-3"
                      placeholder="e.g., Hero, Features, Contact"
                    />
                  </div>
                  {/* Optional: Add section type selector here in the future */}
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    onClick={() => {
                      if (newSectionName.trim() && addSectionToPage) {
                        addSectionToPage(newSectionName.trim());
                        setNewSectionName(""); // Reset for next time
                        // Dialog should close automatically if it's part of a form that submits,
                        // or manually manage open/close state for the dialog.
                      }
                    }}
                    disabled={!newSectionName.trim()}
                  >
                    Create Section
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      );
    }

    if (currentElementType === "section" && currentSelectedObject && updateSectionProperties) {
      const currentSection = currentSelectedObject as SectionData; // This is SchemaSection
      const currentClientSection = currentSelectedObject as ClientTypes.Section; // Cast to ClientTypes.Section for allowedComponents, maxComponents
      const isSectionContentLocked = currentSection.editable === 'locked-edit';

      const canAddComponent = !currentClientSection.maxComponents || currentClientSection.components.length < currentClientSection.maxComponents;

      // Properties specific to sections, e.g., name, spacing
      return (
         <div className="space-y-3 p-1">
          <h3 className="text-sm font-semibold">Section: {currentSection.name} (ID: {currentSection.id})</h3>
          <div><Label>Editable Status: <Badge variant={isSectionContentLocked ? "destructive" : "default"}>{currentSection.editable}</Badge></Label></div>
          <div>
            <Label htmlFor={`section-name-${currentSection.id}`}>Name</Label>
            <Input id={`section-name-${currentSection.id}`} value={currentSection.name} disabled={isSectionContentLocked} onChange={e => updateSectionProperties(currentSection.id, { name: e.target.value })} />
          </div>
          <div>
            <Label htmlFor={`section-spacing-top-${currentSection.id}`}>Spacing Top (px)</Label>
            <Input type="number" id={`section-spacing-top-${currentSection.id}`} value={currentSection.spacing?.top || 0} disabled={isSectionContentLocked} onChange={e => updateSectionProperties(currentSection.id, { spacing: {...currentSection.spacing, top: parseInt(e.target.value) || 0 }})}/>
          </div>
           <div>
            <Label htmlFor={`section-spacing-bottom-${currentSection.id}`}>Spacing Bottom (px)</Label>
            <Input type="number" id={`section-spacing-bottom-${currentSection.id}`} value={currentSection.spacing?.bottom || 0} disabled={isSectionContentLocked} onChange={e => updateSectionProperties(currentSection.id, { spacing: {...currentSection.spacing, bottom: parseInt(e.target.value) || 0 }})}/>
          </div>

          {/* Add Component Button & Dialog - Task 4 */}
          <div className="pt-4 mt-4 border-t">
            <h4 className="text-sm font-semibold mb-2">Components ({currentClientSection.components.length}{currentClientSection.maxComponents ? `/${currentClientSection.maxComponents}` : ''})</h4>
            {currentClientSection.components && currentClientSection.components.length > 0 ? (
              <div className="space-y-1 max-h-48 overflow-y-auto bg-gray-50 p-2 rounded-md border">
                {currentClientSection.components.map((comp, index) => {
                  const schemaCompFromCurrentPage = currentSection.components.find(sc => sc.id === comp.id);
                  const isComponentLocked = schemaCompFromCurrentPage?.editable === 'locked-edit';
                  const isSectionLockedForComponentChanges = currentSection.editable === 'locked-edit' || currentSection.editable === 'locked-replacing';

                  const canDelete = !isComponentLocked && !isSectionLockedForComponentChanges;
                  const canReorder = !isSectionLockedForComponentChanges;

                  return (
                    <div key={comp.id} className="flex items-center justify-between p-1.5 bg-white rounded border text-xs">
                      <span title={`ID: ${comp.id}`} className="flex-grow truncate">
                        {editorComponentDefinitions.find(def => def.type === comp.type)?.name || comp.type}
                      </span>
                      <div className="flex items-center flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => {
                            if (reorderComponentInSection && canReorder) {
                              reorderComponentInSection(currentSection.id, comp.id, 'up');
                            }
                          }}
                          disabled={!canReorder || index === 0}
                          title={!canReorder ? "Section locked" : (index === 0 ? "Already at top" : "Move up")}
                          className="disabled:text-gray-400 px-1"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => {
                            if (reorderComponentInSection && canReorder) {
                              reorderComponentInSection(currentSection.id, comp.id, 'down');
                            }
                          }}
                          disabled={!canReorder || index === currentClientSection.components.length - 1}
                          title={!canReorder ? "Section locked" : (index === currentClientSection.components.length - 1 ? "Already at bottom" : "Move down")}
                          className="disabled:text-gray-400 px-1"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => {
                            if (deleteComponentFromSection && canDelete) {
                              deleteComponentFromSection(currentSection.id, comp.id);
                            }
                          }}
                          disabled={!canDelete}
                          title={!canDelete ? (isComponentLocked ? "Component locked" : "Section locked") : "Delete component"}
                          className="text-red-500 hover:text-red-700 disabled:text-gray-400 px-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-gray-500 mb-2">No components in this section.</p>
            )}

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full" disabled={!canAddComponent || isSectionContentLocked}>
                  {isSectionContentLocked ? "Section Locked" : !canAddComponent ? "Max Components Reached" : "Add Component"}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add Component to Section: {currentSection.name}</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 gap-2 py-2 max-h-[60vh] overflow-y-auto">
                  {editorComponentDefinitions
                    .filter(def =>
                      !currentClientSection.allowedComponentTypes ||
                      currentClientSection.allowedComponentTypes.length === 0 ||
                      currentClientSection.allowedComponentTypes.includes(def.type as ClientTypes.ComponentType)
                    )
                    .map(def => (
                    <Button
                      key={def.type}
                      variant="ghost"
                      className="justify-start p-2 h-auto"
                      onClick={() => {
                        if (addComponentToSection) {
                          addComponentToSection(currentSection.id, def.type as SchemaComponentType);
                        }
                        // Consider closing dialog, though context change might re-render anyway
                      }}
                    >
                      <div>
                        <div className="font-medium">{def.name}</div>
                        <div className="text-xs text-gray-500 text-left">{def.description || "No description."}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      );
    }

    // Component Content Properties (Task 3)
    if (currentElementType === "component" && currentSelectedObject && updateComponentProperties && parentSectionOfSelected) {
      const clientComponent = currentSelectedObject as ClientTypes.Component; // Cast to ClientTypes.Component
      const componentSchema = currentSelectedObject as ComponentData; // For ID, type, swappableWith, etc.
      const isComponentContentLocked = clientComponent.editingLocked || componentSchema.editable === 'locked-edit';

      if (clientComponent.content && !clientComponent.usesElements) { // Show this UI only if content exists and not an element-based component
        const contentFields = Object.entries(clientComponent.content).filter(([key]) => key !== 'elements'); // Exclude 'elements' array from here

        if (contentFields.length > 0) {
          return (
            <div className="space-y-3 p-1">
              <h3 className="text-sm font-semibold">Component: {componentSchema.type} (ID: {componentSchema.id})</h3>
              <p className="text-xs text-gray-500">Editing "classic" component content fields.</p>
              {contentFields.map(([key, value]) => {
                const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
                if (key === 'image' || key === 'backgroundImage') {
                  return (
                    <div key={key} className="space-y-2">
                      <Label htmlFor={`comp-content-${key}-${componentSchema.id}`}>{label}</Label>
                      <Input
                        id={`comp-content-${key}-${componentSchema.id}`}
                        value={typeof value === 'string' ? value : ''}
                        onChange={(e) => updateComponentProperties(parentSectionOfSelected!.id, componentSchema.id, { content: { ...clientComponent.content, [key]: e.target.value }})}
                        placeholder="Enter image URL"
                        disabled={isComponentContentLocked}
                      />
                      {typeof value === 'string' && value && (
                        <div className="mt-1 border rounded-md p-2 flex justify-center items-center bg-gray-50 max-h-32 overflow-hidden">
                          <img src={value} alt="Preview" className="max-w-full max-h-28 object-contain" />
                        </div>
                      )}
                    </div>
                  );
                } else if (typeof value === 'string') {
                  if (value.length > 100 || value.includes('\n')) {
                    return (
                      <div key={key}>
                        <Label htmlFor={`comp-content-${key}-${componentSchema.id}`}>{label}</Label>
                        <Textarea
                          id={`comp-content-${key}-${componentSchema.id}`}
                          value={value}
                          onChange={(e) => updateComponentProperties(parentSectionOfSelected!.id, componentSchema.id, { content: { ...clientComponent.content, [key]: e.target.value }})}
                          rows={3}
                          disabled={isComponentContentLocked}
                        />
                      </div>
                    );
                  } else {
                    return (
                      <div key={key}>
                        <Label htmlFor={`comp-content-${key}-${componentSchema.id}`}>{label}</Label>
                        <Input
                          id={`comp-content-${key}-${componentSchema.id}`}
                          type="text"
                          value={value}
                          onChange={(e) => updateComponentProperties(parentSectionOfSelected!.id, componentSchema.id, { content: { ...clientComponent.content, [key]: e.target.value }})}
                          disabled={isComponentContentLocked}
                        />
                      </div>
                    );
                  }
                }
                // Add more type handlers if needed (e.g., for numbers, booleans)
                return null;
              })}
              {componentSchema.swappableWith && componentSchema.swappableWith.length > 0 && renderComponentSwapUI(componentSchema)}
            </div>
          );
        }
      }
    }


    if (currentElementType === "element" && currentSelectedObject && updateElementProperties && parentSectionOfSelected && parentComponentOfSelected) {
      const selectedSchemaElement = currentSelectedObject as ElementData;

      // Create the clientElementForEditor structure for ElementEditor
      const clientElementForEditor: ClientElement = {
        id: selectedSchemaElement.id,
        // Ensure the type is lowercased as expected by ElementRegistry and ClientElementType
        type: selectedSchemaElement.type.toLowerCase() as ClientElementType,
        properties: selectedSchemaElement.properties || {},
        // ElementEditor uses properties.locked, so make sure it's set if applicable
        // The `isElementContentLocked` was based on parent component. We can pass this into properties.
        // This assumes ElementEditor will look for `properties.locked` to disable fields.
      };
      if (parentComponentOfSelected?.editable === 'locked-edit' || (parentComponentOfSelected as ClientTypes.Component)?.editingLocked) {
        clientElementForEditor.properties.locked = true;
      }


      const handleElementEditorUpdate = (updatedPartialClientElement: Partial<ClientElement>) => {
        if (updatedPartialClientElement.properties && updateElementProperties && parentSectionOfSelected && parentComponentOfSelected) {
          const path: ElementPath = {
            sectionId: parentSectionOfSelected.id,
            componentId: parentComponentOfSelected.id,
            elementId: selectedSchemaElement.id,
          };
          updateElementProperties(path, updatedPartialClientElement.properties);
        }
      };

      return (
        <div className="space-y-3 p-1">
          {/* The ElementEditor component will now render its own title/header */}
          <ElementEditor
            element={clientElementForEditor}
            onUpdate={handleElementEditorUpdate}
            // onDelete could be wired up here if needed
          />
        </div>
      );
    }

    if (currentElementType === "component" && currentSelectedObject && updateComponentProperties) {
      const currentComponent = currentSelectedObject as ComponentData; // This is SchemaComponent
      const clientComponent = currentSelectedObject as ClientTypes.Component; // Cast for client-specific fields if needed later in this block

      // Display component parameters from SchemaComponent.parameters if they exist and it's NOT an element-based component with its own elements UI
      // Also, if it's a classic component that we just rendered content for, we might only show swap UI here.
      // The primary UI for elements within an element-based component is handled by selecting the element itself.
      // This block now primarily handles the "Swap Component" UI and displays parameters for components that might have them
      // but are not primarily "element-based" in their editing model in InspectorPanel.

      const isComponentItselfLockedForEdit = currentComponent.editable === 'locked-edit' || clientComponent.editingLocked;
      const isComponentLockedForReplaceBySelf = currentComponent.editable === 'locked-replacing'; // from schema
      const isComponentLockedForReplaceByParent = parentSectionOfSelected?.editable === 'locked-replacing'; // from schema
      const isProFeatureLocked = currentUserLevel === 'free';

      const finalDisableSwapUI = isComponentLockedForReplaceBySelf || isComponentLockedForReplaceByParent || isProFeatureLocked;

      let swapDisabledReason = "";
      if (isComponentLockedForReplaceBySelf) swapDisabledReason = "This component type itself is locked for replacing.";
      else if (isComponentLockedForReplaceByParent) swapDisabledReason = "Components in this parent section are locked for replacing.";
      else if (isProFeatureLocked) swapDisabledReason = "Component Swapping is a Pro feature.";

      const hasEditableParameters = currentComponent.parameters && Object.keys(currentComponent.parameters).length > 0;
      const isElementBasedComponent = clientComponent.usesElements || (clientComponent.content && Array.isArray(clientComponent.content.elements) && clientComponent.content.elements.length > 0);

      // Show component parameters if they exist AND it's not an element-based component (those are edited by selecting elements)
      // OR if it's an element-based component but has no elements (could be a new/empty one)
      const shouldShowParameters = hasEditableParameters && (!isElementBasedComponent || (isElementBasedComponent && (!clientComponent.content?.elements || clientComponent.content.elements.length === 0)));

      const componentDisplay = (
        <div className="space-y-3 p-1">
          <h3 className="text-sm font-semibold">Component: {currentComponent.type} (ID: {currentComponent.id})</h3>
          <div><Label>Editable Status: <Badge variant={isComponentItselfLockedForEdit ? "destructive" : "default"}>{clientComponent.editingLocked ? 'Content Locked (Client)' : currentComponent.editable}</Badge></Label></div>
          {parentSectionOfSelected && <Label className="text-xs">Parent Section Lock: <Badge variant={parentSectionOfSelected.editable === 'locked-replacing' || parentSectionOfSelected.editable === 'locked-edit' ? 'warning' : 'default'}>{parentSectionOfSelected.editable}</Badge></Label>}

          {shouldShowParameters && (
            <div>
              <Label>Parameters:</Label>
              {/* Basic editable JSON for parameters - can be improved */}
              <Textarea
                className="text-xs bg-gray-50 p-2 rounded mt-1 max-h-28 overflow-auto font-mono"
                value={JSON.stringify(currentComponent.parameters, null, 2)}
                onChange={e => {
                  try {
                    const newParams = JSON.parse(e.target.value);
                    if (updateComponentProperties && parentSectionOfSelected) {
                      updateComponentProperties(parentSectionOfSelected.id, currentComponent.id, { parameters: newParams });
                    }
                  } catch (err) {
                    console.warn("Invalid JSON for parameters", err);
                  }
                }}
                disabled={isComponentItselfLockedForEdit}
                rows={4}
              />
            </div>
          )}
          {(!hasEditableParameters || (isElementBasedComponent && clientComponent.content?.elements && clientComponent.content.elements.length > 0) )&&
            <p className="text-xs text-gray-500">
              {isElementBasedComponent ? "This is an element-based component. Select individual elements on the canvas to edit their properties." : "No parameters for this component."}
            </p>
          }

          {/* UI for Adding Elements to a Component */}
          {(isElementBasedComponent || componentData.elements) && parentSectionOfSelected && ( // Show if element-based or has an elements array
            <div className="pt-4 mt-4 border-t">
              <h4 className="text-sm font-semibold mb-2">Elements ({componentSchema.elements?.length || 0})</h4>
              {componentSchema.elements && componentSchema.elements.length > 0 ? (
                <div className="space-y-1 max-h-48 overflow-y-auto bg-gray-50 p-2 rounded-md border mb-2">
                  {componentSchema.elements.map((el, index) => {
                    const path: ElementPath = {
                      sectionId: parentSectionOfSelected!.id,
                      componentId: componentSchema.id,
                      elementId: el.id,
                    };
                    const canManageElements = !isComponentItselfLockedForEdit;

                    return (
                      <div key={el.id} className="flex items-center justify-between p-1.5 bg-white rounded border text-xs group">
                        <GripVertical className="h-3.5 w-3.5 text-gray-400 mr-1 group-hover:text-gray-600 cursor-grab" />
                        <span title={`ID: ${el.id}`} className="flex-grow truncate">{el.type}</span>
                        <div className="flex items-center flex-shrink-0">
                          <Button
                            variant="ghost" size="xs"
                            onClick={() => reorderElementInComponentPath && canManageElements && reorderElementInComponentPath(path, 'up')}
                            disabled={!canManageElements || index === 0}
                            title={!canManageElements ? "Component locked" : (index === 0 ? "Already at top" : "Move up")}
                            className="disabled:text-gray-400 px-1"
                          > <ArrowUp className="h-3.5 w-3.5" /> </Button>
                          <Button
                            variant="ghost" size="xs"
                            onClick={() => reorderElementInComponentPath && canManageElements && reorderElementInComponentPath(path, 'down')}
                            disabled={!canManageElements || index === componentSchema.elements.length - 1}
                            title={!canManageElements ? "Component locked" : (index === componentSchema.elements.length - 1 ? "Already at bottom" : "Move down")}
                            className="disabled:text-gray-400 px-1"
                          > <ArrowDown className="h-3.5 w-3.5" /> </Button>
                          <Button
                            variant="ghost" size="xs"
                            onClick={() => deleteElementFromComponentPath && canManageElements && deleteElementFromComponentPath(path)}
                            disabled={!canManageElements}
                            title={!canManageElements ? "Component locked" : "Delete element"}
                            className="text-red-500 hover:text-red-700 disabled:text-gray-400 px-1"
                          > <Trash2 className="h-3.5 w-3.5" /> </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-gray-500 mb-2">No elements in this component.</p>
              )}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full" disabled={isComponentItselfLockedForEdit}>
                    {isComponentItselfLockedForEdit ? "Component Locked" : "Add Element"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add Element to: {componentData.type}</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-1 gap-2 py-2 max-h-[60vh] overflow-y-auto">
                    {elementRegistry.getAllDefinitions().map(def => (
                      <Button
                        key={def.type}
                        variant="ghost"
                        className="justify-start p-2 h-auto"
                        onClick={() => {
                          if (addElementToComponent && parentSectionOfSelected) {
                            addElementToComponent(parentSectionOfSelected.id, componentData.id, def.type as ClientElementType);
                          }
                          // Consider closing dialog, though context change might re-render anyway
                        }}
                      >
                        <div>
                          <div className="font-medium">{def.displayName}</div>
                          {/* <div className="text-xs text-gray-500 text-left">{def.description || "No description."}</div> */}
                        </div>
                      </Button>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
           {renderComponentSwapUI(currentComponent)}
        </div>
      );
      return componentDisplay;
    }
    return <div className="text-center p-4 text-gray-500">Select an item or no properties available.</div>;
  };

  const renderComponentSwapUI = (componentData: ComponentData) => {
    if (!componentData.swappableWith || componentData.swappableWith.length === 0) return null;

    const isComponentLockedForReplaceBySelf = componentData.editable === 'locked-replacing';
    const isComponentLockedForReplaceByParent = parentSectionOfSelected?.editable === 'locked-replacing';
    const isProFeatureLocked = currentUserLevel === 'free';
    const finalDisableSwapUI = isComponentLockedForReplaceBySelf || isComponentLockedForReplaceByParent || isProFeatureLocked;

    let swapDisabledReason = "";
    if (isComponentLockedForReplaceBySelf) swapDisabledReason = "This component type itself is locked for replacing.";
    else if (isComponentLockedForReplaceByParent) swapDisabledReason = "Components in this parent section are locked for replacing.";
    else if (isProFeatureLocked) swapDisabledReason = "Component Swapping is a Pro feature.";

    return (
      <div className="mt-4 pt-4 border-t">
        <Label htmlFor={`component-swap-select-${componentData.id}`} className={cn("text-sm font-medium text-gray-700 block mb-1", finalDisableSwapUI && "text-gray-400")}>
          Swap with another component:
        </Label>
        <Select
          onValueChange={(value) => { if (value && !finalDisableSwapUI) handleComponentSwap(value as ComponentType); }}
          disabled={finalDisableSwapUI}
        >
          <SelectTrigger id={`component-swap-select-${componentData.id}`} className="w-full">
            <SelectValue placeholder="Select a component type..." />
          </SelectTrigger>
          <SelectContent>
            {componentData.swappableWith.map(swapType => {
              const def = componentDefinitions.find(d => d.type === swapType);
              return (<SelectItem key={swapType} value={swapType} disabled={swapType === componentData.type}>{def ? def.name : swapType}{def && def.description && <span className="text-xs text-gray-500 ml-2 hidden md:inline">({def.description})</span>}</SelectItem>);
            })}
          </SelectContent>
        </Select>
        {finalDisableSwapUI && swapDisabledReason && (
         <p className="text-xs text-gray-500 mt-1">{swapDisabledReason}
           {isProFeatureLocked && !(isComponentLockedForReplaceBySelf || isComponentLockedForReplaceByParent) && toggleUserLevel && (
             <Button variant="link" size="xs" className="p-0 h-auto text-amber-600 hover:text-amber-700 ml-1" onClick={toggleUserLevel}>
               (Try Pro?)
             </Button>
           )}
         </p>
       )}
      </div>
    );
  }

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
            <TabsTrigger value="styles" disabled={currentElementType !== 'section' && currentElementType !== 'component' /* Style editing for elements can be added later if needed */}>Styles</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="properties" className="p-4">{renderElementProperties()}</TabsContent>
          <TabsContent value="styles" className="p-4">
            {currentElementType === 'section' && currentSelectedObject && updateSectionProperties && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Section Styles</h3>
                {/* ... existing section style controls ... */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-1">Background Style</Label>
                  <Select
                    value={(currentSelectedObject as SectionData).properties?.backgroundStyle || 'color'}
                    onValueChange={(value) => updateSectionProperties((currentSelectedObject as SectionData).id, { properties: { ...(currentSelectedObject as SectionData).properties, backgroundStyle: value }})}
                    disabled={(currentSelectedObject as SectionData).editable === 'locked-edit'}
                  >
                    <SelectTrigger><SelectValue placeholder="Select a background style" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image">Image with Overlay</SelectItem>
                      <SelectItem value="color">Solid Color</SelectItem>
                      <SelectItem value="gradient">Gradient</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {renderColorPicker(
                  "Background Color",
                  (currentSelectedObject as SectionData).properties?.backgroundColor,
                  (color) => updateSectionProperties((currentSelectedObject as SectionData).id, { properties: { ...(currentSelectedObject as SectionData).properties, backgroundColor: color }}),
                  (currentSelectedObject as SectionData).editable === 'locked-edit'
                )}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-1">Padding</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs text-gray-500">Top & Bottom (px)</Label>
                      <Input type="number" value={(currentSelectedObject as SectionData).properties?.padding?.vertical || 0} disabled={(currentSelectedObject as SectionData).editable === 'locked-edit'}
                        onChange={(e) => updateSectionProperties((currentSelectedObject as SectionData).id, { properties: { ...(currentSelectedObject as SectionData).properties, padding: { ...((currentSelectedObject as SectionData).properties?.padding || {}), vertical: parseInt(e.target.value) || 0 }}})} />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Left & Right (px)</Label>
                      <Input type="number" value={(currentSelectedObject as SectionData).properties?.padding?.horizontal || 0} disabled={(currentSelectedObject as SectionData).editable === 'locked-edit'}
                        onChange={(e) => updateSectionProperties((currentSelectedObject as SectionData).id, { properties: { ...(currentSelectedObject as SectionData).properties, padding: { ...((currentSelectedObject as SectionData).properties?.padding || {}), horizontal: parseInt(e.target.value) || 0 }}})} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            {currentElementType === 'component' && currentSelectedObject && updateComponentProperties && parentSectionOfSelected && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Component Styles</h3>
                <p className="text-xs text-gray-500">Editing style options for selected component.</p>
                {(currentSelectedObject as ClientTypes.Component).styleOptions && Object.keys((currentSelectedObject as ClientTypes.Component).styleOptions!).length > 0 ? (
                  <>
                    {((currentSelectedObject as ClientTypes.Component).styleOptions?.textColor !== undefined) && renderColorPicker(
                      "Text Color",
                      (currentSelectedObject as ClientTypes.Component).styleOptions?.textColor,
                      (color) => updateComponentProperties(parentSectionOfSelected!.id, (currentSelectedObject as ClientTypes.Component).id, { styleOptions: { ...(currentSelectedObject as ClientTypes.Component).styleOptions, textColor: color } }),
                      (currentSelectedObject as ClientTypes.Component).editingLocked
                    )}
                    {((currentSelectedObject as ClientTypes.Component).styleOptions?.overlayColor !== undefined) && renderColorPicker(
                      "Overlay Color",
                      (currentSelectedObject as ClientTypes.Component).styleOptions?.overlayColor,
                      (color) => updateComponentProperties(parentSectionOfSelected!.id, (currentSelectedObject as ClientTypes.Component).id, { styleOptions: { ...(currentSelectedObject as ClientTypes.Component).styleOptions, overlayColor: color } }),
                      (currentSelectedObject as ClientTypes.Component).editingLocked
                    )}
                    {((currentSelectedObject as ClientTypes.Component).styleOptions?.buttonStyle !== undefined) && (
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-1">Button Style</Label>
                        <Select
                          value={(currentSelectedObject as ClientTypes.Component).styleOptions?.buttonStyle}
                          onValueChange={(value) => updateComponentProperties(parentSectionOfSelected!.id, (currentSelectedObject as ClientTypes.Component).id, { styleOptions: { ...(currentSelectedObject as ClientTypes.Component).styleOptions, buttonStyle: value as any }})}
                          disabled={(currentSelectedObject as ClientTypes.Component).editingLocked}
                        >
                          <SelectTrigger><SelectValue placeholder="Select a style" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="primary">Primary</SelectItem>
                            <SelectItem value="secondary">Secondary</SelectItem>
                            <SelectItem value="outline">Outline</SelectItem>
                            <SelectItem value="ghost">Ghost</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-gray-500">No style options defined for this component.</p>
                )}
              </div>
            )}
            {currentElementType === 'element' && (
              <div className="text-center p-4 text-gray-500">Element-specific style options (Not implemented yet in this tab).</div>
            )}
            {currentElementType !== 'section' && currentElementType !== 'component' && currentElementType !== 'element' && (
                 <div className="text-center p-4 text-gray-500">Select a section or component to see style options.</div>
            )}
          </TabsContent>
          <TabsContent value="settings" className="p-4"><div className="text-center p-4 text-gray-500">Advanced settings (Not implemented).</div></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
