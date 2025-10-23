/**
 * CORS Middleware
 * 
 * Two-tier CORS system:
 * 1. Auto-allows all requests from port 2727 (default frontend port)
 * 2. Loads custom origins from config file for edge cases
 */

import cors from 'cors';
import { logError } from '../utils/logger.js';
import { ERROR_CODES } from '../utils/errors.js';
import { getCustomOrigins } from '../services/securityConfig.js';

const FRONTEND_PORT = '2727';

/**
 * CORS options - allow port 2727 and custom origins
 */
export const corsOptions: cors.CorsOptions = {
  origin: async (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.) in development
    if (!origin && process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }

    if (!origin) {
      return callback(null, true);
    }

    try {
      const originUrl = new URL(origin);
      
      // Auto-allow port 2727 from any IP
      if (originUrl.port === FRONTEND_PORT) {
        return callback(null, true);
      }

      // Check custom origins
      const customOrigins = await getCustomOrigins();
      if (customOrigins.includes(origin)) {
        return callback(null, true);
      }

      logError(ERROR_CODES.CORS_BLOCKED, 'CORS blocked', { origin });
      callback(new Error('Not allowed by CORS'));
    } catch (error) {
      logError(ERROR_CODES.CORS_BLOCKED, 'Invalid origin URL', { origin });
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
