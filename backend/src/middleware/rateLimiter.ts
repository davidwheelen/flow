/**
 * Rate Limiter Middleware
 * 
 * Limits auto-credentials requests to prevent abuse.
 * Default: 10 requests per 15 minutes per IP address.
 */

import rateLimit from 'express-rate-limit';

/**
 * Rate limiter for auto-credentials endpoint
 * 
 * Limits:
 * - 10 requests per 15 minutes
 * - Per IP address
 * - Returns 429 Too Many Requests when exceeded
 */
export const autoCredentialsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: {
    error: 'Too many auto-credentials requests from this IP, please try again after 15 minutes',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Skip rate limiting in development if needed
  skip: () => {
    if (process.env.NODE_ENV === 'development' && process.env.SKIP_RATE_LIMIT === 'true') {
      return true;
    }
    return false;
  },
});

/**
 * General API rate limiter
 * 
 * Limits:
 * - 100 requests per 15 minutes
 * - Per IP address
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again after 15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
