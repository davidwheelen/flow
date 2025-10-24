/**
 * Authentication API Routes
 * 
 * Proxies OAuth2 token requests to InControl2 API to avoid CORS issues.
 * 
 * POST /api/auth/token - Get OAuth2 token from InControl2
 */

import { Router, Request, Response } from 'express';
import axios from 'axios';
import { logInfo, logError } from '../utils/logger.js';
import { ERROR_CODES, createErrorResponse } from '../utils/errors.js';

const router = Router();

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
    const response = await axios.post(tokenUrl, formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      timeout: 10000,
    });

    // Forward the token response
    res.json(response.data);
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

export default router;
