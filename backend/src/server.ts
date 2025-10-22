/**
 * Flow Backend API Server
 * 
 * Express server that provides auto-credentials API endpoint.
 * Runs on port 3001 alongside the React frontend.
 */

import express, { Request, Response } from 'express';
import helmet from 'helmet';
import { corsMiddleware } from './middleware/cors.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import autoCredentialsRouter from './routes/autoCredentials.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// CORS - restrict to frontend only
app.use(corsMiddleware);

// Parse JSON bodies
app.use(express.json());

// General rate limiting
app.use(generalLimiter);

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'flow-backend',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api', autoCredentialsRouter);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not found',
  });
});

// Error handler
app.use((err: Error, _req: Request, res: Response) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Flow Backend API listening on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:2727'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});
