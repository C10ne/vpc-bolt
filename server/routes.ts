import express, { Request, Response } from 'express';
import { storage } from './storage';
import { insertTemplateSchema, insertProjectSchema } from '@shared/schema';
import { ZodError } from 'zod';
import { templates } from '../client/src/lib/templates';

export function registerRoutes(app: express.Application) {
  // Templates routes
  app.get('/api/templates', async (req: Request, res: Response) => {
    try {
      // For now, return mock data since we don't have a database set up
      // In production, this would use: const templates = await storage.getTemplates();
      console.log('GET /api/templates - returning mock data');
      res.json(templates);
    } catch (error) {
      console.error('Error fetching templates:', error);
      res.status(500).json({ message: 'Failed to fetch templates' });
    }
  });

  app.get('/api/templates/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid template ID' });
      }

      // For now, return mock data
      const template = templates.find(t => t.id === id);
      if (!template) {
        return res.status(404).json({ message: 'Template not found' });
      }

      console.log(`GET /api/templates/${id} - returning mock data`);
      res.json(template);
    } catch (error) {
      console.error('Error fetching template:', error);
      res.status(500).json({ message: 'Failed to fetch template' });
    }
  });

  app.post('/api/templates', async (req: Request, res: Response) => {
    try {
      const templateData = insertTemplateSchema.parse(req.body);
      const template = await storage.createTemplate(templateData);
      res.status(201).json(template);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: `Validation error: ${error.message}` });
      }
      console.error('Error creating template:', error);
      res.status(500).json({ message: 'Failed to create template' });
    }
  });

  app.put('/api/templates/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid template ID' });
      }

      const templateData = insertTemplateSchema.partial().parse(req.body);
      const template = await storage.updateTemplate(id, templateData);
      
      if (!template) {
        return res.status(404).json({ message: 'Template not found' });
      }

      res.json(template);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: `Validation error: ${error.message}` });
      }
      console.error('Error updating template:', error);
      res.status(500).json({ message: 'Failed to update template' });
    }
  });

  app.delete('/api/templates/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid template ID' });
      }

      const success = await storage.deleteTemplate(id);
      if (!success) {
        return res.status(404).json({ message: 'Template not found' });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting template:', error);
      res.status(500).json({ message: 'Failed to delete template' });
    }
  });

  // Projects routes
  app.get('/api/projects', async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      if (req.query.userId && isNaN(userId!)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }

      const projects = await storage.getProjects(userId);
      res.json(projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      res.status(500).json({ message: 'Failed to fetch projects' });
    }
  });

  app.get('/api/projects/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid project ID' });
      }

      const project = await storage.getProject(id);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      res.json(project);
    } catch (error) {
      console.error('Error fetching project:', error);
      res.status(500).json({ message: 'Failed to fetch project' });
    }
  });

  app.post('/api/projects', async (req: Request, res: Response) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(projectData);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: `Validation error: ${error.message}` });
      }
      console.error('Error creating project:', error);
      res.status(500).json({ message: 'Failed to create project' });
    }
  });

  app.put('/api/projects/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid project ID' });
      }

      const projectData = insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(id, projectData);
      
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      res.json(project);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: `Validation error: ${error.message}` });
      }
      console.error('Error updating project:', error);
      res.status(500).json({ message: 'Failed to update project' });
    }
  });

  app.delete('/api/projects/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid project ID' });
      }

      const success = await storage.deleteProject(id);
      if (!success) {
        return res.status(404).json({ message: 'Project not found' });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting project:', error);
      res.status(500).json({ message: 'Failed to delete project' });
    }
  });

  // Template export route
  app.post('/api/templates/export', async (req: Request, res: Response) => {
    try {
      // For now, just return success - actual export logic would go here
      res.json({ 
        success: true, 
        message: "Template exported successfully",
        exportUrl: "/exports/template-export.html"
      });
    } catch (error) {
      console.error('Error exporting template:', error);
      res.status(500).json({ message: 'Failed to export template' });
    }
  });

  // Health check endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', message: 'API server is running' });
  });
}