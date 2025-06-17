import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

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
  | "ButtonComponent";

// Section types
export type SectionType = 
  | "HeaderSection" 
  | "HeroSection" 
  | "FeaturedProductsSection" 
  | "TestimonialsSection" 
  | "FooterSection";

// Editability status
export type EditableType =
  | "editable" // Freely editable and replaceable.
  | "locked-replacing" // Component cannot be swapped/replaced; its internal elements *can* be edited.
  | "locked-edit"; // Internal elements of the component *cannot* be edited; the component itself *can* be swapped/replaced (unless its parent section also imposes replacement restrictions).

// Templates table
export const templates = pgTable("templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  thumbnail: text("thumbnail"),
  title: text("title").notNull(),
  logoUrl: text("logo_url"),
  colors: jsonb("colors").$type<{
    primary: string;
    secondary: string;
    accent?: string;
  }>(),
  metadata: jsonb("metadata").$type<{
    author?: string;
    tags?: string[];
    createdAt?: string;
  }>(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTemplateSchema = createInsertSchema(templates).pick({
  name: true,
  description: true,
  category: true,
  thumbnail: true,
  title: true,
  logoUrl: true,
  colors: true,
  metadata: true,
});

// Projects table
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  userId: integer("user_id").references(() => users.id),
  templateId: integer("template_id").references(() => templates.id),
  data: jsonb("data").$type<Template>(),
  lastSaved: timestamp("last_saved").defaultNow(),
});

export const insertProjectSchema = createInsertSchema(projects).pick({
  name: true,
  userId: true,
  templateId: true,
  data: true,
});

// Type definitions for elements, components, sections, and templates

export interface Element {
  id: number;
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
  id: number;
  type: ComponentType;
  editable: EditableType;
  elements: Element[];
  swappableWith?: ComponentType[];
  parameters?: Record<string, any>; // e.g., for holding styling hints like `image-class`
}

export interface Section {
  id: number;
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

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertTemplate = z.infer<typeof insertTemplateSchema>;
export type TemplateRecord = typeof templates.$inferSelect;

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;
