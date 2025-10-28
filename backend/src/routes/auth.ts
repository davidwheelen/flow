/**
 * Authentication API Routes
 * 
 * Proxies OAuth2 token requests to InControl2 API to avoid CORS issues.
 * Also manages credential storage on the backend.
 * 
 * POST /api/auth/token - Get OAuth2 token from InControl2
 * POST /api/auth/credentials - Store credentials
 * GET /api/auth/credentials - Retrieve credentials
 * DELETE /api/auth/credentials - Clear credentials
 */

import { Router, Request, Response } from 'express';
import axios from 'axios';
import { logInfo, logError } from '../utils/logger.js';
import { ERROR_CODES, createErrorResponse } from '../utils/errors.js';
import * as secureStorage from '../utils/secureStorage.js';

const router = Router();

// Token expiration constants
const DEFAULT_TOKEN_EXPIRY_SECONDS = 3600; // 1 hour
const TOKEN_REFRESH_BUFFER_SECONDS = 60; // Refresh 60s before expiry

/**
 * POST /api/auth/token
 * Proxy OAuth2 token requests to InControl2 API
 * 
 * Body: {
 *   apiUrl: string,
 *   clientId: string,
 *   clientSecret: string
 * }
 */
router.post('/token', async (req: Request, res: Response): Promise<void> => {
  try {
    const { apiUrl, clientId, clientSecret } = req.body;

    // Validate required parameters
    if (!apiUrl || !clientId || !clientSecret) {
      res.status(400).json(createErrorResponse(
        ERROR_CODES.MISSING_PARAMETERS,
        'apiUrl, clientId, and clientSecret are required'
      ));
      return;
    }

    // Validate URL format and security
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(apiUrl);
    } catch {
      res.status(400).json(createErrorResponse(
        ERROR_CODES.INVALID_URL,
        'Invalid apiUrl format'
      ));
      return;
    }

    // Security: Only allow HTTPS protocol
    if (parsedUrl.protocol !== 'https:') {
      res.status(400).json(createErrorResponse(
        ERROR_CODES.INVALID_URL,
        'Only HTTPS URLs are allowed for security'
      ));
      return;
    }

    // Security: Validate it's a legitimate InControl2/ICVA domain
    // Allow: incontrol2.peplink.com, api.ic.peplink.com, or custom ICVA servers (not localhost/private IPs)
    const hostname = parsedUrl.hostname.toLowerCase();
    const isValidInControl2Domain = hostname.endsWith('.peplink.com') || hostname.endsWith('.pepwave.com');
    const isPrivateIP = /^(10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.|127\.|localhost$)/.test(hostname);
    
    if (!isValidInControl2Domain && isPrivateIP) {
      res.status(400).json(createErrorResponse(
        ERROR_CODES.INVALID_URL,
        'Cannot proxy requests to private IP addresses or localhost'
      ));
      return;
    }

    // Construct token URL
    const tokenUrl = `${apiUrl}/api/oauth2/token`;

    // Prepare form data
    const formData = new URLSearchParams();
    formData.append('client_id', clientId);
    formData.append('client_secret', clientSecret);
    formData.append('grant_type', 'client_credentials');

    logInfo('Proxying OAuth2 token request', { apiUrl: parsedUrl.origin });

    // Make request to InControl2 API
    // CodeQL: This URL is validated above to prevent SSRF:
    // - Only HTTPS allowed
    // - Private IPs and localhost blocked
    // - Only legitimate InControl2/Pepwave domains or public ICVA servers allowed
    const response = await axios.post(tokenUrl, formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      timeout: 10000,
    });

    // Log success
    logInfo('OAuth2 token retrieved successfully', {
      apiUrl: parsedUrl.origin,
      tokenType: response.data.token_type,
      expiresIn: response.data.expires_in,
    });

    // Return wrapped response in standard format
    res.json({
      success: true,
      data: {
        access_token: response.data.access_token,
        token_type: response.data.token_type || 'Bearer',
        expires_in: response.data.expires_in,
        expiresAt: Date.now() + ((response.data.expires_in || DEFAULT_TOKEN_EXPIRY_SECONDS) - TOKEN_REFRESH_BUFFER_SECONDS) * 1000,
      },
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const errorMessage = error.response?.data?.error_description 
        || error.response?.data?.error 
        || error.message 
        || 'OAuth2 token request failed';
      
      logError(ERROR_CODES.INVALID_CREDENTIALS, 'OAuth2 token request failed', {
        status,
        error: errorMessage,
      });

      // Return appropriate error based on status code
      if (status === 401 || status === 403) {
        res.status(status).json(createErrorResponse(
          ERROR_CODES.INVALID_CREDENTIALS,
          'Invalid client credentials'
        ));
      } else if (status >= 500) {
        res.status(status).json(createErrorResponse(
          ERROR_CODES.BACKEND_NOT_AVAILABLE,
          'InControl2 API is unavailable'
        ));
      } else {
        res.status(status).json(createErrorResponse(
          ERROR_CODES.NETWORK_ERROR,
          errorMessage
        ));
      }
    } else {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logError(ERROR_CODES.NETWORK_ERROR, 'OAuth2 token request failed', { error: errorMessage });
      res.status(500).json(createErrorResponse(ERROR_CODES.NETWORK_ERROR, errorMessage));
    }
  }
});

