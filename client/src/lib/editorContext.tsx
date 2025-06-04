import React, { createContext, useContext, useReducer, useState, useCallback, useMemo, ReactNode } from 'react';
import { EditorState, Page, Section, Component, ComponentType, Template } from './types';
import { templates } from './templates';
import { v4 as uuidv4 } from 'uuid';

type EditorAction = 
  | { type: 'SELECT_TEMPLATE'; payload: string }
  | { type: 'SELECT_SECTION'; payload: string | null }
  | { type: 'SELECT_COMPONENT'; payload: { sectionId: string; componentId: string | null } }
  | { type: 'UPDATE_SECTION'; payload: Section }
  | { type: 'UPDATE_COMPONENT'; payload: Component }
  | { type: 'REPLACE_COMPONENT'; payload: { sectionId: string; componentId: string; newType: ComponentType } }
  | { type: 'SET_ACTIVE_TOOL'; payload: string }
  | { type: 'SET_PREVIEW_DEVICE'; payload: 'desktop' | 'tablet' | 'mobile' }
  | { type: 'SAVE_PAGE' }
  | { type: 'HYDRATE_STATE'; payload: Page };

const initialState: EditorState = {
  templates,
  currentPage: {
    templateId: '',
    name: '',
    globalSettings: {
      title: '',
      subtitle: '',
      metaDescription: '',
      logo: '',
      colorScheme: {
        primary: '#4361ee',
        secondary: '#3f37c9',
        accent: '#4cc9f0',
      },
    },
    sections: [],
  },
  templateSelected: false,
  selectedSection: null,
  selectedComponent: null,
  activeTool: 'sections',
  previewDevice: 'desktop',
  unsavedChanges: false,
};

function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'SELECT_TEMPLATE': {
      const templateId = action.payload;
      const template = state.templates.find(t => t.id === templateId);
      
      if (!template) {
        return state;
      }
      
      return {
        ...state,
        currentPage: { ...template.defaultPage },
        templateSelected: true,
        selectedSection: null,
        selectedComponent: null,
        unsavedChanges: true,
      };
    }
    
    case 'SELECT_SECTION': {
      return {
        ...state,
        selectedSection: action.payload,
        selectedComponent: null,
      };
    }
    
    case 'SELECT_COMPONENT': {
      const { sectionId, componentId } = action.payload;
      
      return {
        ...state,
        selectedSection: sectionId,
        selectedComponent: componentId,
      };
    }
    
    case 'UPDATE_SECTION': {
      const updatedSection = action.payload;
      
      return {
        ...state,
        currentPage: {
          ...state.currentPage,
          sections: state.currentPage.sections.map(section => 
            section.id === updatedSection.id ? updatedSection : section
          ),
        },
        unsavedChanges: true,
      };
    }
    
    case 'UPDATE_COMPONENT': {
      const updatedComponent = action.payload;
      
      return {
        ...state,
        currentPage: {
          ...state.currentPage,
          sections: state.currentPage.sections.map(section => 
            section.id === state.selectedSection 
              ? {
                  ...section,
                  components: section.components.map(component => 
                    component.id === updatedComponent.id ? updatedComponent : component
                  ),
                }
              : section
          ),
        },
        unsavedChanges: true,
      };
    }
    
    case 'REPLACE_COMPONENT': {
      const { sectionId, componentId, newType } = action.payload;
      const section = state.currentPage.sections.find(s => s.id === sectionId);
      
      if (!section) {
        return state;
      }
      
      const oldComponent = section.components.find(c => c.id === componentId);
      
      if (!oldComponent || oldComponent.replacingLocked) {
        return state;
      }
      
      // Get default component of new type
      const template = state.templates.find(t => t.id === state.currentPage.templateId);
      
      if (!template) {
        return state;
      }
      
      // Create a new component with default values for the new type
      console.log(`Creating new ${newType} component to replace ${oldComponent.type}`);
      
      // Default content based on component type
      let defaultContent = {};
      
      if (newType === 'hero-image') {
        defaultContent = {
          title: "Welcome to our website",
          subtitle: "Discover our amazing services and products",
          buttonText: "Learn More",
          backgroundImage: "https://images.unsplash.com/photo-1504805572947-34fad45aed93?w=800&auto=format&fit=crop"
        };
      } else if (newType === 'video-hero') {
        defaultContent = {
          title: "Watch Our Story",
          subtitle: "See how we're changing the industry",
          buttonText: "Watch Video",
          videoUrl: "https://example.com/video.mp4"
        };
      } else if (newType === 'features') {
        defaultContent = {
          features: [
            { icon: "lightbulb", title: "Creative Solutions", description: "Innovative ideas for your business" },
            { icon: "speed", title: "Fast Performance", description: "Optimized for speed and efficiency" },
            { icon: "security", title: "Secure & Reliable", description: "Your data is safe with us" }
          ]
        };
      } else if (newType === 'testimonials') {
        defaultContent = {
          testimonials: [
            { 
              image: "https://randomuser.me/api/portraits/women/17.jpg",
              name: "Sarah Johnson", 
              position: "CEO, TechStart", 
              quote: "Working with this team has been an amazing experience. They delivered beyond our expectations.", 
              rating: 5 
            },
            { 
              image: "https://randomuser.me/api/portraits/men/32.jpg",
              name: "Michael Chen", 
              position: "Marketing Director", 
              quote: "The quality of work is outstanding. I would recommend them to anyone looking for excellence.", 
              rating: 4 
            }
          ]
        };
      }
      
      const newComponent: Component = {
        id: oldComponent.id, // Keep the same ID
        type: newType,
        content: defaultContent,
        styleOptions: {
          textColor: "#ffffff",
          backgroundColor: "#ffffff",
          overlayColor: "linear-gradient(90deg, rgba(0,0,0,0.5) 0%, transparent 100%)",
          buttonStyle: 'primary'
        },
        replacingLocked: oldComponent.replacingLocked,
        editingLocked: oldComponent.editingLocked,
      };
      
      console.log("New component created:", newComponent);
      
      return {
        ...state,
        currentPage: {
          ...state.currentPage,
          sections: state.currentPage.sections.map(section => 
            section.id === sectionId 
              ? {
                  ...section,
                  components: section.components.map(component => 
                    component.id === componentId ? newComponent : component
                  ),
                }
              : section
          ),
        },
        unsavedChanges: true,
      };
    }
    
    case 'SET_ACTIVE_TOOL': {
      return {
        ...state,
        activeTool: action.payload,
      };
    }
    
    case 'SET_PREVIEW_DEVICE': {
      return {
        ...state,
        previewDevice: action.payload,
      };
    }
    
    case 'SAVE_PAGE': {
      return {
        ...state,
        unsavedChanges: false,
      };
    }
    
    case 'HYDRATE_STATE': {
      return {
        ...state,
        currentPage: action.payload,
        templateSelected: true,
        unsavedChanges: false,
      };
    }
    
    default:
      return state;
  }
}

