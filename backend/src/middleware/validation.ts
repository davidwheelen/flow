/**
 * Request Validation Middleware
 * 
 * Validates incoming requests using Zod schemas.
 */

import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

/**
 * Schema for auto-credentials request
 */
export const autoCredentialsSchema = z.object({
  url: z.string().url('Invalid URL format'),
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  appName: z.string().optional().default('Flow - Device Monitor'),
});

export type AutoCredentialsRequest = z.infer<typeof autoCredentialsSchema>;

/**
 * Middleware to validate auto-credentials request body
 */
export function validateAutoCredentials(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    // Validate and parse request body
    const validated = autoCredentialsSchema.parse(req.body);
    
    // Replace request body with validated data
    req.body = validated;
    
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      });
      return;
    }
    
    res.status(400).json({
      success: false,
      error: 'Invalid request data',
    });
  }
}
