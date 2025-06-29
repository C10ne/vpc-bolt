import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { eq } from 'drizzle-orm';
import { templates, projects, users, type InsertTemplate, type InsertProject, type InsertUser } from '@shared/schema';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

const db = drizzle(pool);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<typeof users.$inferSelect | undefined>;
  getUserByUsername(username: string): Promise<typeof users.$inferSelect | undefined>;
  createUser(user: InsertUser): Promise<typeof users.$inferSelect>;

  // Template methods
  getTemplates(): Promise<(typeof templates.$inferSelect)[]>;
  getTemplate(id: number): Promise<typeof templates.$inferSelect | undefined>;
  createTemplate(template: InsertTemplate): Promise<typeof templates.$inferSelect>;
  updateTemplate(id: number, template: Partial<InsertTemplate>): Promise<typeof templates.$inferSelect | undefined>;
  deleteTemplate(id: number): Promise<boolean>;

  // Project methods
  getProjects(userId?: number): Promise<(typeof projects.$inferSelect)[]>;
  getProject(id: number): Promise<typeof projects.$inferSelect | undefined>;
  createProject(project: InsertProject): Promise<typeof projects.$inferSelect>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<typeof projects.$inferSelect | undefined>;
  deleteProject(id: number): Promise<boolean>;
}

class Storage implements IStorage {
  async getUser(id: number) {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string) {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(user: InsertUser) {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async getTemplates() {
    return await db.select().from(templates);
  }

  async getTemplate(id: number) {
    const result = await db.select().from(templates).where(eq(templates.id, id));
    return result[0];
  }

  async createTemplate(template: InsertTemplate) {
    const result = await db.insert(templates).values(template).returning();
    return result[0];
  }

  async updateTemplate(id: number, template: Partial<InsertTemplate>) {
    const result = await db.update(templates).set(template).where(eq(templates.id, id)).returning();
    return result[0];
  }

  async deleteTemplate(id: number) {
    const result = await db.delete(templates).where(eq(templates.id, id));
    return result.rowCount > 0;
  }

  async getProjects(userId?: number) {
    if (userId) {
      return await db.select().from(projects).where(eq(projects.userId, userId));
    }
    return await db.select().from(projects);
  }

  async getProject(id: number) {
    const result = await db.select().from(projects).where(eq(projects.id, id));
    return result[0];
  }

  async createProject(project: InsertProject) {
    const result = await db.insert(projects).values(project).returning();
    return result[0];
  }

  async updateProject(id: number, project: Partial<InsertProject>) {
    const result = await db.update(projects).set(project).where(eq(projects.id, id)).returning();
    return result[0];
  }

  async deleteProject(id: number) {
    const result = await db.delete(projects).where(eq(projects.id, id));
    return result.rowCount > 0;
  }
}

export const storage = new Storage();