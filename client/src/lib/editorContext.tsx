import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type { Template } from '@shared/schema';

interface EditorState {
  currentTemplate: Template | null;
  selectedSection: string | null;
  selectedComponent: string | null;
  selectedElement: string | null;
  previewMode: boolean;
  deviceMode: 'desktop' | 'tablet' | 'mobile';
  isLoading: boolean;
  error: string | null;
}

type EditorAction =
  | { type: 'LOAD_TEMPLATE'; payload: Template }
  | { type: 'SELECT_SECTION'; payload: string | null }
  | { type: 'SELECT_COMPONENT'; payload: string | null }
  | { type: 'SELECT_ELEMENT'; payload: string | null }
  | { type: 'TOGGLE_PREVIEW_MODE' }
  | { type: 'SET_DEVICE_MODE'; payload: 'desktop' | 'tablet' | 'mobile' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: EditorState = {
  currentTemplate: null,
  selectedSection: null,
  selectedComponent: null,
  selectedElement: null,
  previewMode: false,
  deviceMode: 'desktop',
  isLoading: false,
  error: null,
};

function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'LOAD_TEMPLATE':
      return {
        ...state,
        currentTemplate: action.payload,
        selectedSection: null,
        selectedComponent: null,
        selectedElement: null,
        error: null,
      };
    case 'SELECT_SECTION':
      return {
        ...state,
        selectedSection: action.payload,
        selectedComponent: null,
        selectedElement: null,
      };
    case 'SELECT_COMPONENT':
      return {
        ...state,
        selectedComponent: action.payload,
        selectedElement: null,
      };
    case 'SELECT_ELEMENT':
      return {
        ...state,
        selectedElement: action.payload,
      };
    case 'TOGGLE_PREVIEW_MODE':
      return {
        ...state,
        previewMode: !state.previewMode,
        selectedSection: null,
        selectedComponent: null,
        selectedElement: null,
      };
    case 'SET_DEVICE_MODE':
      return {
        ...state,
        deviceMode: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    default:
      return state;
  }
}

interface EditorContextType {
  state: EditorState;
  loadTemplate: (template: Template) => void;
  selectSection: (sectionId: string | null) => void;
  selectComponent: (componentId: string | null) => void;
  selectElement: (elementId: string | null) => void;
  togglePreviewMode: () => void;
  setDeviceMode: (mode: 'desktop' | 'tablet' | 'mobile') => void;
  savePage: () => Promise<void>;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(editorReducer, initialState);

  const loadTemplate = useCallback((template: Template) => {
    dispatch({ type: 'LOAD_TEMPLATE', payload: template });
  }, []);

  const selectSection = useCallback((sectionId: string | null) => {
    dispatch({ type: 'SELECT_SECTION', payload: sectionId });
  }, []);

  const selectComponent = useCallback((componentId: string | null) => {
    dispatch({ type: 'SELECT_COMPONENT', payload: componentId });
  }, []);

  const selectElement = useCallback((elementId: string | null) => {
    dispatch({ type: 'SELECT_ELEMENT', payload: elementId });
  }, []);

  const togglePreviewMode = useCallback(() => {
    dispatch({ type: 'TOGGLE_PREVIEW_MODE' });
  }, []);

  const setDeviceMode = useCallback((mode: 'desktop' | 'tablet' | 'mobile') => {
    dispatch({ type: 'SET_DEVICE_MODE', payload: mode });
  }, []);

  const savePage = useCallback(async () => {
    if (!state.currentTemplate) return;
    
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Implementation for saving the template/project
      // This would make an API call to save the current state
      console.log('Saving template:', state.currentTemplate);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to save template' });
    }
  }, [state.currentTemplate]);

  const value: EditorContextType = {
    state,
    loadTemplate,
    selectSection,
    selectComponent,
    selectElement,
    togglePreviewMode,
    setDeviceMode,
    savePage,
  };

  return (
    <EditorContext.Provider value={value}>
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