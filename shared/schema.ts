// Type definitions for elements, components, sections, and templates

// Element types
export type ElementType = 
  | "Heading" 
  | "Paragraph" 
  | "Image" 
  | "Button" 
  | "Logo" 
  | "Badge"
  | "Navigation" 
  | "Links" 
  | "SocialLinks" 
  | "Copyright" 
  | "Text" 
  | "Price"
  | "Rating"
  | "Group"
  | "RichText";

// Component types
export type ComponentType = 
  | "Header" 
  | "HeroImage" 
  | "HeroSlider" 
  | "VideoSlider" 
  | "ProductCard" 
  | "Testimonial" 
  | "Footer"
  | "RichTextComponent"
  | "ButtonComponent"
  | "element-container"; // Added

// Section types
export type SectionType = 
  | "HeaderSection" 
  | "HeroSection" 
  | "FeaturedProductsSection" 
  | "TestimonialsSection" 
  | "FooterSection"
  | "BasicSection";          // Added

// Editability status
export type EditableType =
  | "editable" // Freely editable and replaceable.
  | "locked-replacing" // Component cannot be swapped/replaced; its internal elements *can* be edited.
  | "locked-edit"; // Internal elements of the component *cannot* be edited; the component itself *can* be swapped/replaced (unless its parent section also imposes replacement restrictions).



export interface Element {
  id: string; // Changed to string for UUIDs
  type: ElementType;
  // properties will hold specific attributes based on ElementType. For example:
  // For Heading: { text: string; level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'; }
  // For Paragraph: { htmlContent: string; } // Or 'text' for simple paragraphs
  // For Image: { src: string; alt?: string; }
  // For Button: { text: string; actionUrl?: string; style?: string; }
  // For Group: { elements: Element[]; layout?: 'horizontal' | 'vertical'; gap?: string | number; } // Note: Element[] here refers to ElementData in consuming code
  // For RichText: { htmlContent: string; }
  properties: Record<string, any>;
}

export interface Component {
  id: string; // Changed to string for UUIDs
  type: ComponentType;
  editable: EditableType;
  elements: Element[];
  swappableWith?: ComponentType[];
  parameters?: Record<string, any>; // e.g., for holding styling hints like `image-class`
}

export interface Section {
  id: string; // Changed to string for UUIDs
  type: SectionType;
  name: string;
  editable: EditableType;
  allowedComponentTypes?: ComponentType[];
  maxComponents?: number;
  minComponents?: number;
  background?: string;
  spacing?: {
    top?: number;
    bottom?: number;
    between?: number;
  };
  properties?: Record<string, any>;
  components: Component[];
}

export interface Template {
  id: number;
  name: string;
  title: string;
  description?: string;
  category: string;
  thumbnail?: string;
  logoUrl?: string;
  colors?: {
    primary: string;
    secondary: string;
    accent?: string;
  };
  sections: Section[];
}

// User type for client-side use
export interface User {
  id: number;
  username: string;
}

// Project type for client-side use
export interface Project {
  id: number;
  name: string;
  userId: number;
  templateId: number;
  data: Template;
  lastSaved: Date;
}
