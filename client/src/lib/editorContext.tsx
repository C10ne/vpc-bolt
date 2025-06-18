import React, { createContext, useContext, useReducer, useState, useCallback, useMemo, ReactNode } from 'react';
import {
  Section as SchemaSection,
  Component as SchemaComponent,
  Element as SchemaElement,
  ComponentType as SchemaComponentType,
  Template as SchemaTemplate,
} from '@shared/schema';
import { EditorState as AppEditorState, Page, Section, Component, ComponentType, Template } from './types';
import { templates as staticTemplates } from './templates';

export interface EditorState extends AppEditorState {
  selectedItemRect: DOMRect | null;
  currentFocusedElementId: string | null;
  currentUserLevel: 'free' | 'pro'; // Added currentUserLevel
}

export interface ElementPath {
  sectionId: string;
  componentId: string;
  elementId: string;
}

type EditorAction = 
  | { type: 'SELECT_TEMPLATE'; payload: string }
  | { type: 'SELECT_SECTION'; payload: { sectionId: string | null; rect: DOMRect | null } }
  | { type: 'SELECT_COMPONENT'; payload: { sectionId: string; componentId: string | null; rect: DOMRect | null } }
  | { type: 'UPDATE_SECTION'; payload: SchemaSection }
  | { type: 'UPDATE_COMPONENT'; payload: { sectionId: string; component: SchemaComponent } }
  | { type: 'REPLACE_COMPONENT'; payload: { sectionId: string; componentId: string; newType: SchemaComponentType } }
  | { type: 'SET_ACTIVE_TOOL'; payload: string }
  | { type: 'SET_PREVIEW_DEVICE'; payload: 'desktop' | 'tablet' | 'mobile' }
  | { type: 'SAVE_PAGE' }
  | { type: 'HYDRATE_STATE'; payload: Page }
  | { type: 'DELETE_SELECTED_ITEM' }
  | { type: 'UPDATE_ELEMENT_CONTENT'; payload: { path: ElementPath; newContent: string; elementType: 'Paragraph' | 'RichText' } }
  | { type: 'TOGGLE_USER_LEVEL' }; // New action for toggling user level

const initialState: EditorState = {
  templates: [],
  currentPage: {
    templateId: '', name: '',
    globalSettings: { title: '', subtitle: '', metaDescription: '', logo: '', colorScheme: { primary: '#4361ee', secondary: '#3f37c9', accent: '#4cc9f0'}},
    sections: [],
  },
  templateSelected: false,
  selectedSection: null,
  selectedComponent: null,
  activeTool: 'sections',
  previewDevice: 'desktop',
  unsavedChanges: false,
  selectedItemRect: null,
  currentFocusedElementId: null,
  currentUserLevel: 'free', // Initialize currentUserLevel
};

