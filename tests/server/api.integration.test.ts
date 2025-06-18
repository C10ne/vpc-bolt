import request from 'supertest';
import express, { Express } from 'express';
import http from 'http';
import { registerRoutes } from '../../server/routes';
import { storage, IStorage } from '../../server/storage'; // Import storage and its type for mocking
import { vi, describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import type { TemplateRecord, Project, InsertTemplate, InsertProject, User, InsertUser } from '@shared/schema';

// Mock the actual storage module
vi.mock('../../server/storage', () => {
  // Create a mock storage object that adheres to IStorage
  const mockStorageImpl: IStorage = {
    getUser: vi.fn(),
    getUserByUsername: vi.fn(),
    createUser: vi.fn(),
    getTemplates: vi.fn(),
    getTemplate: vi.fn(),
    createTemplate: vi.fn(),
    updateTemplate: vi.fn(),
    deleteTemplate: vi.fn(),
    getProjects: vi.fn(),
    getProject: vi.fn(),
    createProject: vi.fn(),
    updateProject: vi.fn(),
    deleteProject: vi.fn(),
  };
  // The module exports an instance named 'storage', so we mock that.
  return { storage: mockStorageImpl };
});

// Type assertion for the mocked storage to use it with type safety
const mockedStorage = storage as unknown as Record<keyof IStorage, vi.Mock>;

let app: Express;
let server: http.Server;

describe('API Integration Tests', () => {
  beforeAll(async () => {
    app = express();
    app.use(express.json()); // Crucial: Add JSON parsing middleware
    // registerRoutes is async and returns the server instance
    server = await registerRoutes(app);
    // No need to call app.listen() as registerRoutes handles server creation
    // For supertest, we can pass the app or the server. Using app is common.
  });

  afterAll((done) => {
    // Close the server after all tests are done
    if (server) {
      server.close(done);
    } else {
      done();
    }
  });

  beforeEach(() => {
    // Reset all mock implementations and call history before each test
    vi.resetAllMocks();

    // Default mock implementations (can be overridden in specific tests)
    // Users - not directly tested by these routes but good to have safe defaults
    mockedStorage.getUser.mockResolvedValue(undefined);
    mockedStorage.getUserByUsername.mockResolvedValue(undefined);
    mockedStorage.createUser.mockImplementation(async (user: InsertUser) => ({ ...user, id: Date.now() }) as User);

    // Templates
    mockedStorage.getTemplates.mockResolvedValue([]);
    mockedStorage.getTemplate.mockResolvedValue(undefined);
    mockedStorage.createTemplate.mockImplementation(async (tmpl: InsertTemplate) => ({ ...tmpl, id: Date.now(), createdAt: new Date() }) as TemplateRecord);
    mockedStorage.updateTemplate.mockImplementation(async (id: number, tmpl: Partial<InsertTemplate>) => ({ ...tmpl, id, name: tmpl.name || "Updated Template", createdAt: new Date() }) as TemplateRecord);
    mockedStorage.deleteTemplate.mockResolvedValue(true);

    // Projects
    mockedStorage.getProjects.mockResolvedValue([]);
    mockedStorage.getProject.mockResolvedValue(undefined);
    mockedStorage.createProject.mockImplementation(async (proj: InsertProject) => ({ ...proj, id: Date.now(), lastSaved: new Date() }) as Project);
    mockedStorage.updateProject.mockImplementation(async (id: number, proj: Partial<InsertProject>) => ({ ...proj, id, name: proj.name || "Updated Project", lastSaved: new Date() }) as Project);
    mockedStorage.deleteProject.mockResolvedValue(true);
  });

  // --- /api/templates tests ---
  describe('/api/templates', () => {
    describe('GET /api/templates', () => {
      it('should return all templates successfully', async () => {
        const mockTemplates: TemplateRecord[] = [
          { id: 1, name: 'Test Template 1', description: 'Desc 1', category: 'test', thumbnail: '', title: 'T1', colors: {}, metadata: {}, createdAt: new Date() },
          { id: 2, name: 'Test Template 2', description: 'Desc 2', category: 'test', thumbnail: '', title: 'T2', colors: {}, metadata: {}, createdAt: new Date() },
        ];
        mockedStorage.getTemplates.mockResolvedValue(mockTemplates);

        const res = await request(app).get('/api/templates');
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockTemplates.map(t => ({...t, createdAt: t.createdAt.toISOString() }))); // Date toISOString
      });

      it('should return 500 on storage error', async () => {
        mockedStorage.getTemplates.mockRejectedValue(new Error('Storage error'));
        const res = await request(app).get('/api/templates');
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: 'Failed to fetch templates' }); // Corrected: error -> message, and text
      });
    });

    describe('GET /api/templates/:id', () => {
      it('should return a single template successfully', async () => {
        const mockTemplate: TemplateRecord = { id: 1, name: 'Test Template 1', description: 'Desc 1', category: 'test', thumbnail: '', title: 'T1', colors: {primary: "#fff", secondary: "#000"}, metadata: {}, createdAt: new Date() }; // Added valid colors
        mockedStorage.getTemplate.mockResolvedValue(mockTemplate);

        const res = await request(app).get('/api/templates/1');
        expect(res.status).toBe(200);
        expect(res.body).toEqual({...mockTemplate, createdAt: mockTemplate.createdAt.toISOString() });
      });

      it('should return 404 if template not found', async () => {
        mockedStorage.getTemplate.mockResolvedValue(undefined);
        const res = await request(app).get('/api/templates/999');
        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: 'Template not found' }); // Corrected: error -> message
      });

      it('should return 400 for invalid ID format', async () => {
        const res = await request(app).get('/api/templates/invalid-id');
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: 'Invalid template ID' }); // Corrected: error -> message
      });

      it('should return 500 on storage error', async () => {
        mockedStorage.getTemplate.mockRejectedValue(new Error('Storage error'));
        const res = await request(app).get('/api/templates/1');
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: 'Failed to fetch template' }); // Corrected: error -> message, and text
      });
    });

    describe('POST /api/templates', () => {
      it('should create a template successfully', async () => {
        const newTemplateData: InsertTemplate = {
          name: 'Complete Template',
          description: 'A complete description',
          category: 'complete',
          thumbnail: 'http://example.com/thumb.png',
          title: 'Complete Title',
          logoUrl: 'http://example.com/logo.png',
          colors: { primary: '#112233', secondary: '#445566', accent: '#778899' },
          metadata: { author: 'Test Author', tags: ['tag1', 'tag2'] }
        };
        const createdTemplate: TemplateRecord = {
          ...newTemplateData,
          id: 1,
          createdAt: new Date(),
          // Ensure all fields from InsertTemplate are here, plus id and createdAt
          // If some fields in InsertTemplate are optional and not provided, they should be null/undefined in createdTemplate if that's how DB behaves
          description: newTemplateData.description || null,
          thumbnail: newTemplateData.thumbnail || null,
          logoUrl: newTemplateData.logoUrl || null,
          // colors and metadata are objects, if not provided in newTemplateData they would be null
          // but here they are provided. Accent in colors is optional.
          colors: newTemplateData.colors ? { ...newTemplateData.colors, accent: newTemplateData.colors.accent || undefined } : null,
          metadata: newTemplateData.metadata || null,
        };
        mockedStorage.createTemplate.mockResolvedValue(createdTemplate);

        const res = await request(app)
          .post('/api/templates')
          .send(newTemplateData);

        expect(res.status).toBe(201);
        // Clone createdTemplate for expectation, ensuring date is stringified and optional fields match
        const expectedBody = {
            ...createdTemplate,
            createdAt: createdTemplate.createdAt.toISOString(),
            // Ensure optional fields not in newTemplateData are handled if DB makes them null
            // This depends on how Spread syntax handles potentially undefined optional fields from newTemplateData if they were omitted
        };
        // If an optional field like 'accent' in colors is undefined in newTemplateData but defined with a value in createdTemplate (e.g. by DB default),
        // the direct spread might not be perfectly identical. For this test, we assume createdTemplate reflects the true state post-creation.
        expect(res.body).toEqual(expectedBody);
      });

      it('should return 400 on validation error (e.g., missing name)', async () => {
        const invalidTemplateData = { category: 'test', title: 'Test Title', colors: {primary: "#111", secondary: "#222"} }; // Missing name
        const res = await request(app)
          .post('/api/templates')
          .send(invalidTemplateData);
        expect(res.status).toBe(400);
        expect(typeof res.body.message).toBe('string');
        expect(res.body.message).toContain("Validation error");
      });

      it('should return 500 on storage error', async () => {
        mockedStorage.createTemplate.mockRejectedValue(new Error('Storage error'));
        // Use a known valid payload for this test
        const validTemplateData: InsertTemplate = {
          name: 'Valid Template for 500 test',
          description: 'A valid description',
          category: 'valid',
          thumbnail: 'http://example.com/thumb.png',
          title: 'Valid Title',
          logoUrl: 'http://example.com/logo.png',
          colors: { primary: '#112233', secondary: '#445566' },
          metadata: { author: 'Test Author' }
        };
        const res = await request(app)
          .post('/api/templates')
          .send(validTemplateData);
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: 'Failed to create template' });
      });
    });

    describe('PUT /api/templates/:id', () => {
      it('should update a template successfully', async () => {
        const updateData: Partial<InsertTemplate> = { name: 'Updated Name' };
        // Ensure the mock response for updateTemplate includes all required fields of TemplateRecord
        const updatedTemplate: TemplateRecord = {
          id: 1,
          name: 'Updated Name',
          description: 'Original Desc',
          category: 'test',
          thumbnail: '',
          title: 'OrigTitle',
          colors: {primary: "#fff", secondary: "#000"},
          metadata: {},
          createdAt: new Date()
        };
        mockedStorage.updateTemplate.mockResolvedValue(updatedTemplate);

        const res = await request(app)
          .put('/api/templates/1')
          .send(updateData);
        expect(res.status).toBe(200);
        expect(res.body).toEqual({...updatedTemplate, createdAt: updatedTemplate.createdAt.toISOString()});
      });

      it('should return 404 if template to update not found', async () => {
        mockedStorage.updateTemplate.mockResolvedValue(undefined);
        const res = await request(app)
          .put('/api/templates/999')
          .send({ name: 'Non Existent' });
        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: 'Template not found' }); // Corrected: error -> message
      });

      it('should return 400 for invalid ID format', async () => {
        const res = await request(app)
          .put('/api/templates/invalid-id')
          .send({ name: 'Test' });
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: 'Invalid template ID' }); // Corrected: error -> message
      });

      it('should return 400 on validation error', async () => {
        const res = await request(app)
          .put('/api/templates/1')
          .send({ name: 123 }); // Invalid type for name
        expect(res.status).toBe(400);
        expect(typeof res.body.message).toBe('string');
        expect(res.body.message).toContain("Validation error");
      });

      it('should return 500 on storage error', async () => {
        mockedStorage.updateTemplate.mockRejectedValue(new Error('Storage error'));
        const res = await request(app)
          .put('/api/templates/1')
          .send({ name: 'Error Case' });
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: 'Failed to update template' }); // Corrected: error -> message
      });
    });

    describe('DELETE /api/templates/:id', () => {
      it('should delete a template successfully', async () => {
        mockedStorage.deleteTemplate.mockResolvedValue(true);
        const res = await request(app).delete('/api/templates/1');
        expect(res.status).toBe(204);
      });

      it('should return 404 if template to delete not found', async () => {
        mockedStorage.deleteTemplate.mockResolvedValue(false);
        const res = await request(app).delete('/api/templates/999');
        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: 'Template not found' }); // Corrected: error -> message
      });

      it('should return 400 for invalid ID format', async () => {
        const res = await request(app).delete('/api/templates/invalid-id');
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: 'Invalid template ID' }); // Corrected: error -> message
      });

      it('should return 500 on storage error', async () => {
        mockedStorage.deleteTemplate.mockRejectedValue(new Error('Storage error'));
        const res = await request(app).delete('/api/templates/1');
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: 'Failed to delete template' }); // Corrected: error -> message
      });
    });
  });

  // --- /api/projects tests (Similar structure to templates) ---
  describe('/api/projects', () => {
    describe('GET /api/projects', () => {
      it('should return all projects successfully when no userId is provided', async () => {
        const mockProjects: Project[] = [
          { id: 1, userId: 1, name: 'Project Alpha', data: {id:1, name:"T", title:"T", category:"c", sections:[]}, lastSaved: new Date(), templateId: 1 },
          { id: 2, userId: 2, name: 'Project Beta', data: {id:1, name:"T", title:"T", category:"c", sections:[]}, lastSaved: new Date(), templateId: 1 },
        ];
        mockedStorage.getProjects.mockResolvedValue(mockProjects);

        const res = await request(app).get('/api/projects');
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockProjects.map(p => ({ ...p, lastSaved: p.lastSaved.toISOString() })));
        expect(mockedStorage.getProjects).toHaveBeenCalledWith(undefined);
      });

      it('should return projects for a specific userId when provided', async () => {
        const userId = 1;
        const mockUserProjects: Project[] = [
          { id: 1, userId: userId, name: 'Project Alpha', data: {id:1, name:"T", title:"T", category:"c", sections:[]}, lastSaved: new Date(), templateId: 1 },
        ];
        mockedStorage.getProjects.mockResolvedValue(mockUserProjects);

        const res = await request(app).get(`/api/projects?userId=${userId}`);
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockUserProjects.map(p => ({ ...p, lastSaved: p.lastSaved.toISOString() })));
        expect(mockedStorage.getProjects).toHaveBeenCalledWith(userId);
      });

      it('should return 400 if userId is not a valid number', async () => {
        const res = await request(app).get('/api/projects?userId=abc');
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: 'Invalid user ID' }); // Corrected: error -> message
      });

      it('should return 500 on storage error', async () => {
        mockedStorage.getProjects.mockRejectedValue(new Error('Storage error'));
        const res = await request(app).get('/api/projects');
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: 'Failed to fetch projects' }); // Corrected: error -> message, and text
      });
    });

    describe('GET /api/projects/:id', () => {
      it('should return a single project successfully', async () => {
        const mockProject: Project = { id: 1, userId: 1, name: 'Project Alpha', data: {id:1, name:"T", title:"T", category:"c", sections:[]}, lastSaved: new Date(), templateId: 1 };
        mockedStorage.getProject.mockResolvedValue(mockProject);

        const res = await request(app).get('/api/projects/1');
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ ...mockProject, lastSaved: mockProject.lastSaved.toISOString() });
      });

      it('should return 404 if project not found', async () => {
        mockedStorage.getProject.mockResolvedValue(undefined);
        const res = await request(app).get('/api/projects/999');
        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: 'Project not found' }); // Corrected: error -> message
      });

      it('should return 400 for invalid ID format', async () => {
        const res = await request(app).get('/api/projects/invalid-id');
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: 'Invalid project ID' }); // Corrected: error -> message
      });

      it('should return 500 on storage error', async () => {
        mockedStorage.getProject.mockRejectedValue(new Error('Storage error'));
        const res = await request(app).get('/api/projects/1');
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: 'Failed to fetch project' }); // Corrected: error -> message, and text
      });
    });

    describe('POST /api/projects', () => {
      it('should create a project successfully', async () => {
        const newProjectData: InsertProject = {
          userId: 1,
          name: 'Complete Project',
          templateId: 1,
          data: { // Valid Template structure for 'data'
            id: 1, // This 'id' is for the Template structure within 'data'
            name: 'Base Template for Project',
            title: 'Project Data Title',
            category: 'project_data',
            description: 'Project template data description',
            thumbnail: 'http://example.com/project_thumb.png',
            logoUrl: 'http://example.com/project_logo.png',
            colors: { primary: '#abcdef', secondary: '#123456' },
            sections: []
          }
        };
        const createdProject: Project = {
            ...newProjectData,
            id: 1, // This 'id' is for the Project itself
            lastSaved: new Date(),
            // Ensure all fields from InsertProject are here
            data: newProjectData.data // Explicitly carry over the complex data object
        };
        mockedStorage.createProject.mockResolvedValue(createdProject);

        const res = await request(app)
          .post('/api/projects')
          .send(newProjectData);

        expect(res.status).toBe(201);
        const expectedBody = {
            ...createdProject,
            lastSaved: createdProject.lastSaved.toISOString(),
            // Ensure nested 'data' object is also correctly structured if it contains dates or needs specific assertion
        };
        expect(res.body).toEqual(expectedBody);
      });

      it('should return 400 on validation error (e.g., missing name or userId)', async () => {
        const invalidProjectData = { templateId: 1, data: null }; // Missing name, userId, data is null
        const res = await request(app)
          .post('/api/projects')
          .send(invalidProjectData);
        expect(res.status).toBe(400);
        expect(typeof res.body.message).toBe('string');
        expect(res.body.message).toContain("Validation error");
      });

      it('should return 500 on storage error', async () => {
        mockedStorage.createProject.mockRejectedValue(new Error('Storage error'));
        // Use a known valid payload
        const validProjectData: InsertProject = {
          userId: 1,
          name: 'Valid Project for 500 test',
          templateId: 1,
          data: { id: 1, name: 'T', title: 'T', category: 'c', sections: [] }
        };
        const res = await request(app)
          .post('/api/projects')
          .send(validProjectData);
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: 'Failed to create project' });
      });
    });

    describe('PUT /api/projects/:id', () => {
      it('should update a project successfully', async () => {
        const updateData: Partial<InsertProject> = { name: 'Updated Project Name' };
        const updatedProject: Project = { id: 1, userId: 1, name: 'Updated Project Name', templateId:1, data: {id:1, name:"T", title:"T", category:"c", sections:[]}, lastSaved: new Date() };
        mockedStorage.updateProject.mockResolvedValue(updatedProject);

        const res = await request(app)
          .put('/api/projects/1')
          .send(updateData);
        expect(res.status).toBe(200);
        expect(res.body).toEqual({...updatedProject, lastSaved: updatedProject.lastSaved.toISOString()});
      });

      it('should return 404 if project to update not found', async () => {
        mockedStorage.updateProject.mockResolvedValue(undefined);
        const res = await request(app)
          .put('/api/projects/999')
          .send({ name: 'Non Existent' });
        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: 'Project not found' }); // Corrected: error -> message
      });

      it('should return 400 for invalid ID format', async () => {
        const res = await request(app)
          .put('/api/projects/invalid-id')
          .send({ name: 'Test' });
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: 'Invalid project ID' }); // Corrected: error -> message
      });

      it('should return 400 on validation error (e.g., name as empty string)', async () => {
        const res = await request(app)
          .put('/api/projects/1')
          .send({ name: 123 }); // Invalid type for name
        expect(res.status).toBe(400);
        expect(typeof res.body.message).toBe('string');
        expect(res.body.message).toContain("Validation error");
      });

      it('should return 500 on storage error', async () => {
        mockedStorage.updateProject.mockRejectedValue(new Error('Storage error'));
        const res = await request(app)
          .put('/api/projects/1')
          .send({ name: 'Error Case Project' });
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: 'Failed to update project' }); // Corrected: error -> message
      });
    });

    describe('DELETE /api/projects/:id', () => {
      it('should delete a project successfully', async () => {
        mockedStorage.deleteProject.mockResolvedValue(true);
        const res = await request(app).delete('/api/projects/1');
        expect(res.status).toBe(204);
      });

      it('should return 404 if project to delete not found', async () => {
        mockedStorage.deleteProject.mockResolvedValue(false);
        const res = await request(app).delete('/api/projects/999');
        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: 'Project not found' }); // Corrected: error -> message
      });

      it('should return 400 for invalid ID format', async () => {
        const res = await request(app).delete('/api/projects/invalid-id');
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: 'Invalid project ID' }); // Corrected: error -> message
      });

      it('should return 500 on storage error', async () => {
        mockedStorage.deleteProject.mockRejectedValue(new Error('Storage error'));
        const res = await request(app).delete('/api/projects/1');
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: 'Failed to delete project' }); // Corrected: error -> message
      });
    });
  });

  // --- /api/templates/export tests ---
  describe('/api/templates/export', () => {
    it('POST /api/templates/export should return success', async () => {
      const mockTemplateData = { html: "<html><body>Mock Content</body></html>", design: {} }; // This body is sent but not strictly validated by the current route
      const res = await request(app)
        .post('/api/templates/export')
        .send(mockTemplateData);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ success: true, message: "Template exported successfully", exportUrl: "/exports/template-export.html" }); // Corrected expectation
    });
  });
});
