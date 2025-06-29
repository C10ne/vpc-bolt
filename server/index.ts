import express from 'express';
import { createServer } from 'http';
import { registerRoutes } from './routes';
import path from 'path';

const app = express();
const server = createServer(app);

// Middleware
app.use(express.json());

// In development, we don't serve static files from dist/public
// Instead, Vite dev server handles the frontend
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('dist/public'));
}

// Register API routes
registerRoutes(app);

// In development, let Vite handle frontend routes
// In production, serve the React app for all non-API routes
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.resolve('dist/public/index.html'));
  });
} else {
  // In development, just return a simple message for non-API routes
  app.get('*', (req, res) => {
    res.json({ 
      message: 'API server running. Frontend should be served by Vite dev server on a different port.',
      api: 'Available at /api/*',
      frontend: 'Run `npm run dev:client` to start Vite dev server'
    });
  });
}

const PORT = process.env.PORT || 80;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  if (process.env.NODE_ENV !== 'production') {
    console.log('API endpoints available at /api/*');
    console.log('Frontend should be served by Vite dev server (typically on port 5173)');
  }
});

export default server;