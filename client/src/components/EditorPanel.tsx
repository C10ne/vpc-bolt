import React, { useState } from "react";
import {
  Template as TemplateData,
  Section as SectionData,
  Component as ComponentData,
  Element as ElementData
} from "@shared/schema";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import SectionComponent from "./editor/SectionComponent";
import { useToast } from "@/hooks/use-toast"; // Re-added useToast
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { sectionDefinitions, SectionDefinition } from "@/lib/sections/definitions";
import QuickEditBar from './editor/QuickEditBar';
import MiniTextToolbar from './editor/MiniTextToolbar'; // Import MiniTextToolbar

interface EditorPanelProps {
  template: TemplateData;
  selectedElementId: string | null;
  onSelectElement: (elementId: string | null) => void;
  onUpdateTemplate: (updatedTemplate: TemplateData) => void;
  viewMode: "desktop" | "tablet" | "mobile";
  onChangeViewMode: (mode: "desktop" | "tablet" | "mobile") => void;
}

const generateId = (): number => Date.now() + Math.floor(Math.random() * 10000);

export default function EditorPanel({
  template,
  selectedElementId,
  onSelectElement,
  onUpdateTemplate,
  viewMode,
  onChangeViewMode,
}: EditorPanelProps) {
  const { toast } = useToast(); // Initialize useToast
  const [draggedSection, setDraggedSection] = useState<SectionData | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState<number | null>(null);
  const [isAddSectionDialogOpen, setIsAddSectionDialogOpen] = useState(false);

  const handleAddSectionFromDefinition = (definition: SectionDefinition) => {
    if (!template || !onUpdateTemplate) {
      console.error("Template or onUpdateTemplate function is not available from props.");
      return;
    }

    const newDefaultComponents = definition.defaultComponents.map((comp): ComponentData => ({
      ...comp,
      id: generateId(),
      elements: comp.elements.map((el): ElementData => ({
        ...el,
        id: generateId(),
      })),
    }));

    const newSection: SectionData = {
      id: generateId(),
      type: definition.type,
      name: definition.name,
      editable: definition.defaultConfig?.editable || 'editable',
      properties: { ...(definition.defaultConfig?.properties || {}) },
      spacing: definition.defaultConfig?.spacing,
      background: definition.defaultConfig?.background,
      allowedComponentTypes: definition.defaultConfig?.allowedComponentTypes,
      maxComponents: definition.defaultConfig?.maxComponents,
      minComponents: definition.defaultConfig?.minComponents,
      components: newDefaultComponents,
    };
    
    const updatedSections = [...(template.sections || []), newSection];
    onUpdateTemplate({ ...template, sections: updatedSections });
    setIsAddSectionDialogOpen(false);
  };

  // Added deleteSection function with lock check
  const deleteSection = (sectionId: number) => {
    if (!template || !onUpdateTemplate) {
      console.error("Template or onUpdateTemplate function is not available from props.");
      return;
    }

    const sectionToDelete = template.sections.find(s => s.id === sectionId);

    if (sectionToDelete && sectionToDelete.editable === 'locked-edit') {
      toast({
        title: "Action Denied",
        description: `Section "${sectionToDelete.name}" is locked and cannot be deleted.`,
        variant: "destructive",
      });
      return;
    }

    const updatedSections = template.sections.filter(
      (section) => section.id !== sectionId
    );
    onUpdateTemplate({
      ...template,
      sections: updatedSections,
    });
  };


  const handleDragStart = (section: SectionData) => {
    setDraggedSection(section);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setIsDraggingOver(index);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (!draggedSection) return;

    const currentSections = template.sections || [];
    const dragIndex = currentSections.findIndex(s => s.id === draggedSection.id);
    if (dragIndex === -1) return;

    const newSections = [...currentSections];
    newSections.splice(dragIndex, 1);
    newSections.splice(dropIndex, 0, draggedSection);

    onUpdateTemplate({
      ...template,
      sections: newSections,
    });
    
    setDraggedSection(null);
    setIsDraggingOver(null);
  };

  const handleDragEnd = () => {
    setDraggedSection(null);
    setIsDraggingOver(null);
  };

  const renderSection = (section: SectionData) => {
    const currentSections = template.sections || [];
    const index = currentSections.findIndex(s => s.id === section.id);

    return (
      <div
        key={section.id}
        className={cn(
          "border-2 border-transparent hover:border-blue-200 relative group"
        )}
        draggable={true}
        onDragStart={() => handleDragStart(section)}
        onDragEnd={handleDragEnd}
        onDragOver={(e) => handleDragOver(e, index)}
        onDrop={(e) => handleDrop(e, index)}
      >
        <SectionComponent 
          section={section}
        />
        
        {isDraggingOver === index && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500 z-20"></div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-100 relative h-full" id="editorArea">
      {/* Top toolbar for editor - simplified for brevity, actual content is there */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center space-x-4"> {/* Placeholder for actual toolbar content */}
            <Button variant="ghost" size="icon" className="h-8 w-8"> {/* Undo */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8"> {/* Redo */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </Button>
        </div>
        <div className="flex items-center space-x-2"> {/* View mode buttons */}
          <Button variant={viewMode === "desktop" ? "default" : "outline"} size="sm" className={cn("px-3", viewMode === "desktop" ? "bg-primary text-white":"")} onClick={() => onChangeViewMode("desktop")}>Desktop</Button>
          <Button variant={viewMode === "tablet" ? "default" : "outline"} size="sm" className={cn("px-3", viewMode === "tablet" ? "bg-primary text-white":"")} onClick={() => onChangeViewMode("tablet")}>Tablet</Button>
          <Button variant={viewMode === "mobile" ? "default" : "outline"} size="sm" className={cn("px-3", viewMode === "mobile" ? "bg-primary text-white":"")} onClick={() => onChangeViewMode("mobile")}>Mobile</Button>
        </div>
      </div>

      <div className="p-6 flex justify-center" onClick={() => onSelectElement(null)}>
        <div 
          className={cn(
            "bg-white shadow-sm rounded-lg overflow-hidden",
            viewMode === "desktop" ? "w-full max-w-6xl" : 
            viewMode === "tablet" ? "w-[768px]" : 
            "w-[375px]"
          )}
        >
          {(template?.sections || []).map((section) => renderSection(section))}
          
          {(!template?.sections || template.sections.length === 0) && (
            <div className="p-12 text-center bg-gray-50">
              <h3 className="text-lg font-medium text-gray-600 mb-2">No sections added yet</h3>
              <p className="text-gray-500 mb-4">Add your first section to start building your page</p>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isAddSectionDialogOpen} onOpenChange={setIsAddSectionDialogOpen}>
        <DialogTrigger asChild>
          <Button
            className="bg-primary hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center px-4 py-2 fixed bottom-6 left-1/2 transform -translate-x-1/2 z-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
            <span>Add Section</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] bg-white">
          <DialogHeader>
            <DialogTitle>Add New Section</DialogTitle>
            <DialogDescription>Choose a predefined section type to add to your page.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 max-h-[60vh] overflow-y-auto">
            {sectionDefinitions.map((def) => (
              <div
                key={def.type}
                className="p-4 border rounded-lg hover:shadow-lg cursor-pointer flex flex-col items-start text-left hover:bg-gray-50 transition-colors"
                onClick={() => handleAddSectionFromDefinition(def)}
              >
                <h3 className="font-semibold mb-1 text-gray-800">{def.name}</h3>
                <p className="text-xs text-gray-500">{def.description}</p>
              </div>
            ))}
          </div>
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <QuickEditBar />
      <MiniTextToolbar /> {/* Add MiniTextToolbar here */}
    </div>
  );
}
