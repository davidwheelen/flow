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
import securityRouter from './routes/security.js';
import { logInfo, logError } from './utils/logger.js';
import { ERROR_CODES } from './utils/errors.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Trust proxy - we're behind nginx
app.set('trust proxy', true);

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
app.use('/api/security', securityRouter);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not found',
  });
});

// Error handler
app.use((err: Error, _req: Request, res: Response) => {
  logError(ERROR_CODES.SERVER_STARTUP_FAILED, 'Server error', { error: err.message, stack: err.stack });
  res.status(500).json({
    error: 'Internal server error',
  });
});

// Start server
app.listen(PORT, () => {
  logInfo('Flow Backend API started', {
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:2727',
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logInfo('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  logInfo('SIGINT signal received: closing HTTP server');
  process.exit(0);
});
