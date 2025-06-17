
import { ComponentDefinition } from '../types';

import { ProjectShowcase } from '../components/portfolio/project-showcase';

class ComponentRegistry {
  private defaultComponents = [
    {
      id: 'project-showcase',
      type: 'project-showcase',
      displayName: 'Project Showcase',
      component: ProjectShowcase,
      defaultContent: {
        title: 'Project Title',
        description: 'Project description goes here',
        imageUrl: 'https://via.placeholder.com/600x400',
        technologies: ['React', 'TypeScript', 'Tailwind'],
        link: '#'
      }
    }
  ];
  private static instance: ComponentRegistry;
  private components: Map<string, ComponentDefinition>;

  private constructor() {
    this.components = new Map();
  }

  static getInstance(): ComponentRegistry {
    if (!ComponentRegistry.instance) {
      ComponentRegistry.instance = new ComponentRegistry();
    }
    return ComponentRegistry.instance;
  }

  register(component: ComponentDefinition): void {
    if (this.components.has(component.type)) {
      throw new Error(`Component type ${component.type} is already registered`);
    }
    this.components.set(component.type, component);
  }

  get(type: string): ComponentDefinition | undefined {
    return this.components.get(type);
  }

  getAll(): ComponentDefinition[] {
    return Array.from(this.components.values());
  }

  isRegistered(type: string): boolean {
    return this.components.has(type);
  }
}

export const componentRegistry = ComponentRegistry.getInstance();