/**
 * POST /api/auth/credentials
 * Store InControl2 credentials securely
 * 
 * Body: {
 *   apiUrl: string,
 *   clientId: string,
 *   clientSecret: string,
 *   orgId: string
 * }
 */
router.post('/credentials', async (req: Request, res: Response): Promise<void> => {
  try {
    const { apiUrl, clientId, clientSecret, orgId } = req.body;

    // Validate required parameters
    if (!apiUrl || !clientId || !clientSecret || !orgId) {
      res.status(400).json(createErrorResponse(
        ERROR_CODES.MISSING_PARAMETERS,
        'apiUrl, clientId, clientSecret, and orgId are required'
      ));
      return;
    }

    // Validate URL format
    try {
      new URL(apiUrl);
    } catch {
      res.status(400).json(createErrorResponse(
        ERROR_CODES.INVALID_URL,
        'Invalid apiUrl format'
      ));
      return;
    }

    // Store credentials
    await secureStorage.storeCredentials({
      apiUrl,
      clientId,
      clientSecret,
      orgId,
    });

    logInfo('Credentials stored successfully');

    res.json({
      success: true,
      message: 'Credentials stored successfully',
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logError(ERROR_CODES.NETWORK_ERROR, 'Failed to store credentials', { error: errorMessage });
    res.status(500).json(createErrorResponse(
      ERROR_CODES.NETWORK_ERROR,
      'Failed to store credentials'
    ));
  }
});

/**
 * GET /api/auth/credentials
 * Retrieve stored InControl2 credentials
 */
router.get('/credentials', async (_req: Request, res: Response): Promise<void> => {
  try {
    const credentials = await secureStorage.getCredentials();

    if (!credentials) {
      res.json({
        success: true,
        credentials: null,
      });
      return;
    }

    res.json({
      success: true,
      credentials,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logError(ERROR_CODES.NETWORK_ERROR, 'Failed to retrieve credentials', { error: errorMessage });
    res.status(500).json(createErrorResponse(
      ERROR_CODES.NETWORK_ERROR,
      'Failed to retrieve credentials'
    ));
  }
});

/**
 * DELETE /api/auth/credentials
 * Clear stored credentials
 */
router.delete('/credentials', async (_req: Request, res: Response): Promise<void> => {
  try {
    await secureStorage.clearCredentials();

    logInfo('Credentials cleared successfully');

    res.json({
      success: true,
      message: 'Credentials cleared successfully',
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logError(ERROR_CODES.NETWORK_ERROR, 'Failed to clear credentials', { error: errorMessage });
    res.status(500).json(createErrorResponse(
      ERROR_CODES.NETWORK_ERROR,
      'Failed to clear credentials'
    ));
  }
});

export default router;
