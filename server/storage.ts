import { templates, projects, users, type User, type InsertUser, type Template, type Project, type InsertProject, type InsertTemplate, type TemplateRecord } from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Template operations
  getTemplates(): Promise<TemplateRecord[]>;
  getTemplate(id: number): Promise<TemplateRecord | undefined>;
  createTemplate(template: InsertTemplate): Promise<TemplateRecord>;
  updateTemplate(id: number, template: Partial<InsertTemplate>): Promise<TemplateRecord | undefined>;
  deleteTemplate(id: number): Promise<boolean>;

  // Project operations
  getProjects(userId?: number): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private templates: Map<number, TemplateRecord>;
  private projects: Map<number, Project>;
  private userIdCounter: number;
  private templateIdCounter: number;
  private projectIdCounter: number;

  constructor() {
    this.users = new Map();
    this.templates = new Map();
    this.projects = new Map();
    this.userIdCounter = 1;
    this.templateIdCounter = 1;
    this.projectIdCounter = 1;

    // Initialize with default templates
    this.initializeDefaultTemplates();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Template operations
  async getTemplates(): Promise<TemplateRecord[]> {
    return Array.from(this.templates.values());
  }

  async getTemplate(id: number): Promise<TemplateRecord | undefined> {
    return this.templates.get(id);
  }

  async createTemplate(insertTemplate: InsertTemplate): Promise<TemplateRecord> {
    const id = this.templateIdCounter++;
    const createdAt = new Date();
    const template: TemplateRecord = { ...insertTemplate, id, createdAt };
    this.templates.set(id, template);
    return template;
  }

  async updateTemplate(id: number, templateUpdate: Partial<InsertTemplate>): Promise<TemplateRecord | undefined> {
    const template = this.templates.get(id);
    if (!template) return undefined;

    const updatedTemplate = { ...template, ...templateUpdate };
    this.templates.set(id, updatedTemplate);
    return updatedTemplate;
  }

  async deleteTemplate(id: number): Promise<boolean> {
    return this.templates.delete(id);
  }

  // Project operations
  async getProjects(userId?: number): Promise<Project[]> {
    const projects = Array.from(this.projects.values());
    if (userId) {
      return projects.filter(project => project.userId === userId);
    }
    return projects;
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.projectIdCounter++;
    const lastSaved = new Date();
    const project: Project = { ...insertProject, id, lastSaved };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: number, projectUpdate: Partial<InsertProject>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;

    const lastSaved = new Date();
    const updatedProject = { ...project, ...projectUpdate, lastSaved };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: number): Promise<boolean> {
    return this.projects.delete(id);
  }

  // Helper method to initialize default templates
  private initializeDefaultTemplates() {
    // Business template
    const businessTemplate: InsertTemplate = {
      name: "Business Pro",
      description: "Professional template for business websites",
      category: "business",
      thumbnail: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      title: "Business Website",
      colors: {
        primary: "#3B82F6",
        secondary: "#6366F1",
      },
      metadata: {
        tags: ["business", "professional", "corporate"],
      },
    };
    this.createTemplate(businessTemplate);

    // E-commerce template
    const ecommerceTemplate: InsertTemplate = {
      name: "E-commerce Basic",
      description: "Simple template for online stores",
      category: "ecommerce",
      thumbnail: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      title: "Online Store",
      colors: {
        primary: "#3B82F6",
        secondary: "#10B981",
      },
      metadata: {
        tags: ["ecommerce", "shop", "store"],
      },
    };
    this.createTemplate(ecommerceTemplate);

    // Blog template
    const blogTemplate: InsertTemplate = {
      name: "Blog Standard",
      description: "Clean template for blogs and articles",
      category: "blog",
      thumbnail: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      title: "Blog",
      colors: {
        primary: "#8B5CF6",
        secondary: "#EC4899",
      },
      metadata: {
        tags: ["blog", "writing", "content"],
      },
    };
    this.createTemplate(blogTemplate);

    // Portfolio template
    const portfolioTemplate: InsertTemplate = {
      name: "Portfolio Creative",
      description: "Showcase your work with this creative portfolio",
      category: "portfolio",
      thumbnail: "https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      title: "My Portfolio",
      colors: {
        primary: "#6366F1",
        secondary: "#F97316",
      },
      metadata: {
        tags: ["portfolio", "creative", "showcase"],
      },
    };
    this.createTemplate(portfolioTemplate);
  }
}

export const storage = new MemStorage();
