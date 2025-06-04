
import { Template } from '../types';

export class StyleManager {
  private static instance: StyleManager;
  private variables: Map<string, string> = new Map();

  private constructor() {
    this.initializeDefaultVariables();
  }

  static getInstance(): StyleManager {
    if (!StyleManager.instance) {
      StyleManager.instance = new StyleManager();
    }
    return StyleManager.instance;
  }

  private initializeDefaultVariables() {
    this.variables.set('--primary', '#4361ee');
    this.variables.set('--secondary', '#3f37c9');
    this.variables.set('--accent', '#4cc9f0');
  }

  updateTemplateStyles(template: Template) {
    const { colorScheme, typography } = template.editableStyles;
    
    this.variables.set('--primary', colorScheme.primary);
    this.variables.set('--secondary', colorScheme.secondary);
    this.variables.set('--accent', colorScheme.accent);
    this.variables.set('--font-family', typography.fontFamily);
    
    this.applyStyles();
  }

  private applyStyles() {
    const root = document.documentElement;
    this.variables.forEach((value, key) => {
      root.style.setProperty(key, value);
    });
  }
}

export const styleManager = StyleManager.getInstance();
