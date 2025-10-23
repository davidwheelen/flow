/**
 * CORS Middleware
 * 
 * Restricts API access to the Flow frontend only.
 * In production, only allows requests from the frontend service.
 */

import cors from 'cors';
import { logError } from '../utils/logger.js';
import { ERROR_CODES } from '../utils/errors.js';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:2727';

// Allow multiple origins for different access patterns
const allowedOrigins = [
  'http://localhost:2727',
  'http://127.0.0.1:2727',
  'http://flow:2727',
  FRONTEND_URL, // From environment variable
];

/**
 * CORS options - only allow requests from Flow frontend
 */
export const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.) in development
    if (!origin && process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }

    // Check if origin is in allowed list
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logError(
        ERROR_CODES.CORS_BLOCKED,
        'CORS blocked request from unauthorized origin',
        { origin, allowedOrigins }
      );
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

/**
 * CORS middleware configured for Flow frontend
 */
export const corsMiddleware = cors(corsOptions);
