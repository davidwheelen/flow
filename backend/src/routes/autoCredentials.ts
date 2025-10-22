/**
 * Auto-Credentials API Route
 * 
 * POST /api/auto-credentials
 * Handles automatic OAuth credential retrieval requests.
 */

import { Router, Request, Response } from 'express';
import { validateAutoCredentials, AutoCredentialsRequest } from '../middleware/validation.js';
import { autoCredentialsLimiter } from '../middleware/rateLimiter.js';
import { retrieveCredentials } from '../services/playwrightAutomation.js';
import { logInfo, logError } from '../utils/logger.js';
import { ERROR_CODES, createErrorResponse } from '../utils/errors.js';

const router = Router();

/**
 * POST /api/auto-credentials
 * 
 * Automatically retrieve OAuth credentials using browser automation
 * 
 * Request body:
 * {
 *   url: string;          // InControl2/ICVA URL
 *   username: string;     // Username or email
 *   password: string;     // Password
 *   appName?: string;     // Application name (optional)
 * }
 * 
 * Response:
 * {
 *   success: boolean;
 *   clientId?: string;
 *   clientSecret?: string;
 *   organizationId?: string;
 *   error?: string;
 * }
 */
router.post(
  '/auto-credentials',
  autoCredentialsLimiter,
  validateAutoCredentials,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const params = req.body as AutoCredentialsRequest;
      
      logInfo('Auto-credentials request received', { 
        ip: req.ip, 
        url: params.url, 
        username: params.username 
      });
      
      // Perform browser automation
      const result = await retrieveCredentials(params);
      
      if (result.success) {
        logInfo('Successfully retrieved credentials', { username: params.username });
        res.json({
          success: true,
          clientId: result.clientId,
          clientSecret: result.clientSecret,
          organizationId: result.organizationId,
        });
      } else {
        logError(
          result.errorCode || ERROR_CODES.NETWORK_ERROR,
          'Failed to retrieve credentials',
          { username: params.username, error: result.error }
        );
        
        const errorResponse = result.errorCode 
          ? createErrorResponse(result.errorCode, result.error)
          : {
              success: false as const,
              errorCode: ERROR_CODES.NETWORK_ERROR,
              errorMessage: result.error || 'Failed to retrieve credentials',
              timestamp: new Date().toISOString(),
            };
        
        res.status(400).json(errorResponse);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Internal server error';
      logError(ERROR_CODES.BACKEND_NOT_AVAILABLE, 'Unexpected error in auto-credentials', { error: errorMessage });
      
      res.status(500).json(createErrorResponse(
        ERROR_CODES.BACKEND_NOT_AVAILABLE,
        errorMessage
      ));
    }
  }
);

export default router;
