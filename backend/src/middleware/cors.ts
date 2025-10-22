/**
 * CORS Middleware
 * 
 * Restricts API access to the Flow frontend only.
 * In production, only allows requests from the frontend service.
 */

import cors from 'cors';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:2727';

/**
 * CORS options - only allow requests from Flow frontend
 */
export const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests in dev)
    if (!origin && process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }

    // In production, only allow the frontend URL
    if (origin === FRONTEND_URL || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
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
