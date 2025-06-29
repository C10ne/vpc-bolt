import { pgTable, serial, text, timestamp, integer, jsonb } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Templates table
export const templates = pgTable('templates', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  category: text('category').notNull(),
  thumbnail: text('thumbnail'),
  title: text('title').notNull(),
  logoUrl: text('logo_url'),
  colors: jsonb('colors').$type<{
    primary: string;
    secondary: string;
    accent?: string;
  }>(),
  metadata: jsonb('metadata').$type<Record<string, any>>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Template schema for the data structure
export const templateDataSchema = z.object({
  id: z.number(),
  name: z.string(),
  title: z.string(),
  category: z.string(),
  description: z.string().optional(),
  thumbnail: z.string().optional(),
  logoUrl: z.string().optional(),
  colors: z.object({
    primary: z.string(),
    secondary: z.string(),
    accent: z.string().optional(),
  }).optional(),
  sections: z.array(z.any()).default([]),
});

// Projects table
export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  name: text('name').notNull(),
  templateId: integer('template_id').notNull(),
  data: jsonb('data').$type<z.infer<typeof templateDataSchema>>().notNull(),
  lastSaved: timestamp('last_saved').defaultNow().notNull(),
});

// Zod schemas
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertTemplateSchema = createInsertSchema(templates);
export const selectTemplateSchema = createSelectSchema(templates);
export const insertProjectSchema = createInsertSchema(projects);
export const selectProjectSchema = createSelectSchema(projects);

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type TemplateRecord = typeof templates.$inferSelect;
export type InsertTemplate = typeof templates.$inferInsert;
export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;
export type Template = z.infer<typeof templateDataSchema>;