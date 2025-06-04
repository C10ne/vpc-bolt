
import { Template, Section, Component } from '../types';
import { componentRegistry } from '../registry/component-registry';

export class TemplateValidator {
  static validateTemplate(template: Template): boolean {
    if (!template.definition.id || !template.definition.name) {
      throw new Error('Template must have an ID and name');
    }

    return template.sections.every(section => this.validateSection(section));
  }

  static validateSection(section: Section): boolean {
    if (!section.definition.id || !section.definition.layout) {
      throw new Error('Section must have an ID and layout');
    }

    return section.components.every(component => this.validateComponent(component));
  }

  static validateComponent(component: Component): boolean {
    if (!component.id || !component.definition.type) {
      throw new Error('Component must have an ID and type');
    }

    if (!componentRegistry.isRegistered(component.definition.type)) {
      throw new Error(`Component type ${component.definition.type} is not registered`);
    }

    return true;
  }
}
