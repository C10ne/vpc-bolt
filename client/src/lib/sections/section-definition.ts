
import { SectionDefinition, ComponentSlot } from '../types';

export class SectionDefinitionBuilder {
  private definition: Partial<SectionDefinition>;

  constructor(id: string) {
    this.definition = {
      id,
      type: 'section',
      componentSlots: [],
    };
  }

  setLayout(layout: string): SectionDefinitionBuilder {
    this.definition.layout = layout;
    return this;
  }

  setStyles(styles: string[]): SectionDefinitionBuilder {
    this.definition.styles = styles;
    return this;
  }

  setDisplayName(name: string): SectionDefinitionBuilder {
    this.definition.displayName = name;
    return this;
  }

  addComponentSlot(slot: ComponentSlot): SectionDefinitionBuilder {
    this.definition.componentSlots = [...(this.definition.componentSlots || []), slot];
    return this;
  }

  build(): SectionDefinition {
    if (!this.definition.layout || !this.definition.styles) {
      throw new Error('Section definition requires layout and styles');
    }
    return this.definition as SectionDefinition;
  }
}

export const createSectionDefinition = (id: string): SectionDefinitionBuilder => {
  return new SectionDefinitionBuilder(id);
};
