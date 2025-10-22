/**
 * Automatic Credentials Service
 * 
 * Uses headless browser automation (Playwright) to automatically retrieve
 * InControl2/ICVA OAuth credentials from user login.
 * 
 * NOTE: This service requires a Node.js backend to run Playwright.
 * In browser-only deployments, this feature is disabled and users must use manual setup.
 */

// Playwright types for browser-compatible stub
export interface Browser {
  close(): Promise<void>;
}

export interface Page {
  goto(url: string, options?: unknown): Promise<void>;
  fill(selector: string, value: string): Promise<void>;
  click(selector: string): Promise<void>;
  waitForNavigation(options?: unknown): Promise<void>;
  waitForLoadState(state: string): Promise<void>;
  waitForTimeout(timeout: number): Promise<void>;
  evaluate(fn: () => void): Promise<void>;
  locator(selector: string): unknown;
  textContent(selector: string): Promise<string | null>;
  inputValue(selector: string): Promise<string>;
}

export interface AutoSetupParams {
  url: string;
  username: string;
  password: string;
  appName?: string;
}

export interface AutoSetupResult {
  clientId: string;
  clientSecret: string;
  organizationId: string;
  success: boolean;
  error?: string;
  errorCode?: string;
  details?: string;
}

export type ProgressCallback = (step: string, progress: number) => void;

/**
 * Automatically retrieve OAuth credentials using backend API
 * 
 * Calls the backend API service which uses Playwright to automate
 * the credential retrieval process.
 */
export async function autoRetrieveCredentials(
  params: AutoSetupParams,
  onProgress?: ProgressCallback
): Promise<AutoSetupResult> {
  const progress = (step: string, percent: number) => {
    console.log(`[AutoCredentials] ${step} (${percent}%)`);
    if (onProgress) {
      onProgress(step, percent);
    }
  };

  try {
    progress('Connecting to backend service...', 10);

    // Call backend API
    const response = await fetch('/api/auto-credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: params.url,
        username: params.username,
        password: params.password,
        appName: params.appName || 'Flow - Device Monitor',
      }),
    });

    progress('Processing automation...', 50);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        errorCode: 'ERR-5001',
        errorMessage: 'Unknown error',
        error: 'Unknown error' 
      }));
      
      return {
        success: false,
        clientId: '',
        clientSecret: '',
        organizationId: '',
        errorCode: errorData.errorCode || 'ERR-5001',
        error: errorData.errorMessage || errorData.error || `HTTP ${response.status}`,
        details: errorData.details,
      };
    }

    const result = await response.json();

    if (result.success) {
      progress('Credentials retrieved successfully!', 100);
      return {
        success: true,
        clientId: result.clientId || '',
        clientSecret: result.clientSecret || '',
        organizationId: result.organizationId || '',
      };
    } else {
      return {
        success: false,
        clientId: '',
        clientSecret: '',
        organizationId: '',
        errorCode: result.errorCode || 'ERR-5001',
        error: result.errorMessage || result.error || 'Failed to retrieve credentials',
        details: result.details,
      };
    }
  } catch (error) {
    console.error('[AutoCredentials] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    progress(`Error: ${errorMessage}`, 0);
    
    return {
      success: false,
      clientId: '',
      clientSecret: '',
      organizationId: '',
      errorCode: 'ERR-5001',
      error: errorMessage,
    };
  }
}

/**
 * Test if backend API service is available
 */
export async function testBrowserAvailability(): Promise<boolean> {
  try {
    const response = await fetch('/api/health', {
      method: 'GET',
    });
    return response.ok;
  } catch (error) {
    console.error('[AutoCredentials] Backend service not available:', error);
    return false;
  }
}
