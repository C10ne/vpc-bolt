
import { ComponentDefinition, Component, LockStatus } from '../types';
import { componentRegistry } from '../registry/component-registry';
import { v4 as uuidv4 } from 'uuid';

export class ComponentFactory {
  private static instance: ComponentFactory;

  private constructor() {}

  static getInstance(): ComponentFactory {
    if (!ComponentFactory.instance) {
      ComponentFactory.instance = new ComponentFactory();
    }
    return ComponentFactory.instance;
  }

  createComponent(type: string, lockStatus: LockStatus[] = []): Component {
    const definition = componentRegistry.get(type);
    if (!definition) {
      throw new Error(`Component type ${type} is not registered`);
    }

    return {
      id: uuidv4(),
      definition,
      editableContent: this.getDefaultContent(definition),
      editableStyle: this.getDefaultStyle(definition),
      lockStatus
    };
  }

  private getDefaultContent(definition: ComponentDefinition) {
    // Default content based on component type
    return {
      title: '',
      subtitle: '',
      buttonText: '',
      buttonLink: '',
      backgroundImage: ''
    };
  }

  private getDefaultStyle(definition: ComponentDefinition) {
    return {
      backgroundColor: '#ffffff',
      buttonStyle: 'primary',
      padding: {
        vertical: 64,
        horizontal: 24
      }
    };
  }
}

export const componentFactory = ComponentFactory.getInstance();
