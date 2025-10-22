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
      
      console.log(`[API] Auto-credentials request from ${req.ip} for ${params.url}`);
      
      // Perform browser automation
      const result = await retrieveCredentials(params);
      
      if (result.success) {
        console.log(`[API] Successfully retrieved credentials for ${params.username}`);
        res.json({
          success: true,
          clientId: result.clientId,
          clientSecret: result.clientSecret,
          organizationId: result.organizationId,
        });
      } else {
        console.error(`[API] Failed to retrieve credentials: ${result.error}`);
        res.status(400).json({
          success: false,
          error: result.error || 'Failed to retrieve credentials',
        });
      }
    } catch (error) {
      console.error('[API] Unexpected error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }
);

export default router;
