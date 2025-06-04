import { useState } from "react";
import { Template, Section, Element } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import SectionComponent from "./editor/SectionComponent";
import { useToast } from "@/hooks/use-toast";

interface EditorPanelProps {
  template: Template;
  selectedElementId: string | null;
  onSelectElement: (elementId: string | null) => void;
  onUpdateTemplate: (updatedTemplate: Template) => void;
  viewMode: "desktop" | "tablet" | "mobile";
  onChangeViewMode: (mode: "desktop" | "tablet" | "mobile") => void;
}

export default function EditorPanel({
  template,
  selectedElementId,
  onSelectElement,
  onUpdateTemplate,
  viewMode,
  onChangeViewMode,
}: EditorPanelProps) {
  const { toast } = useToast();
  const [draggedSection, setDraggedSection] = useState<Section | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState<number | null>(null);

  const handleAddSection = () => {
    // Show dialog to select section type
    toast({
      title: "Add Section",
      description: "Section selection dialog will appear here.",
    });
  };

  const updateSection = (sectionId: number, updatedSection: Section) => {
    const updatedSections = template.sections.map((section) =>
      section.id === sectionId ? updatedSection : section
    );
    
    onUpdateTemplate({
      ...template,
      sections: updatedSections,
    });
  };

  const deleteSection = (sectionId: number) => {
    const updatedSections = template.sections.filter(
      (section) => section.id !== sectionId
    );
    
    onUpdateTemplate({
      ...template,
      sections: updatedSections,
    });
  };

  const moveSectionUp = (sectionId: number) => {
    const sectionIndex = template.sections.findIndex((s) => s.id === sectionId);
    if (sectionIndex <= 0) return;
    
    const newSections = [...template.sections];
    const temp = newSections[sectionIndex];
    newSections[sectionIndex] = newSections[sectionIndex - 1];
    newSections[sectionIndex - 1] = temp;
    
    onUpdateTemplate({
      ...template,
      sections: newSections,
    });
  };

  const moveSectionDown = (sectionId: number) => {
    const sectionIndex = template.sections.findIndex((s) => s.id === sectionId);
    if (sectionIndex === -1 || sectionIndex >= template.sections.length - 1) return;
    
    const newSections = [...template.sections];
    const temp = newSections[sectionIndex];
    newSections[sectionIndex] = newSections[sectionIndex + 1];
    newSections[sectionIndex + 1] = temp;
    
    onUpdateTemplate({
      ...template,
      sections: newSections,
    });
  };

  const handleDragStart = (section: Section) => {
    setDraggedSection(section);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setIsDraggingOver(index);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (!draggedSection) return;

    const dragIndex = template.sections.findIndex(s => s.id === draggedSection.id);
    if (dragIndex === -1) return;

    const newSections = [...template.sections];
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

  const renderSection = (section: Section) => {

    return (
      <div
        key={section.id}
        className={cn(
          "border-2 border-transparent hover:border-blue-200 relative group",
          selectedElementId === `section-${section.id}` && "border-blue-400"
        )}
        onClick={(e) => {
          e.stopPropagation();
          onSelectElement(`section-${section.id}`);
        }}
        draggable={true}
        onDragStart={() => handleDragStart(section)}
        onDragEnd={handleDragEnd}
        onDragOver={(e) => handleDragOver(e, template.sections.indexOf(section))}
        onDrop={(e) => handleDrop(e, template.sections.indexOf(section))}
      >
        {/* Section controls placeholder */}
        
        <SectionComponent 
          section={section}
          index={template.sections.indexOf(section)}
        />
        
        {isDraggingOver === template.sections.indexOf(section) && (
          <div className="border-t-2 border-primary absolute top-0 left-0 right-0"></div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-100 relative h-full" id="editorArea">
      {/* Top toolbar for editor */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === "desktop" ? "default" : "outline"}
            size="sm"
            className={cn("px-3 py-1.5 flex items-center gap-1", 
              viewMode === "desktop" ? "bg-primary text-white" : "")}
            onClick={() => onChangeViewMode("desktop")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z"
                clipRule="evenodd"
              />
            </svg>
            <span className="hidden sm:inline">Desktop</span>
          </Button>
          <Button
            variant={viewMode === "tablet" ? "default" : "outline"}
            size="sm"
            className={cn("px-3 py-1.5 flex items-center gap-1", 
              viewMode === "tablet" ? "bg-primary text-white" : "")}
            onClick={() => onChangeViewMode("tablet")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm4 14a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            <span className="hidden sm:inline">Tablet</span>
          </Button>
          <Button
            variant={viewMode === "mobile" ? "default" : "outline"}
            size="sm"
            className={cn("px-3 py-1.5 flex items-center gap-1", 
              viewMode === "mobile" ? "bg-primary text-white" : "")}
            onClick={() => onChangeViewMode("mobile")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            <span className="hidden sm:inline">Mobile</span>
          </Button>
        </div>
      </div>

      {/* Editor canvas area */}
      <div className="p-6 flex justify-center" onClick={() => onSelectElement(null)}>
        <div 
          className={cn(
            "bg-white shadow-sm rounded-lg overflow-hidden",
            viewMode === "desktop" ? "w-full max-w-6xl" : 
            viewMode === "tablet" ? "w-[768px]" : 
            "w-[375px]"
          )}
        >
          {/* Global template preview with editable sections */}
          {template.sections.map((section) => renderSection(section))}
          
          {template.sections.length === 0 && (
            <div className="p-12 text-center bg-gray-50">
              <h3 className="text-lg font-medium text-gray-600 mb-2">No sections added yet</h3>
              <p className="text-gray-500 mb-4">Add your first section to start building your page</p>
              <Button onClick={handleAddSection} className="bg-primary text-white">
                Add Section
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Add new section floating button */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-10">
        <Button 
          onClick={handleAddSection}
          className="bg-primary hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center px-4 py-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>Add Section</span>
        </Button>
      </div>
    </div>
  );
}
