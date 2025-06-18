import React, { createContext, useContext, useReducer, useState, useCallback, useMemo, ReactNode } from 'react';
import {
  Section as SchemaSection,
  Component as SchemaComponent,
  Element as SchemaElement,
  ComponentType as SchemaComponentType,
  Template as SchemaTemplate,
  ElementType as SchemaElementType, // For mapping
} from '@shared/schema';
import { EditorState as AppEditorState, Page, Section, Component, ComponentType, Template, ComponentContent, ElementType as ClientElementType } from './types'; // Added ComponentContent and ClientElementType
import { templates as staticTemplates } from './templates';
import { v4 as uuidv4 } from 'uuid';
import { componentDefinitions } from '@/lib/components/definitions';
import { createElementBasedComponent } from '@/lib/types';
import { elementRegistry } from '@/lib/elements/ElementRegistry'; // For adding elements

export interface EditorState extends AppEditorState {
  selectedItemRect: DOMRect | null;
  currentFocusedElementId: string | null;
  currentUserLevel: 'free' | 'pro';
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
  | { type: 'UPDATE_ELEMENT_CONTENT'; payload: { path: ElementPath; newContent: string; elementType: 'Paragraph' | 'RichText' } } // Specific content update
  | { type: 'UPDATE_ELEMENT_PROPERTIES'; payload: { path: ElementPath; properties: Record<string, any> } } // Generic properties update
  | { type: 'UPDATE_COMPONENT_PROPERTIES'; payload: { sectionId: string; componentId: string; properties: Record<string, any> } } // For component's own direct properties (e.g. styleOptions)
  | { type: 'UPDATE_SECTION_PROPERTIES'; payload: { sectionId: string; properties: Partial<Omit<SchemaSection, 'id' | 'components'>> } } // For section's own properties
  | { type: 'UPDATE_PAGE_PROPERTIES'; payload: Partial<Omit<Page, 'id' | 'sections' | 'templateId'>> } // For page-level properties (name, globalSettings)
  | { type: 'ADD_COMPONENT_TO_SECTION'; payload: { sectionId: string; componentType: SchemaComponentType } }
  | { type: 'DELETE_COMPONENT_FROM_SECTION'; payload: { sectionId: string; componentId: string } }
  | { type: 'REORDER_COMPONENT_IN_SECTION'; payload: { sectionId: string; componentId: string; direction: 'up' | 'down' } }
  | { type: 'ADD_ELEMENT_TO_COMPONENT'; payload: { sectionId: string; componentId: string; elementType: ClientElementType } }
  | { type: 'DELETE_ELEMENT_FROM_COMPONENT'; payload: { path: ElementPath } }
  | { type: 'REORDER_ELEMENT_IN_COMPONENT'; payload: { path: ElementPath; direction: 'up' | 'down' } }
  | { type: 'ADD_SECTION_TO_PAGE'; payload: { sectionName: string; sectionType?: string } }
  | { type: 'DELETE_SECTION_FROM_PAGE'; payload: { sectionId: string } }
  | { type: 'REORDER_SECTION_IN_PAGE'; payload: { sectionId: string; direction: 'up' | 'down' } }
  | { type: 'TOGGLE_USER_LEVEL' };

const initialPageData: Page = {
  templateId: `blank-${uuidv4()}`,
  id: uuidv4(),
  name: 'New Page',
  globalSettings: {
    title: 'New Page',
    subtitle: '',
    metaDescription: '',
    logo: '',
    colorScheme: { primary: '#4361ee', secondary: '#3f37c9', accent: '#4cc9f0'}
  },
  sections: [],
};

const initialState: EditorState = {
  templates: [],
  currentPage: initialPageData,
  templateSelected: false,
  selectedSection: null,
  selectedComponent: null,
  activeTool: 'sections',
  previewDevice: 'desktop',
  unsavedChanges: false,
  selectedItemRect: null,
  currentFocusedElementId: null,
  currentUserLevel: 'free',
};

function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'SELECT_TEMPLATE': {
      const templateId = action.payload;
      const availableTemplates = state.templates?.length > 0 ? state.templates : (staticTemplates as unknown as Template[]);
      const selectedEditorTemplate = availableTemplates.find(t => t.id === templateId);

      let pageToLoad: Page;

      if (selectedEditorTemplate && selectedEditorTemplate.defaultPage) {
        const defaultPageFromTemplate = selectedEditorTemplate.defaultPage as Page;
        pageToLoad = {
          id: defaultPageFromTemplate.id || uuidv4(),
          name: defaultPageFromTemplate.name || selectedEditorTemplate.name || "Untitled Page",
          templateId: selectedEditorTemplate.id,
          sections: defaultPageFromTemplate.sections || [],
          globalSettings: defaultPageFromTemplate.globalSettings ||
                          initialPageData.globalSettings,
        };
      } else {
        pageToLoad = {
          ...initialPageData,
          id: uuidv4(),
          name: selectedEditorTemplate?.name || "New Blank Page",
          templateId: selectedEditorTemplate?.id || `blank-${uuidv4()}`,
        };
        if (selectedEditorTemplate) {
          console.warn(`Template "${selectedEditorTemplate.name}" does not have a valid defaultPage structure or defaultPage is missing. Loading a blank page.`);
        } else {
          console.warn(`Template with id "${templateId}" not found. Loading a blank page.`);
        }
      }

      return {
        ...state,
        currentPage: pageToLoad,
        templateSelected: true,
        selectedSection: null,
        selectedComponent: null,
        currentFocusedElementId: null,
        selectedItemRect: null,
        unsavedChanges: false,
      };
    }
    // ... (rest of the reducer cases from turn 46, ensuring guards and string ID logic are preserved) ...
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
      if (!state.currentPage?.sections) return state;
      return {...state, currentPage: {...state.currentPage, sections: state.currentPage.sections.map(s => (s as unknown as SchemaSection).id === updatedSection.id ? (updatedSection as unknown as Section) : s)}, unsavedChanges: true };
    }
    case 'UPDATE_COMPONENT': {
      const { sectionId: targetSectionId, component: updatedComponent } = action.payload;
      if (!state.currentPage?.sections) return state;
      return {
        ...state,
        currentPage: {
          ...state.currentPage,
          sections: state.currentPage.sections.map(section => {
            if ((section as unknown as SchemaSection).id === targetSectionId) {
              if (!section.components) return section;
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
      if (!state.currentPage?.sections) return state;
      let newCurrentPage = { ...state.currentPage };
      const sectionIndex = state.currentPage.sections.findIndex(s => (s as unknown as SchemaSection).id === sectionId);
      if (sectionIndex !== -1) {
        const targetSection = state.currentPage.sections[sectionIndex];
        if (!targetSection.components) return state;
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
      if (!state.currentFocusedElementId || !state.currentPage || !state.currentPage.sections) return state;
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
          if (!parentSection.components) return state;
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
      if (!state.currentPage?.sections) return state;
      const { path, newContent, elementType } = action.payload;
      const newCurrentPage = JSON.parse(JSON.stringify(state.currentPage)) as Page; // Deep copy
      const section = (newCurrentPage.sections as unknown as SchemaSection[]).find(s => s.id === path.sectionId);
      if (section && section.components) {
        const component = section.components.find(c => c.id === path.componentId);
        if (component && component.elements) {
          const element = component.elements.find(e => e.id === path.elementId);
          if (element) {
            if (!element.properties) element.properties = {};
            // This is specific to text/html content, might be better handled by UPDATE_ELEMENT_PROPERTIES
            if (elementType === 'Paragraph') { element.properties.text = newContent; }
            else if (elementType === 'RichText') { element.properties.htmlContent = newContent; }
          }
        }
      }
      return { ...state, currentPage: newCurrentPage, unsavedChanges: true };
    }
    case 'UPDATE_ELEMENT_PROPERTIES': {
      if (!state.currentPage?.sections) return state;
      const { path, properties } = action.payload;
      const newCurrentPage = JSON.parse(JSON.stringify(state.currentPage)) as Page; // Deep copy
      const section = (newCurrentPage.sections as unknown as SchemaSection[]).find(s => s.id === path.sectionId);
      if (section && section.components) {
        const component = section.components.find(c => c.id === path.componentId);
        if (component && component.elements) {
          const elementIndex = component.elements.findIndex(e => e.id === path.elementId);
          if (elementIndex !== -1) {
            const currentElement = component.elements[elementIndex];
            component.elements[elementIndex] = {
              ...currentElement,
              properties: properties // Overwrite all properties
            };
          }
        }
      }
      return { ...state, currentPage: newCurrentPage, unsavedChanges: true };
    }
    case 'UPDATE_COMPONENT_PROPERTIES': {
        if (!state.currentPage?.sections) return state;
        const { sectionId, componentId, properties } = action.payload;
        const newCurrentPage = JSON.parse(JSON.stringify(state.currentPage)) as Page;
        const section = (newCurrentPage.sections as unknown as SchemaSection[]).find(s => s.id === sectionId);
        if (section && section.components) {
            const componentIndex = section.components.findIndex(c => c.id === componentId);
            if (componentIndex !== -1) {
                const currentComponent = section.components[componentIndex];
                // Assuming properties here means top-level component fields like 'styleOptions' or 'content' (for classic components)
                // SchemaComponent properties field is for parameters, this needs careful handling.
                // For now, let's assume this updates fields on the Component object itself, not SchemaComponent.parameters
                section.components[componentIndex] = {
                    ...currentComponent,
                    ...properties // Spread the new properties onto the component
                };
            }
        }
        return { ...state, currentPage: newCurrentPage, unsavedChanges: true };
    }
    case 'UPDATE_SECTION_PROPERTIES': {
        if (!state.currentPage?.sections) return state;
        const { sectionId, properties } = action.payload;
        const newCurrentPage = JSON.parse(JSON.stringify(state.currentPage)) as Page;
        const sectionIndex = (newCurrentPage.sections as unknown as SchemaSection[]).findIndex(s => s.id === sectionId);
        if (sectionIndex !== -1) {
            const currentSection = newCurrentPage.sections[sectionIndex];
            newCurrentPage.sections[sectionIndex] = {
                ...currentSection,
                ...properties // Spread the new properties onto the section
            };
        }
        return { ...state, currentPage: newCurrentPage, unsavedChanges: true };
    }
    case 'UPDATE_PAGE_PROPERTIES': {
        if (!state.currentPage) return state;
        const updates = action.payload;
        const newCurrentPage = {
            ...state.currentPage,
            ...updates,
            // If globalSettings is part of payload, merge it, otherwise keep existing
            globalSettings: updates.globalSettings
                ? { ...state.currentPage.globalSettings, ...updates.globalSettings }
                : state.currentPage.globalSettings,
        };
        return { ...state, currentPage: newCurrentPage, unsavedChanges: true };
    }
    case 'ADD_COMPONENT_TO_SECTION': {
      if (!state.currentPage?.sections) return state;
      const { sectionId, componentType } = action.payload;

      const pageUpdate = JSON.parse(JSON.stringify(state.currentPage)) as Page; // Deep copy
      const sectionIndex = pageUpdate.sections.findIndex(s => s.id === sectionId);

      if (sectionIndex === -1) {
        console.warn(`Section ${sectionId} not found during ADD_COMPONENT_TO_SECTION.`);
        return state;
      }

      const targetSection = pageUpdate.sections[sectionIndex];

      // Ensure section.allowedComponentTypes and section.maxComponents are respected
      // These properties are on ClientTypes.Section which should be what targetSection is.
      if (targetSection.maxComponents && targetSection.components.length >= targetSection.maxComponents) {
        console.warn(`Cannot add component to section ${sectionId}: maxComponents (${targetSection.maxComponents}) limit reached.`);
        return state; // Or dispatch a notification
      }
      if (targetSection.allowedComponents && targetSection.allowedComponents.length > 0 && !targetSection.allowedComponents.includes(componentType as ComponentType)) {
        console.warn(`Component type ${componentType} is not allowed in section ${sectionId}. Allowed: ${targetSection.allowedComponents.join(', ')}`);
        return state; // Or dispatch a notification
      }

      const definition = componentDefinitions.find(def => def.type === componentType);
      if (!definition) {
        console.warn(`Component definition for type "${componentType}" not found.`);
        return state;
      }

      const newComponentId = uuidv4();
      let newClientComponent: Component;

      const isElementBasedDefinition = definition.defaultElements && definition.defaultElements.length > 0;

      if (isElementBasedDefinition) {
        newClientComponent = createElementBasedComponent(
          componentType as ComponentType,
          JSON.parse(JSON.stringify(definition.defaultElements)),
          {}
        );
        newClientComponent.id = newComponentId;
      } else {
        const newContent: ComponentContent = {};
        if (definition.defaultParameters) {
          for (const key in definition.defaultParameters) {
            newContent[key] = definition.defaultParameters[key];
          }
        }
        newClientComponent = {
          id: newComponentId,
          type: componentType as ComponentType,
          content: newContent,
          styleOptions: {},
          replacingLocked: false,
          editingLocked: false,
          usesElements: false,
        };
      }

      if (!targetSection.components) {
        targetSection.components = [];
      }
      targetSection.components.push(newClientComponent);

      return {
        ...state,
        currentPage: pageUpdate,
        unsavedChanges: true,
        currentFocusedElementId: `component-${sectionId}-${newComponentId}`,
        selectedItemRect: null,
      };
    }
    case 'DELETE_COMPONENT_FROM_SECTION': {
      if (!state.currentPage?.sections) return state;
      const { sectionId, componentId } = action.payload;

      const pageUpdate = JSON.parse(JSON.stringify(state.currentPage)) as Page;
      const sectionIndex = pageUpdate.sections.findIndex(s => s.id === sectionId);

      if (sectionIndex === -1) {
        console.warn(`Section ${sectionId} not found during DELETE_COMPONENT_FROM_SECTION.`);
        return state;
      }

      const targetSection = pageUpdate.sections[sectionIndex];
      if (!targetSection.components) {
        console.warn(`Section ${sectionId} has no components array.`);
        return state;
      }

      const initialComponentCount = targetSection.components.length;
      targetSection.components = targetSection.components.filter(comp => comp.id !== componentId);

      if (targetSection.components.length === initialComponentCount) {
        console.warn(`Component ${componentId} not found in section ${sectionId}.`);
        return state; // No change if component wasn't found
      }

      let newFocusedElementId = state.currentFocusedElementId;
      if (state.currentFocusedElementId === `component-${sectionId}-${componentId}`) {
        newFocusedElementId = `section-${sectionId}`; // Focus parent section
      }

      return {
        ...state,
        currentPage: pageUpdate,
        unsavedChanges: true,
        currentFocusedElementId: newFocusedElementId,
        selectedItemRect: newFocusedElementId === state.currentFocusedElementId ? state.selectedItemRect : null, // Clear rect if focus changed
      };
    }
    case 'REORDER_COMPONENT_IN_SECTION': {
      if (!state.currentPage?.sections) return state;
      const { sectionId, componentId, direction } = action.payload;

      const pageUpdate = JSON.parse(JSON.stringify(state.currentPage)) as Page;
      const sectionIndex = pageUpdate.sections.findIndex(s => s.id === sectionId);

      if (sectionIndex === -1) {
        console.warn(`Section ${sectionId} not found during REORDER_COMPONENT_IN_SECTION.`);
        return state;
      }

      const targetSection = pageUpdate.sections[sectionIndex];
      if (!targetSection.components) {
        console.warn(`Section ${sectionId} has no components array.`);
        return state;
      }

      const componentIndex = targetSection.components.findIndex(comp => comp.id === componentId);
      if (componentIndex === -1) {
        console.warn(`Component ${componentId} not found in section ${sectionId} for reordering.`);
        return state;
      }

      const componentToMove = targetSection.components[componentIndex];
      const newComponentsArray = [...targetSection.components];

      if (direction === 'up') {
        if (componentIndex === 0) return state; // Already at the top
        newComponentsArray.splice(componentIndex, 1);
        newComponentsArray.splice(componentIndex - 1, 0, componentToMove);
      } else { // direction === 'down'
        if (componentIndex === newComponentsArray.length - 1) return state; // Already at the bottom
        newComponentsArray.splice(componentIndex, 1);
        newComponentsArray.splice(componentIndex + 1, 0, componentToMove);
      }

      targetSection.components = newComponentsArray;

      return {
        ...state,
        currentPage: pageUpdate,
        unsavedChanges: true,
      };
    }
    case 'ADD_ELEMENT_TO_COMPONENT': {
      if (!state.currentPage?.sections) return state;
      const { sectionId, componentId, elementType: clientElementType } = action.payload;

      const pageUpdate = JSON.parse(JSON.stringify(state.currentPage)) as Page;
      const section = pageUpdate.sections.find(s => s.id === sectionId);
      if (!section) {
        console.warn(`Section ${sectionId} not found during ADD_ELEMENT_TO_COMPONENT.`);
        return state;
      }

      const component = section.components.find(c => c.id === componentId);
      if (!component) {
        console.warn(`Component ${componentId} not found in section ${sectionId}.`);
        return state;
      }

      // The 'elements' array on ClientTypes.Component is SchemaElement[]
      if (!component.elements) {
        component.elements = [];
      }

      const newClientElement = elementRegistry.createElement(clientElementType);
      if (!newClientElement) {
        console.warn(`Could not create element of type ${clientElementType}`);
        return state;
      }

      // Map ClientElementType (lowercase) to SchemaElementType (PascalCase)
      let schemaElementTypeString = clientElementType.charAt(0).toUpperCase() + clientElementType.slice(1);
      if (clientElementType === 'richtext') schemaElementTypeString = 'RichText';
      // Add more specific mappings if direct capitalization isn't enough for other types like 'form-field'.
      // For now, assume this simple mapping covers existing schema types used by client registry.
      // A more robust solution would be a dedicated mapping function or ensuring ClientElementType aligns better.
      const schemaElementType = schemaElementTypeString as SchemaElementType;


      const newSchemaElement: SchemaElement = {
        id: newClientElement.id,
        type: schemaElementType,
        properties: newClientElement.properties,
      };

      component.elements.push(newSchemaElement);

      return {
        ...state,
        currentPage: pageUpdate,
        unsavedChanges: true,
        currentFocusedElementId: `element-${sectionId}-${componentId}-${newSchemaElement.id}`,
        selectedItemRect: null,
      };
    }
    case 'DELETE_ELEMENT_FROM_COMPONENT': {
      if (!state.currentPage?.sections) return state;
      const { path } = action.payload;
      const pageUpdate = JSON.parse(JSON.stringify(state.currentPage)) as Page;

      const section = pageUpdate.sections.find(s => s.id === path.sectionId);
      if (!section) return state;
      const component = section.components.find(c => c.id === path.componentId);
      if (!component || !component.elements) return state;

      const initialElementCount = component.elements.length;
      component.elements = component.elements.filter(el => el.id !== path.elementId);

      if (component.elements.length === initialElementCount) return state; // Element not found

      let newFocusedElementId = state.currentFocusedElementId;
      if (state.currentFocusedElementId === `element-${path.sectionId}-${path.componentId}-${path.elementId}`) {
        newFocusedElementId = `component-${path.sectionId}-${path.componentId}`; // Focus parent component
      }

      return {
        ...state,
        currentPage: pageUpdate,
        unsavedChanges: true,
        currentFocusedElementId: newFocusedElementId,
        selectedItemRect: newFocusedElementId === state.currentFocusedElementId ? state.selectedItemRect : null,
      };
    }
    case 'REORDER_ELEMENT_IN_COMPONENT': {
      if (!state.currentPage?.sections) return state;
      const { path, direction } = action.payload;
      const pageUpdate = JSON.parse(JSON.stringify(state.currentPage)) as Page;

      const section = pageUpdate.sections.find(s => s.id === path.sectionId);
      if (!section) return state;
      const component = section.components.find(c => c.id === path.componentId);
      if (!component || !component.elements) return state;

      const elementIndex = component.elements.findIndex(el => el.id === path.elementId);
      if (elementIndex === -1) return state; // Element not found

      const elementToMove = component.elements[elementIndex];
      const newElementsArray = [...component.elements];

      if (direction === 'up') {
        if (elementIndex === 0) return state; // Already at top
        newElementsArray.splice(elementIndex, 1);
        newElementsArray.splice(elementIndex - 1, 0, elementToMove);
      } else { // direction === 'down'
        if (elementIndex === newElementsArray.length - 1) return state; // Already at bottom
        newElementsArray.splice(elementIndex, 1);
        newElementsArray.splice(elementIndex + 1, 0, elementToMove);
      }
      component.elements = newElementsArray;

      return {
        ...state,
        currentPage: pageUpdate,
        unsavedChanges: true,
      };
    }
    case 'ADD_SECTION_TO_PAGE': {
      if (!state.currentPage) return state;
      const { sectionName, sectionType } = action.payload;
      const pageUpdate = JSON.parse(JSON.stringify(state.currentPage)) as Page;

      const newSectionId = uuidv4();
      const newSection: Section = {
        id: newSectionId,
        name: sectionName,
        // 'type' is not directly on ClientTypes.Section, but SchemaSection has it.
        // For now, we'll manage it as a custom property if needed, or assume a default type.
        // The task mentions 'BasicSection' or using sectionName.
        // Let's assume 'type' will be stored in `properties` if needed, or not explicitly typed on ClientTypes.Section for now.
        // title: sectionName, // Optional, can be added if desired
        // subtitle: '', // Optional
        properties: { // Default SectionProperties
          backgroundStyle: 'color',
          backgroundColor: '#ffffff',
          //backgroundImage: '', // Not setting by default
          //gradientStartColor: '#ffffff',
          //gradientEndColor: '#000000',
          //gradientDirection: 'to bottom',
          padding: {
            vertical: 20,
            horizontal: 0,
          },
          // Store sectionType from payload if provided, else a default
          sectionType: sectionType || 'BasicSection',
        },
        allowedComponents: [], // Empty array means all components are allowed by default
        components: [],
        // maxComponents: undefined, // Default: no limit
        // minComponents: undefined, // Default: no minimum
        // spacing from SchemaSection is not directly on ClientTypes.Section, handle via properties if needed
      };

      if (!pageUpdate.sections) {
        pageUpdate.sections = [];
      }
      pageUpdate.sections.push(newSection);

      return {
        ...state,
        currentPage: pageUpdate,
        unsavedChanges: true,
        currentFocusedElementId: `section-${newSectionId}`,
        selectedItemRect: null,
      };
    }
    case 'DELETE_SECTION_FROM_PAGE': {
      if (!state.currentPage) return state;
      const { sectionId } = action.payload;
      const pageUpdate = JSON.parse(JSON.stringify(state.currentPage)) as Page;

      const initialSectionCount = pageUpdate.sections.length;
      pageUpdate.sections = pageUpdate.sections.filter(sec => sec.id !== sectionId);

      if (pageUpdate.sections.length === initialSectionCount) {
        console.warn(`Section ${sectionId} not found on page.`);
        return state; // No change if section wasn't found
      }

      let newFocusedElementId = state.currentFocusedElementId;
      // If the deleted section or something within it was focused, unfocus to page level
      if (state.currentFocusedElementId && state.currentFocusedElementId.startsWith(`section-${sectionId}`)) {
        newFocusedElementId = null;
      }

      return {
        ...state,
        currentPage: pageUpdate,
        unsavedChanges: true,
        currentFocusedElementId: newFocusedElementId,
        selectedItemRect: newFocusedElementId === state.currentFocusedElementId ? state.selectedItemRect : null,
        selectedSection: newFocusedElementId === null ? null : state.selectedSection, // Clear selectedSection if it was the one deleted
      };
    }
    case 'REORDER_SECTION_IN_PAGE': {
      if (!state.currentPage || !state.currentPage.sections) return state;
      const { sectionId, direction } = action.payload;
      const pageUpdate = JSON.parse(JSON.stringify(state.currentPage)) as Page;

      const sectionIndex = pageUpdate.sections.findIndex(sec => sec.id === sectionId);
      if (sectionIndex === -1) {
        console.warn(`Section ${sectionId} not found for reordering.`);
        return state;
      }

      const sectionToMove = pageUpdate.sections[sectionIndex];
      const newSectionsArray = [...pageUpdate.sections];

      if (direction === 'up') {
        if (sectionIndex === 0) return state; // Already at top
        newSectionsArray.splice(sectionIndex, 1);
        newSectionsArray.splice(sectionIndex - 1, 0, sectionToMove);
      } else { // direction === 'down'
        if (sectionIndex === newSectionsArray.length - 1) return state; // Already at bottom
        newSectionsArray.splice(sectionIndex, 1);
        newSectionsArray.splice(sectionIndex + 1, 0, sectionToMove);
      }
      pageUpdate.sections = newSectionsArray;

      return {
        ...state,
        currentPage: pageUpdate,
        unsavedChanges: true,
      };
    }
    case 'TOGGLE_USER_LEVEL':
      return {...state, currentUserLevel: state.currentUserLevel === 'free' ? 'pro' : 'free'};
    case 'SET_ACTIVE_TOOL': return { ...state, activeTool: action.payload };
    case 'SET_PREVIEW_DEVICE': return { ...state, previewDevice: action.payload };
    case 'SAVE_PAGE': return { ...state, unsavedChanges: false };
    case 'HYDRATE_STATE':
      const pageToHydrate = action.payload;
      if (!pageToHydrate.sections) pageToHydrate.sections = [];
      return {...state, currentPage: pageToHydrate, templateSelected: true, unsavedChanges: false, selectedSection: null, selectedComponent: null, selectedItemRect: null, currentFocusedElementId: null };
    default:
      return state;
  }
}

export interface EditorContextType {
  state: EditorState;
  selectTemplate: (templateId: string) => void;
  selectSection: (sectionId: string | null, domNode: HTMLElement | null) => void;
  selectComponent: (sectionId: string, componentId: string | null, domNode: HTMLElement | null) => void;
  updateSection: (sectionId: string, updates: Partial<SchemaSection>) => void;
  updateComponent: (sectionId: string, componentId: string, updates: Partial<SchemaComponent>) => void; // This one updates based on SchemaComponent
  updateComponentProperties: (sectionId: string, componentId: string, properties: Record<string, any>) => void; // New: for 'classic' component content/style
  updateSectionProperties: (sectionId: string, properties: Partial<Omit<SchemaSection, 'id' | 'components'>>) => void; // New: for section's own props
  updatePageProperties: (properties: Partial<Omit<Page, 'id' | 'sections' | 'templateId'>>) => void;
  replaceComponent: (sectionId: string, componentId: string, newType: SchemaComponentType) => void;
  deleteSelectedItem: () => void;
  updateElementContent: (path: ElementPath, newContent: string, elementType: 'Paragraph' | 'RichText') => void;
  updateElementProperties: (path: ElementPath, properties: Record<string, any>) => void;
  addComponentToSection: (sectionId: string, componentType: SchemaComponentType) => void;
  deleteComponentFromSection: (sectionId: string, componentId: string) => void;
  reorderComponentInSection: (sectionId: string, componentId: string, direction: 'up' | 'down') => void;
  addElementToComponent: (sectionId: string, componentId: string, elementType: ClientElementType) => void;
  deleteElementFromComponentPath: (path: ElementPath) => void;
  reorderElementInComponentPath: (path: ElementPath, direction: 'up' | 'down') => void;
  addSectionToPage: (sectionName: string, sectionType?: string) => void;
  deleteSection: (sectionId: string) => void; // New
  reorderSection: (sectionId: string, direction: 'up' | 'down') => void; // New
  toggleUserLevel: () => void;
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
    if (!state.currentPage || !state.currentPage.sections) {
      console.error("Cannot update section: currentPage or currentPage.sections is not available.");
      return;
    }
    const currentSection = state.currentPage.sections.find(s => (s as unknown as SchemaSection).id === sectionId);
    if (!currentSection) return;
    const updatedProperties = updates.properties ? { ...currentSection.properties, ...updates.properties } : currentSection.properties;
    const updatedSectionData = { ...(currentSection as unknown as SchemaSection), ...updates, properties: updatedProperties };
    dispatch({ type: 'UPDATE_SECTION', payload: updatedSectionData });
  }, [state.currentPage]);
  
  const updateComponent = useCallback((sectionId: string, componentId: string, updates: Partial<SchemaComponent>) => {
    if (!state.currentPage || !state.currentPage.sections) {
      console.error("Cannot update component: currentPage or currentPage.sections is not available.");
      return;
    }
    const section = state.currentPage.sections.find(s => (s as unknown as SchemaSection).id === sectionId);
    if (!section || !section.components) {
      console.error("Cannot update component: parent section or its components array is not available.");
      return;
    }
    const component = section.components.find(c => (c as unknown as SchemaComponent).id === componentId);
    if (!component) return;
    // This existing function is for SchemaComponent structure (like parameters, type)
    const updatedComponentData = { ...(component as unknown as SchemaComponent), ...updates };
    dispatch({ type: 'UPDATE_COMPONENT', payload: { sectionId, component: updatedComponentData } });
  }, [state.currentPage]);

  const updateElementContent = useCallback((path: ElementPath, newContent: string, elementType: 'Paragraph' | 'RichText') => {
    // This could potentially be replaced by updateElementProperties if properties include 'text' or 'htmlContent'
    dispatch({ type: 'UPDATE_ELEMENT_CONTENT', payload: { path, newContent, elementType } });
  }, []);

  const updateElementProperties = useCallback((path: ElementPath, properties: Record<string, any>) => {
    dispatch({ type: 'UPDATE_ELEMENT_PROPERTIES', payload: { path, properties } });
  }, []);

  const updateComponentProperties = useCallback((sectionId: string, componentId: string, properties: Record<string, any>) => {
    dispatch({ type: 'UPDATE_COMPONENT_PROPERTIES', payload: { sectionId, componentId, properties } });
  }, []);

  const updateSectionProperties = useCallback((sectionId: string, properties: Partial<Omit<SchemaSection, 'id' | 'components'>>) => {
    dispatch({ type: 'UPDATE_SECTION_PROPERTIES', payload: { sectionId, properties } });
  }, []);

  const updatePageProperties = useCallback((properties: Partial<Omit<Page, 'id' | 'sections' | 'templateId'>>) => {
    dispatch({ type: 'UPDATE_PAGE_PROPERTIES', payload: properties });
  }, []);

  const addComponentToSection = useCallback((sectionId: string, componentType: SchemaComponentType) => {
    dispatch({ type: 'ADD_COMPONENT_TO_SECTION', payload: { sectionId, componentType } });
  }, []);

  const deleteComponentFromSection = useCallback((sectionId: string, componentId: string) => {
    dispatch({ type: 'DELETE_COMPONENT_FROM_SECTION', payload: { sectionId, componentId } });
  }, []);

  const reorderComponentInSection = useCallback((sectionId: string, componentId: string, direction: 'up' | 'down') => {
    dispatch({ type: 'REORDER_COMPONENT_IN_SECTION', payload: { sectionId, componentId, direction } });
  }, []);

  const addElementToComponent = useCallback((sectionId: string, componentId: string, elementType: ClientElementType) => {
    dispatch({ type: 'ADD_ELEMENT_TO_COMPONENT', payload: { sectionId, componentId, elementType }});
  }, []);

  const deleteElementFromComponentPath = useCallback((path: ElementPath) => {
    dispatch({ type: 'DELETE_ELEMENT_FROM_COMPONENT', payload: { path } });
  }, []);

  const reorderElementInComponentPath = useCallback((path: ElementPath, direction: 'up' | 'down') => {
    dispatch({ type: 'REORDER_ELEMENT_IN_COMPONENT', payload: { path, direction } });
  }, []);

  const addSectionToPage = useCallback((sectionName: string, sectionType?: string) => {
    dispatch({ type: 'ADD_SECTION_TO_PAGE', payload: { sectionName, sectionType } });
  }, []);

  const deleteSection = useCallback((sectionId: string) => {
    dispatch({ type: 'DELETE_SECTION_FROM_PAGE', payload: { sectionId } });
  }, []);

  const reorderSection = useCallback((sectionId: string, direction: 'up' | 'down') => {
    dispatch({ type: 'REORDER_SECTION_IN_PAGE', payload: { sectionId, direction } });
  }, []);
  
  const replaceComponent = useCallback((sectionId: string, componentId: string, newType: SchemaComponentType) => dispatch({ type: 'REPLACE_COMPONENT', payload: { sectionId, componentId, newType } }), []);
  const deleteSelectedItem = useCallback(() => dispatch({ type: 'DELETE_SELECTED_ITEM' }), []);
  const toggleUserLevel = useCallback(() => dispatch({ type: 'TOGGLE_USER_LEVEL' }), []);
  const setActiveTool = useCallback((tool: string) => dispatch({ type: 'SET_ACTIVE_TOOL', payload: tool }), []);
  const setPreviewDevice = useCallback((device: 'desktop' | 'tablet' | 'mobile') => dispatch({ type: 'SET_PREVIEW_DEVICE', payload: device }), []);
  const savePage = useCallback(() => dispatch({ type: 'SAVE_PAGE' }), []);
  const clearSelectedSection = useCallback(() => dispatch({ type: 'SELECT_SECTION', payload: { sectionId: null, rect: null } }), []);
  
  const legacyUpdateComponentContent = useCallback((key: string, value: any) => {
    if (!state.currentPage || !state.selectedSection || !state.selectedComponent) {
        console.warn("Cannot update component content: selection or page data missing.");
        return;
    }
    const section = state.currentPage.sections.find(s => s.id === state.selectedSection);
    if (!section || !section.components) return;
    const componentToUpdate = section.components.find(c => c.id === state.selectedComponent);
    if (!componentToUpdate || (componentToUpdate as unknown as SchemaComponent).editable === 'locked-edit') return;
    const schemaComp = componentToUpdate as unknown as SchemaComponent;
    const updatedComp: SchemaComponent = { ...schemaComp, properties: { ...(schemaComp.properties || {}), [key]: value }};
    dispatch({ type: 'UPDATE_COMPONENT', payload: { sectionId: state.selectedSection, component: updatedComp } });
  }, [state.currentPage, state.selectedSection, state.selectedComponent]);
  
  const togglePreviewMode = useCallback(() => setPreviewMode(prev => !prev), []);
  const hydrateState = useCallback((page: Page) => dispatch({ type: 'HYDRATE_STATE', payload: page }), []);
  
  const contextValue = useMemo(() => ({
    state, selectTemplate, selectSection, selectComponent, updateSection, updateComponent,
    updateComponentProperties, updateSectionProperties, updatePageProperties,
    replaceComponent, deleteSelectedItem, updateElementContent, updateElementProperties,
    addComponentToSection, deleteComponentFromSection, reorderComponentInSection, addElementToComponent,
    toggleUserLevel,
    setActiveTool, setPreviewDevice, savePage, clearSelectedSection,
    updateComponentContent: legacyUpdateComponentContent,
    previewMode, togglePreviewMode, hydrateState,
  }), [
    state, selectTemplate, selectSection, selectComponent, updateSection, updateComponent,
    updateComponentProperties, updateSectionProperties, updatePageProperties,
    replaceComponent, deleteSelectedItem, updateElementContent, updateElementProperties,
    addComponentToSection, deleteComponentFromSection, reorderComponentInSection, addElementToComponent,
    deleteElementFromComponentPath, reorderElementInComponentPath, addSectionToPage,
    deleteSection, reorderSection, // Added new actions
    toggleUserLevel,
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