type EditorContextType = {
  state: EditorState;
  selectTemplate: (templateId: string) => void;
  selectSection: (sectionId: string | null) => void;
  selectComponent: (sectionId: string, componentId: string | null) => void;
  updateSection: (sectionId: string, updates: Partial<Section>) => void;
  updateComponent: (sectionId: string, componentId: string, updates: Partial<Component>) => void;
  replaceComponent: (sectionId: string, componentId: string, newType: ComponentType) => void;
  setActiveTool: (tool: string) => void;
  setPreviewDevice: (device: 'desktop' | 'tablet' | 'mobile') => void;
  savePage: () => void;
  clearSelectedSection: () => void;
  updateComponentContent: (key: string, value: any) => void;
  previewMode: boolean;
  togglePreviewMode: () => void;
  hydrateState: (page: Page) => void;
};

const EditorContext = createContext<EditorContextType | undefined>(undefined);

type EditorProviderProps = {
  children: ReactNode;
};

export function EditorProvider({ children }: EditorProviderProps) {
  const [state, dispatch] = useReducer(editorReducer, initialState);
  const [previewMode, setPreviewMode] = useState(false);
  
  const selectTemplate = useCallback((templateId: string) => {
    dispatch({ type: 'SELECT_TEMPLATE', payload: templateId });
  }, []);
  
  const selectSection = useCallback((sectionId: string | null) => {
    dispatch({ type: 'SELECT_SECTION', payload: sectionId });
  }, []);
  
  const selectComponent = useCallback((sectionId: string, componentId: string | null) => {
    dispatch({ 
      type: 'SELECT_COMPONENT', 
      payload: { sectionId, componentId } 
    });
  }, []);
  
  const updateSection = useCallback((sectionId: string, updates: Partial<Section>) => {
    // Find the current section and merge in the updates
    const currentSection = state.currentPage.sections.find(section => section.id === sectionId);
    if (!currentSection) return;
    
    // Handle nested property updates
    let updatedProperties = currentSection.properties;
    if (updates.properties) {
      updatedProperties = { 
        ...currentSection.properties,
        ...updates.properties
      };
      
      // Handle nested padding property specially
      if (updates.properties.padding) {
        updatedProperties.padding = {
          ...currentSection.properties?.padding,
          ...updates.properties.padding
        };
      }
    }
    
    // Create updated section with deep-merged properties
    const updatedSection = { 
      ...currentSection,
      ...updates,
      properties: updatedProperties
    };
    
    console.log('Updating section with properties:', updatedProperties);
    dispatch({ type: 'UPDATE_SECTION', payload: updatedSection });
  }, [state.currentPage.sections]);
  
  const updateComponent = useCallback((sectionId: string, componentId: string, updates: Partial<Component>) => {
    // Find the current section and component
    const section = state.currentPage.sections.find(section => section.id === sectionId);
    if (!section) return;
    
    const component = section.components.find(comp => comp.id === componentId);
    if (!component) return;
    
    // Deep merge component content
    let updatedContent = component.content;
    if (updates.content) {
      updatedContent = { ...component.content, ...updates.content };
      
      // Handle nested content fields (if any)
      for (const key in updates.content) {
        if (typeof updates.content[key] === 'object' && updates.content[key] !== null) {
          updatedContent[key] = {
            ...component.content[key],
            ...updates.content[key]
          };
        }
      }
    }
    
    // Deep merge style options
    let updatedStyleOptions = component.styleOptions;
    if (updates.styleOptions) {
      updatedStyleOptions = { 
        ...component.styleOptions,
        ...updates.styleOptions 
      };
    }
    
    // Create the updated component
    const updatedComponent = {
      ...component,
      ...updates,
      content: updates.content ? updatedContent : component.content,
      styleOptions: updates.styleOptions ? updatedStyleOptions : component.styleOptions
    };
    
    console.log('Updating component with content:', updatedContent);
    dispatch({ type: 'UPDATE_COMPONENT', payload: updatedComponent });
  }, [state.currentPage.sections]);
  
  const replaceComponent = useCallback((sectionId: string, componentId: string, newType: ComponentType) => {
    dispatch({ 
      type: 'REPLACE_COMPONENT', 
      payload: { sectionId, componentId, newType } 
    });
  }, []);
  
  const setActiveTool = useCallback((tool: string) => {
    dispatch({ type: 'SET_ACTIVE_TOOL', payload: tool });
  }, []);
  
  const setPreviewDevice = useCallback((device: 'desktop' | 'tablet' | 'mobile') => {
    dispatch({ type: 'SET_PREVIEW_DEVICE', payload: device });
  }, []);
  
  const savePage = useCallback(() => {
    dispatch({ type: 'SAVE_PAGE' });
  }, []);
  
  const clearSelectedSection = useCallback(() => {
    dispatch({ type: 'SELECT_SECTION', payload: null });
  }, []);
  
  const updateComponentContent = useCallback((key: string, value: any) => {
    const { selectedSection, selectedComponent, currentPage } = state;
    
    if (!selectedSection || !selectedComponent) return;
    
    const section = currentPage.sections.find(s => s.id === selectedSection);
    if (!section) return;
    
    const component = section.components.find(c => c.id === selectedComponent);
    if (!component || component.editingLocked) return;
    
    const updatedComponent = {
      ...component,
      content: {
        ...component.content,
        [key]: value
      }
    };
    
    dispatch({ type: 'UPDATE_COMPONENT', payload: updatedComponent });
  }, [state]);
  
  const togglePreviewMode = useCallback(() => {
    setPreviewMode(prev => !prev);
  }, []);
  
  const hydrateState = useCallback((page: Page) => {
    dispatch({ type: 'HYDRATE_STATE', payload: page });
  }, []);
  
  const contextValue = useMemo(() => ({
    state,
    selectTemplate,
    selectSection,
    selectComponent,
    updateSection,
    updateComponent,
    replaceComponent,
    setActiveTool,
    setPreviewDevice,
    savePage,
    clearSelectedSection,
    updateComponentContent,
    previewMode,
    togglePreviewMode,
    hydrateState,
  }), [
    state, 
    selectTemplate, 
    selectSection, 
    selectComponent, 
    updateSection, 
    updateComponent, 
    replaceComponent, 
    setActiveTool, 
    setPreviewDevice, 
    savePage, 
    clearSelectedSection, 
    updateComponentContent, 
    previewMode, 
    togglePreviewMode,
    hydrateState
  ]);
  
  return (
    <EditorContext.Provider value={contextValue}>
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const context = useContext(EditorContext);
  
  if (context === undefined) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  
  return context;
}
