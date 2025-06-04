# VisualPageCraft Development Guidelines

This document provides essential information for developers working on the VisualPageCraft project.

## Build and Configuration Instructions

### Environment Setup

1. **Node.js**: This project requires Node.js (version specified in package.json).

2. **Environment Variables**:
   - `DATABASE_URL`: Required for database connection
   - `PORT`: Optional, defaults to 80

### Development Workflow

1. **Installation**:
   ```bash
   npm install
   ```

2. **Development Mode**:
   ```bash
   npm run dev
   ```
   This starts the server in development mode with hot reloading enabled.

3. **Production Build**:
   ```bash
   npm run build
   npm start
   ```
   The build process uses Vite for the client and esbuild for the server.

### Project Structure

- `client/`: Frontend React application
  - `src/`: Source code
    - `components/`: React components
    - `hooks/`: Custom React hooks
    - `lib/`: Utility libraries
    - `pages/`: Page components
- `server/`: Backend Express application
  - `index.ts`: Main server entry point
  - `routes.ts`: API routes
  - `db.ts`: Database configuration
  - `storage.ts`: Storage handling
- `shared/`: Code shared between client and server
- `tests/`: Test files

### Database Configuration

The project uses Drizzle ORM with PostgreSQL (Neon Serverless). Database schema is defined in `shared/schema.ts`.

To push schema changes to the database:
```bash
npm run db:push
```

## Testing Information

### Testing Setup

The project uses Vitest for testing. Tests are located in the `tests/` directory and follow the naming convention `*.test.ts`.

### Running Tests

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch
```

### Writing Tests

Tests should be placed in the `tests/` directory and named with the `.test.ts` extension. Here's an example of a test file:

```typescript
import { describe, it, expect } from 'vitest';
import { someFunction } from '../path/to/module';

describe('Module Name', () => {
  describe('someFunction', () => {
    it('should do something specific', () => {
      expect(someFunction(input)).toBe(expectedOutput);
    });
  });
});
```

### Test Configuration

The Vitest configuration is in `vitest.config.ts`. It includes:
- Path aliases that match the project's TypeScript configuration
- Node.js as the test environment

## Additional Development Information

### TypeScript Configuration

The project uses TypeScript with strict type checking. The configuration is in `tsconfig.json`.

Path aliases are set up for easier imports:
- `@/*` maps to `client/src/*`
- `@shared/*` maps to `shared/*`

### Vite Configuration

The Vite configuration is in `vite.config.ts`. It includes:
- React plugin
- Runtime error overlay
- Theme plugin
- Path aliases

### Code Style

The project follows these conventions:
- Use TypeScript for type safety
- Use functional components with hooks for React
- Use async/await for asynchronous operations
- Document functions with JSDoc comments

### Debugging

For server-side debugging:
- API requests are logged with path, method, status code, and response time
- In development mode, runtime errors are displayed in an overlay

### Deployment

The application is built as a single package with:
- Client code bundled with Vite
- Server code bundled with esbuild
- Static assets served from the `dist/public` directory