function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    // ... (other cases remain the same)
    case 'SELECT_TEMPLATE': {
      const templateId = action.payload;
      const availableTemplates = state.templates?.length > 0 ? state.templates : (staticTemplates as unknown as Template[]);
      const template = availableTemplates.find(t => t.id === templateId);
      if (!template) { console.warn(`Template with id ${templateId} not found.`); return state; }
      const defaultPage = template.defaultPage as Page;
      return {...state, currentPage: defaultPage, templateSelected: true, selectedSection: null, selectedComponent: null, selectedItemRect: null, currentFocusedElementId: null, unsavedChanges: true };
    }
    case 'SELECT_SECTION': {
      const newFocusedId = action.payload.sectionId ? `section-${action.payload.sectionId}` : null;
      return {...state, selectedSection: action.payload.sectionId, selectedComponent: null, selectedItemRect: action.payload.rect, currentFocusedElementId: newFocusedId };
    }
    case 'SELECT_COMPONENT': {
      const newFocusedId = action.payload.componentId ? `component-${action.payload.sectionId}-${action.payload.componentId}` : (action.payload.sectionId ? `section-${action.payload.sectionId}` : null);
      return {...state, selectedSection: action.payload.sectionId, selectedComponent: action.payload.componentId, selectedItemRect: action.payload.rect, currentFocusedElementId: newFocusedId };
    }
    case 'UPDATE_SECTION': {
      const updatedSection = action.payload;
      return {...state, currentPage: {...state.currentPage, sections: state.currentPage.sections.map(s => (s as unknown as SchemaSection).id === updatedSection.id ? (updatedSection as unknown as Section) : s)}, unsavedChanges: true };
    }
    case 'UPDATE_COMPONENT': {
      const { sectionId: targetSectionId, component: updatedComponent } = action.payload;
      return {
        ...state,
        currentPage: {
          ...state.currentPage,
          sections: state.currentPage.sections.map(section => {
            if ((section as unknown as SchemaSection).id === targetSectionId) {
              return { ...section, components: section.components.map(c => (c as unknown as SchemaComponent).id === updatedComponent.id ? (updatedComponent as unknown as Component) : c)};
            }
            return section;
          }),
        },
        unsavedChanges: true,
      };
    }
    case 'REPLACE_COMPONENT': {
      const { sectionId, componentId, newType } = action.payload;
      let newCurrentPage = { ...state.currentPage };
      const sectionIndex = state.currentPage.sections.findIndex(s => (s as unknown as SchemaSection).id === sectionId);
      if (sectionIndex !== -1) {
        const targetSection = state.currentPage.sections[sectionIndex];
        const componentIndex = targetSection.components.findIndex(c => (c as unknown as SchemaComponent).id === componentId);
        if (componentIndex !== -1) {
          const oldComponent = targetSection.components[componentIndex] as unknown as SchemaComponent;
          if (oldComponent.editable === 'locked-replacing') { console.warn("Component is locked for replacing."); return state; }
          const newComponentData: SchemaComponent = { id: oldComponent.id, type: newType, elements: [], editable: 'editable', parameters: {}, swappableWith: oldComponent.swappableWith };
          const updatedComponents = [...targetSection.components];
          updatedComponents[componentIndex] = newComponentData as unknown as Component;
          newCurrentPage.sections = [...state.currentPage.sections.slice(0, sectionIndex), { ...targetSection, components: updatedComponents }, ...state.currentPage.sections.slice(sectionIndex + 1)];
          return {...state, currentPage: newCurrentPage, selectedItemRect: null, currentFocusedElementId: `component-${sectionId}-${newComponentData.id}`, unsavedChanges: true };
        }
      }
      return state;
    }
    case 'DELETE_SELECTED_ITEM': {
      if (!state.currentFocusedElementId || !state.currentPage) return state;
      const id = state.currentFocusedElementId;
      let newSections = [...state.currentPage.sections];
      if (id.startsWith('section-')) {
        const sectionIdStr = id.split('-')[1];
        const sectionToDelete = newSections.find(s => (s as unknown as SchemaSection).id === sectionIdStr);
        if (sectionToDelete && (sectionToDelete as unknown as SchemaSection).editable === 'locked-edit') { console.warn(`Section "${sectionToDelete.name}" is locked.`); return state; }
        newSections = newSections.filter(s => (s as unknown as SchemaSection).id !== sectionIdStr);
      } else if (id.startsWith('component-')) {
        const [, sectionIdStr, componentIdStr] = id.split('-');
        const sectionIndex = newSections.findIndex(s => (s as unknown as SchemaSection).id === sectionIdStr);
        if (sectionIndex !== -1) {
          const parentSection = newSections[sectionIndex] as unknown as SchemaSection;
          const componentToDelete = parentSection.components.find(c => (c as unknown as SchemaComponent).id === componentIdStr);
          if (componentToDelete) {
            if ((componentToDelete as unknown as SchemaComponent).editable === 'locked-edit' || parentSection.editable === 'locked-replacing') { console.warn(`Component or parent section is locked.`); return state; }
            const updatedComponents = parentSection.components.filter(c => (c as unknown as SchemaComponent).id !== componentIdStr);
            newSections[sectionIndex] = { ...parentSection, components: updatedComponents } as unknown as Section;
          }
        }
      } else if (id.startsWith('element-')) { console.warn('Delete for individual elements from QuickEditBar not fully implemented.'); return state; }
      else { return state; }
      return {...state, currentPage: { ...state.currentPage, sections: newSections }, currentFocusedElementId: null, selectedItemRect: null, selectedSection: null, selectedComponent: null, unsavedChanges: true };
    }
    case 'UPDATE_ELEMENT_CONTENT': {
      if (!state.currentPage) return state;
      const { path, newContent, elementType } = action.payload;
      const newCurrentPage = JSON.parse(JSON.stringify(state.currentPage)) as Page;
      const section = (newCurrentPage.sections as unknown as SchemaSection[]).find(s => s.id === path.sectionId);
      if (section) {
        const component = section.components.find(c => c.id === path.componentId);
        if (component) {
          const element = component.elements.find(e => e.id === path.elementId);
          if (element) {
            if (!element.properties) element.properties = {};
            if (elementType === 'Paragraph') { element.properties.text = newContent; }
            else if (elementType === 'RichText') { element.properties.htmlContent = newContent; }
          }
        }
      }
      return { ...state, currentPage: newCurrentPage, unsavedChanges: true };
    }
    case 'TOGGLE_USER_LEVEL': // New case
      return {
        ...state,
        currentUserLevel: state.currentUserLevel === 'free' ? 'pro' : 'free',
        // unsavedChanges: true, // Decide if this action marks changes; typically not for user meta state
      };
    case 'SET_ACTIVE_TOOL': return { ...state, activeTool: action.payload };
    case 'SET_PREVIEW_DEVICE': return { ...state, previewDevice: action.payload };
    case 'SAVE_PAGE': return { ...state, unsavedChanges: false };
    case 'HYDRATE_STATE':
      return {...state, currentPage: action.payload, templateSelected: true, unsavedChanges: false, selectedSection: null, selectedComponent: null, selectedItemRect: null, currentFocusedElementId: null };
    default:
      return state;
  }
}

