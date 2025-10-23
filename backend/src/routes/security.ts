/**
 * Security API Routes
 * 
 * Manages custom allowed origins for CORS policy.
 * 
 * GET    /api/security/origins      - List custom origins
 * POST   /api/security/origins      - Add custom origin
 * DELETE /api/security/origins/:id  - Remove custom origin
 */

import { Router, Request, Response } from 'express';
import { 
  getAllCustomOrigins, 
  addCustomOrigin, 
  removeCustomOrigin 
} from '../services/securityConfig.js';
import { logInfo, logError } from '../utils/logger.js';
import { ERROR_CODES, createErrorResponse } from '../utils/errors.js';

const router = Router();

/**
 * GET /api/security/origins
 * List all custom allowed origins
 */
router.get('/origins', async (_req: Request, res: Response): Promise<void> => {
  try {
    const origins = await getAllCustomOrigins();
    res.json({
      success: true,
      origins,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to get origins';
    logError(ERROR_CODES.BACKEND_NOT_AVAILABLE, 'Failed to get origins', { error: errorMessage });
    res.status(500).json(createErrorResponse(ERROR_CODES.BACKEND_NOT_AVAILABLE, errorMessage));
  }
});

/**
 * POST /api/security/origins
 * Add a new custom origin
 * 
 * Body: { origin: string, description?: string }
 */
router.post('/origins', async (req: Request, res: Response): Promise<void> => {
  try {
    const { origin, description } = req.body;

    // Validate origin
    if (!origin || typeof origin !== 'string') {
      res.status(400).json(createErrorResponse(
        ERROR_CODES.MISSING_PARAMETERS,
        'Origin is required'
      ));
      return;
    }

    // Validate origin format
    try {
      new URL(origin);
    } catch {
      res.status(400).json(createErrorResponse(
        ERROR_CODES.INVALID_URL,
        'Invalid origin URL format'
      ));
      return;
    }

    const newOrigin = await addCustomOrigin(origin, description);
    
    logInfo('Custom origin added', { origin });
    res.json({
      success: true,
      origin: newOrigin,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to add origin';
    
    if (errorMessage.includes('already exists')) {
      res.status(409).json(createErrorResponse(
        ERROR_CODES.VALIDATION_ERROR,
        'Origin already exists'
      ));
      return;
    }
    
    logError(ERROR_CODES.BACKEND_NOT_AVAILABLE, 'Failed to add origin', { error: errorMessage });
    res.status(500).json(createErrorResponse(ERROR_CODES.BACKEND_NOT_AVAILABLE, errorMessage));
  }
});

/**
 * DELETE /api/security/origins/:id
 * Remove a custom origin
 */
router.delete('/origins/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json(createErrorResponse(
        ERROR_CODES.MISSING_PARAMETERS,
        'Origin ID is required'
      ));
      return;
    }

    const removed = await removeCustomOrigin(id);
    
    if (!removed) {
      res.status(404).json(createErrorResponse(
        ERROR_CODES.VALIDATION_ERROR,
        'Origin not found'
      ));
      return;
    }

    logInfo('Custom origin removed', { id });
    res.json({
      success: true,
      message: 'Origin removed successfully',
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to remove origin';
    logError(ERROR_CODES.BACKEND_NOT_AVAILABLE, 'Failed to remove origin', { error: errorMessage });
    res.status(500).json(createErrorResponse(ERROR_CODES.BACKEND_NOT_AVAILABLE, errorMessage));
  }
});

export default router;
