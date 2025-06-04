import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Template, TemplateContent, Section, Component, DeviceType, SelectedElement } from './types';
import { nanoid } from 'nanoid';

interface EditorContextType {
  template: TemplateContent | null;
  selectedElement: SelectedElement | null;
  previewDevice: DeviceType;
  lastSaved: string | null;
  
  setTemplate: (template: TemplateContent) => void;
  selectElement: (element: SelectedElement | null) => void;
  updateSection: (sectionId: string, updates: Partial<Section>) => void;
  updateComponent: (sectionId: string, componentId: string, updates: Partial<Component>) => void;
  updateGlobalStyles: (key: string, value: any) => void;
  addSection: (section: Omit<Section, 'id'>) => void;
  deleteSection: (sectionId: string) => void;
  setPreviewDevice: (device: DeviceType) => void;
  saveChanges: () => Promise<void>;
  moveSection: (sectionId: string, direction: 'up' | 'down') => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [template, setTemplateState] = useState<TemplateContent | null>(null);
  const [selectedElement, setSelectedElement] = useState<SelectedElement | null>(null);
  const [previewDevice, setPreviewDevice] = useState<DeviceType>('desktop');
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  const setTemplate = (newTemplate: TemplateContent) => {
    setTemplateState(newTemplate);
    setSelectedElement(null);
  };

  const selectElement = (element: SelectedElement | null) => {
    setSelectedElement(element);
  };

  const updateSection = (sectionId: string, updates: Partial<Section>) => {
    if (!template) return;

    setTemplateState(prevTemplate => {
      if (!prevTemplate) return null;

      const updatedSections = prevTemplate.sections.map(section => 
        section.id === sectionId ? { ...section, ...updates } : section
      );

      return {
        ...prevTemplate,
        sections: updatedSections
      };
    });
  };

  const updateComponent = (sectionId: string, componentId: string, updates: Partial<Component>) => {
    if (!template) return;

    setTemplateState(prevTemplate => {
      if (!prevTemplate) return null;

      const updatedSections = prevTemplate.sections.map(section => {
        if (section.id !== sectionId) return section;

        const updatedComponents = section.components.map(component => 
          component.id === componentId ? { ...component, ...updates } : component
        );

        return {
          ...section,
          components: updatedComponents
        };
      });

      return {
        ...prevTemplate,
        sections: updatedSections
      };
    });
  };

  const updateGlobalStyles = (key: string, value: any) => {
    if (!template) return;

    setTemplateState(prevTemplate => {
      if (!prevTemplate) return null;

      return {
        ...prevTemplate,
        globalStyles: {
          ...prevTemplate.globalStyles,
          [key]: value
        }
      };
    });
  };

  const addSection = (section: Omit<Section, 'id'>) => {
    if (!template) return;

    const newSection: Section = {
      ...section,
      id: nanoid()
    };

    setTemplateState(prevTemplate => {
      if (!prevTemplate) return null;

      return {
        ...prevTemplate,
        sections: [...prevTemplate.sections, newSection]
      };
    });
  };

  const deleteSection = (sectionId: string) => {
    if (!template) return;

    setTemplateState(prevTemplate => {
      if (!prevTemplate) return null;

      return {
        ...prevTemplate,
        sections: prevTemplate.sections.filter(section => section.id !== sectionId)
      };
    });

    // If the deleted section was selected, clear selection
    if (selectedElement?.sectionId === sectionId) {
      setSelectedElement(null);
    }
  };

  const moveSection = (sectionId: string, direction: 'up' | 'down') => {
    if (!template) return;

    setTemplateState(prevTemplate => {
      if (!prevTemplate) return null;

      const sectionIndex = prevTemplate.sections.findIndex(section => section.id === sectionId);
      if (sectionIndex === -1) return prevTemplate;

      const newSections = [...prevTemplate.sections];
      
      if (direction === 'up' && sectionIndex > 0) {
        // Swap with the section above
        [newSections[sectionIndex], newSections[sectionIndex - 1]] = 
        [newSections[sectionIndex - 1], newSections[sectionIndex]];
      } else if (direction === 'down' && sectionIndex < newSections.length - 1) {
        // Swap with the section below
        [newSections[sectionIndex], newSections[sectionIndex + 1]] = 
        [newSections[sectionIndex + 1], newSections[sectionIndex]];
      } else {
        // No movement possible
        return prevTemplate;
      }

      return {
        ...prevTemplate,
        sections: newSections
      };
    });
  };

  const saveChanges = async () => {
    // In a real app, this would send the template to the server
    // For now, just update the last saved time
    setLastSaved(new Date().toLocaleTimeString());
    
    // Here we would make an API call to save the template
    // Example: await apiRequest('PUT', `/api/user-templates/${templateId}`, { content: template });
  };

  const value = {
    template,
    selectedElement,
    previewDevice,
    lastSaved,
    setTemplate,
    selectElement,
    updateSection,
    updateComponent,
    updateGlobalStyles,
    addSection,
    deleteSection,
    setPreviewDevice,
    saveChanges,
    moveSection,
  };

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};
