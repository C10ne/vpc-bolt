import express from 'express';
import { createServer } from 'http';
import { registerRoutes } from './routes';

const app = express();
const server = createServer(app);

// Middleware
app.use(express.json());
app.use(express.static('dist/public'));

// Register API routes
registerRoutes(app);

// Serve the React app for all non-API routes
app.get('*', (req, res) => {
  res.sendFile('index.html', { root: 'dist/public' });
});

const PORT = process.env.PORT || 80;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default server;