export interface EditorContextType {
  state: EditorState; // This will include currentUserLevel
  selectTemplate: (templateId: string) => void;
  selectSection: (sectionId: string | null, domNode: HTMLElement | null) => void;
  selectComponent: (sectionId: string, componentId: string | null, domNode: HTMLElement | null) => void;
  updateSection: (sectionId: string, updates: Partial<SchemaSection>) => void;
  updateComponent: (sectionId: string, componentId: string, updates: Partial<SchemaComponent>) => void;
  replaceComponent: (sectionId: string, componentId: string, newType: SchemaComponentType) => void;
  deleteSelectedItem: () => void;
  updateElementContent: (path: ElementPath, newContent: string, elementType: 'Paragraph' | 'RichText') => void;
  toggleUserLevel: () => void; // Added toggleUserLevel
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
  
  const selectTemplate = useCallback((templateId: string) => dispatch({ type: 'SELECT_TEMPLATE', payload: templateId }), []);
  const selectSection = useCallback((sectionId: string | null, domNode: HTMLElement | null) => {
    const rect = domNode ? domNode.getBoundingClientRect() : null;
    dispatch({ type: 'SELECT_SECTION', payload: { sectionId, rect } });
  }, []);
  const selectComponent = useCallback((sectionId: string, componentId: string | null, domNode: HTMLElement | null) => {
    const rect = domNode ? domNode.getBoundingClientRect() : null;
    dispatch({ type: 'SELECT_COMPONENT', payload: { sectionId, componentId, rect } });
  }, []);
  
  const updateSection = useCallback((sectionId: string, updates: Partial<SchemaSection>) => {
    const currentSection = state.currentPage.sections.find(s => (s as unknown as SchemaSection).id === sectionId);
    if (!currentSection) return;
    const updatedProperties = updates.properties ? { ...currentSection.properties, ...updates.properties } : currentSection.properties;
    const updatedSectionData = { ...(currentSection as unknown as SchemaSection), ...updates, properties: updatedProperties };
    dispatch({ type: 'UPDATE_SECTION', payload: updatedSectionData });
  }, [state.currentPage.sections]);
  
