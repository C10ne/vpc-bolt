import { describe, it, expect } from 'vitest';
import {
  createEmptyTemplate,
  createNewSection,
  getStatusBadge,
  createComponent,
  findSectionAndComponent,
  canEditComponent,
  canAddComponent,
  canDeleteComponent,
  formatDateForDisplay,
} from '@/lib/utils/template-utils';
import type { Template, Section, ElementStatus, Component } from '@/lib/utils/template-utils';

describe('template-utils', () => {
  describe('createEmptyTemplate', () => {
    it('should return an object with the correct structure', () => {
      const template = createEmptyTemplate();
      expect(template).toHaveProperty('id');
      expect(template).toHaveProperty('name');
      expect(template).toHaveProperty('sections');
      expect(Array.isArray(template.sections)).toBe(true);
    });

    it('should assign a default name if none is provided', () => {
      const template = createEmptyTemplate();
      expect(template.name).toBe('New Template');
    });

    it('should assign the provided name if one is given', () => {
      const templateName = 'My Custom Template';
      const template = createEmptyTemplate(templateName);
      expect(template.name).toBe(templateName);
    });

    it('should have a non-empty id', () => {
      const template = createEmptyTemplate();
      expect(template.id).toBeTruthy();
      expect(typeof template.id).toBe('string');
    });
  });

  describe('createNewSection', () => {
    it('should return an object with the correct structure for a known section type', () => {
      const section = createNewSection('hero');
      expect(section).toHaveProperty('id');
      expect(section).toHaveProperty('name');
      expect(section).toHaveProperty('type');
      expect(section.type).toBe('hero');
      expect(section).toHaveProperty('status');
      expect(section).toHaveProperty('components');
      expect(Array.isArray(section.components)).toBe(true);
    });

    it('should return a generic structure for an unknown section type', () => {
      const section = createNewSection('unknown-type');
      expect(section).toHaveProperty('id');
      expect(section).toHaveProperty('name');
      expect(section).toHaveProperty('type');
      expect(section.type).toBe('unknown-type');
      expect(section).toHaveProperty('status');
      expect(section).toHaveProperty('components');
      expect(Array.isArray(section.components)).toBe(true);
      // For unknown types, components should be an empty array.
      expect(section.components).toEqual([]);
    });

    it('should have a non-empty id', () => {
      const section = createNewSection('hero', 'Test Hero ID Check'); // Provide name due to signature change
      expect(section.id).toBeTruthy();
      expect(typeof section.id).toBe('string');
    });

    it('should assign the status correctly', () => {
      const sectionEditable = createNewSection('hero', 'Test Hero Editable', 'editable');
      expect(sectionEditable.status).toBe('editable');

      const sectionLocked = createNewSection('hero', 'Test Hero Locked', 'locked-components');
      expect(sectionLocked.status).toBe('locked-components');
    });
  });

  describe('getStatusBadge', () => {
    it("should return the correct badge object for 'editable' status", () => {
      const badge = getStatusBadge('editable');
      expect(badge.label).toBe('Editable');
      expect(badge.color).toBe('green');
      expect(badge.description).toBe('Full access to edit content and structure.');
    });

    it("should return the correct badge object for 'locked-components' status", () => {
      const badge = getStatusBadge('locked-components');
      expect(badge.label).toBe('Components Locked');
      expect(badge.color).toBe('yellow');
      expect(badge.description).toBe('Content is editable, but components cannot be added or removed.');
    });

    it("should return the correct badge object for 'locked-editing' status", () => {
      const badge = getStatusBadge('locked-editing');
      expect(badge.label).toBe('Editing Locked');
      expect(badge.color).toBe('red');
      expect(badge.description).toBe('Content and structure are locked.');
    });

    it('should return a default badge object for an unknown status', () => {
      // @ts-expect-error Testing unknown status
      const badge = getStatusBadge('unknown-status');
      expect(badge.label).toBe('Unknown');
      expect(badge.color).toBe('gray');
      expect(badge.description).toBe('The status is not recognized.');
    });
  });

  describe('createComponent', () => {
    it('should return an object with the correct structure for a known component type', () => {
      const component = createComponent('product-card');
      expect(component).toHaveProperty('id');
      expect(component).toHaveProperty('name');
      expect(component).toHaveProperty('type');
      expect(component.type).toBe('product-card');
      expect(component).toHaveProperty('data');
      // Assuming 'product-card' has specific default data, checking for existence of 'name' (product name, not component name) and 'price'
      expect(component.data).toHaveProperty('name'); // e.g. data.name for "New Product"
      expect(component.data).toHaveProperty('price');
    });

    it('should return a generic structure for an unknown component type', () => {
      const component = createComponent('unknown-component');
      expect(component).toHaveProperty('id');
      expect(component).toHaveProperty('name'); // Component name e.g. "Unknown Component"
      expect(component.name).toBe('Unknown Component');
      expect(component).toHaveProperty('type');
      expect(component.type).toBe('unknown-component');
      expect(component).toHaveProperty('data');
      // For unknown types, data should be an empty object
      expect(component.data).toEqual({});
    });

    it('should have a non-empty id', () => {
      const component = createComponent('button'); // Button is an example type
      expect(component.id).toBeTruthy();
      expect(typeof component.id).toBe('string');
    });
  });

  describe('findSectionAndComponent', () => {
    const template: Template = {
      id: 'template1',
      name: 'Test Template',
      sections: [
        {
          id: 'section1',
          name: 'Hero Section',
          type: 'hero',
          status: 'editable',
          components: [
            { id: 'comp1', name: 'Button 1', type: 'button', data: {} } as Component,
            { id: 'comp2', name: 'Text 1', type: 'text', data: {} } as Component,
          ],
        },
        {
          id: 'section2',
          name: 'Product Grid',
          type: 'product-grid',
          status: 'locked-components',
          components: [
            { id: 'comp3', name: 'Product Card 1', type: 'product-card', data: {} } as Component,
          ],
        },
      ],
    };

    it('should return the correct section and component when the componentId exists', () => {
      const result = findSectionAndComponent(template, 'comp1');
      expect(result.section).toBeDefined();
      expect(result.component).toBeDefined();
      expect(result.section?.id).toBe('section1');
      expect(result.component?.id).toBe('comp1');

      const result2 = findSectionAndComponent(template, 'comp3');
      expect(result2.section).toBeDefined();
      expect(result2.component).toBeDefined();
      expect(result2.section?.id).toBe('section2');
      expect(result2.component?.id).toBe('comp3');
    });

    it('should return null for both section and component when the componentId does not exist', () => {
      const result = findSectionAndComponent(template, 'nonexistent-comp');
      expect(result.section).toBeNull();
      expect(result.component).toBeNull();
    });

    it('should return null for both section and component with an empty template', () => {
      const emptyTemplate: Template = { id: 'empty', name: 'Empty', sections: [] };
      const result = findSectionAndComponent(emptyTemplate, 'comp1');
      expect(result.section).toBeNull();
      expect(result.component).toBeNull();
    });

     it('should return null for both section and component if template is null', () => {
      // @ts-expect-error
      const result = findSectionAndComponent(null, 'comp1');
      expect(result.section).toBeNull();
      expect(result.component).toBeNull();
    });

    it('should return null for both section and component if template sections are null', () => {
      const templateWithNullSections: Template = {
        id: 'template-null-sections',
        name: 'Test Template',
        // @ts-expect-error
        sections: null,
      };
      const result = findSectionAndComponent(templateWithNullSections, 'comp1');
      expect(result.section).toBeNull();
      expect(result.component).toBeNull();
    });
  });

  describe('canEditComponent', () => {
    const sectionEditable: Section = { id: 's1', name: 'Editable Section', type: 'hero', status: 'editable', components: [] };
    const sectionLockedEditing: Section = { id: 's2', name: 'Locked Editing Section', type: 'hero', status: 'locked-editing', components: [] };
    const sectionLockedComponents: Section = { id: 's3', name: 'Locked Components Section', type: 'hero', status: 'locked-components', components: [] };

    it("should return true if section status is 'editable'", () => {
      expect(canEditComponent(sectionEditable)).toBe(true);
    });

    it("should return false if section status is 'locked-editing'", () => {
      expect(canEditComponent(sectionLockedEditing)).toBe(false);
    });

    it("should return true if section status is 'locked-components'", () => {
      // Content editing is allowed even if components are locked
      expect(canEditComponent(sectionLockedComponents)).toBe(true);
    });

    it('should return false if section is null', () => {
        // @ts-expect-error
        expect(canEditComponent(null)).toBe(false);
    });
  });

  describe('canAddComponent', () => {
    const sectionEditable: Section = { id: 's1', name: 'Editable Section', type: 'hero', status: 'editable', components: [] };
    const sectionLockedComponents: Section = { id: 's2', name: 'Locked Components Section', type: 'hero', status: 'locked-components', components: [] };
    const sectionLockedEditing: Section = { id: 's3', name: 'Locked Editing Section', type: 'hero', status: 'locked-editing', components: [] };

    it("should return true if section status is 'editable'", () => {
      expect(canAddComponent(sectionEditable)).toBe(true);
    });

    it("should return false if section status is 'locked-components'", () => {
      expect(canAddComponent(sectionLockedComponents)).toBe(false);
    });

    it("should return false if section status is 'locked-editing'", () => {
      expect(canAddComponent(sectionLockedEditing)).toBe(false);
    });
     it('should return false if section is null', () => {
        // @ts-expect-error
        expect(canAddComponent(null)).toBe(false);
    });
  });

  describe('canDeleteComponent', () => {
    const sectionEditable: Section = { id: 's1', name: 'Editable Section', type: 'hero', status: 'editable', components: [] };
    const sectionLockedComponents: Section = { id: 's2', name: 'Locked Components Section', type: 'hero', status: 'locked-components', components: [] };
    const sectionLockedEditing: Section = { id: 's3', name: 'Locked Editing Section', type: 'hero', status: 'locked-editing', components: [] };

    it("should return true if section status is 'editable'", () => {
      expect(canDeleteComponent(sectionEditable)).toBe(true);
    });

    it("should return false if section status is 'locked-components'", () => {
      expect(canDeleteComponent(sectionLockedComponents)).toBe(false);
    });

    it("should return false if section status is 'locked-editing'", () => {
      expect(canDeleteComponent(sectionLockedEditing)).toBe(false);
    });
    it('should return false if section is null', () => {
        // @ts-expect-error
        expect(canDeleteComponent(null)).toBe(false);
    });
  });

  describe('formatDateForDisplay', () => {
    it('should format a valid date string correctly', () => {
      const dateStr = '2023-10-27T10:30:00.000Z';
      // Expected format: Oct 27, 2023, 10:30 AM (this depends on the locale of the test environment)
      // For consistency, let's test parts of the date or mock toLocaleString if needed.
      // Given the function uses toLocaleString without specific options, the output is locale-dependent.
      // A more robust test would mock Date or use a library that allows specifying locale.
      // For now, we'll check if it produces a non-empty string that seems reasonable.
      const formattedDate = formatDateForDisplay(dateStr);
      expect(formattedDate).toBeTruthy();
      expect(typeof formattedDate).toBe('string');
      // Example check (might fail in different timezones/locales):
      // expect(formattedDate).toContain('Oct 27, 2023');
      // A safer check for this basic implementation:
      expect(new Date(dateStr).toLocaleString()).toBe(formattedDate);
    });

    it('should handle an invalid date string by returning the output of toLocaleString for "Invalid Date"', () => {
      const invalidDateStr = 'not-a-date';
      const formattedDate = formatDateForDisplay(invalidDateStr);
      // new Date('not-a-date').toLocaleString() often returns "Invalid Date" or similar
      expect(formattedDate).toBe(new Date(invalidDateStr).toLocaleString());
    });

    it('should handle null input by returning the output of toLocaleString for new Date(null)', () => {
        // @ts-expect-error
        const formattedDate = formatDateForDisplay(null);
        // new Date(null).toLocaleString() is equivalent to new Date(0).toLocaleString() which is epoch time
        expect(formattedDate).toBe(new Date(null).toLocaleString());
    });

    it('should handle undefined input by returning the output of toLocaleString for new Date(undefined)', () => {
        // @ts-expect-error
        const formattedDate = formatDateForDisplay(undefined);
        // new Date(undefined).toLocaleString() results in "Invalid Date"
        expect(formattedDate).toBe(new Date(undefined).toLocaleString());
    });
  });
});