  const updateComponent = useCallback((sectionId: string, componentId: string, updates: Partial<SchemaComponent>) => {
    const section = state.currentPage.sections.find(s => (s as unknown as SchemaSection).id === sectionId);
    if (!section) return;
    const component = section.components.find(c => (c as unknown as SchemaComponent).id === componentId);
    if (!component) return;
    const updatedComponentData = { ...(component as unknown as SchemaComponent), ...updates };
    dispatch({ type: 'UPDATE_COMPONENT', payload: { sectionId, component: updatedComponentData } });
  }, [state.currentPage.sections]);

  const updateElementContent = useCallback((path: ElementPath, newContent: string, elementType: 'Paragraph' | 'RichText') => {
    dispatch({ type: 'UPDATE_ELEMENT_CONTENT', payload: { path, newContent, elementType } });
  }, []);
  
  const replaceComponent = useCallback((sectionId: string, componentId: string, newType: SchemaComponentType) => dispatch({ type: 'REPLACE_COMPONENT', payload: { sectionId, componentId, newType } }), []);
  const deleteSelectedItem = useCallback(() => dispatch({ type: 'DELETE_SELECTED_ITEM' }), []);
  const toggleUserLevel = useCallback(() => dispatch({ type: 'TOGGLE_USER_LEVEL' }), []); // Added
  const setActiveTool = useCallback((tool: string) => dispatch({ type: 'SET_ACTIVE_TOOL', payload: tool }), []);
  const setPreviewDevice = useCallback((device: 'desktop' | 'tablet' | 'mobile') => dispatch({ type: 'SET_PREVIEW_DEVICE', payload: device }), []);
  const savePage = useCallback(() => dispatch({ type: 'SAVE_PAGE' }), []);
  const clearSelectedSection = useCallback(() => dispatch({ type: 'SELECT_SECTION', payload: { sectionId: null, rect: null } }), []);
  
  const legacyUpdateComponentContent = useCallback((key: string, value: any) => {
    const { selectedSection: selSectionId, selectedComponent: selCompId, currentPage } = state;
    if (!selSectionId || !selCompId) return;
    const section = currentPage.sections.find(s => s.id === selSectionId);
    if (!section) return;
    const componentToUpdate = section.components.find(c => c.id === selCompId);
    if (!componentToUpdate || (componentToUpdate as unknown as SchemaComponent).editable === 'locked-edit') return;
    const schemaComp = componentToUpdate as unknown as SchemaComponent;
    const updatedComp: SchemaComponent = { ...schemaComp, properties: { ...(schemaComp.properties || {}), [key]: value }};
    dispatch({ type: 'UPDATE_COMPONENT', payload: { sectionId: selSectionId, component: updatedComp } });
  }, [state]);
  
  const togglePreviewMode = useCallback(() => setPreviewMode(prev => !prev), []);
  const hydrateState = useCallback((page: Page) => dispatch({ type: 'HYDRATE_STATE', payload: page }), []);
  
  const contextValue = useMemo(() => ({
    state, selectTemplate, selectSection, selectComponent, updateSection, updateComponent,
    replaceComponent, deleteSelectedItem, updateElementContent, toggleUserLevel, // Added toggleUserLevel
    setActiveTool, setPreviewDevice, savePage, clearSelectedSection,
    updateComponentContent: legacyUpdateComponentContent,
    previewMode, togglePreviewMode, hydrateState,
  }), [
    state, selectTemplate, selectSection, selectComponent, updateSection, updateComponent,
    replaceComponent, deleteSelectedItem, updateElementContent, toggleUserLevel, // Added toggleUserLevel
    setActiveTool, setPreviewDevice, savePage, clearSelectedSection,
    legacyUpdateComponentContent, previewMode, togglePreviewMode, hydrateState,
  ]);
  
  return <EditorContext.Provider value={contextValue}>{children}</EditorContext.Provider>;
}

export function useEditor() {
  const context = useContext(EditorContext);
  if (context === undefined) throw new Error('useEditor must be used within an EditorProvider');
  return context;
}
