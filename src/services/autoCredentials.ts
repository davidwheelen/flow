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
}

export type ProgressCallback = (step: string, progress: number) => void;

/**
 * Automatically retrieve OAuth credentials using headless browser
 * 
 * NOTE: This feature is currently disabled in browser-only deployments.
 * It requires a Node.js backend to run Playwright automation.
 * Users should use Manual Setup instead.
 */
export async function autoRetrieveCredentials(
  _params: AutoSetupParams,
  onProgress?: ProgressCallback
): Promise<AutoSetupResult> {
  const progress = (step: string, percent: number) => {
    console.log(`[AutoCredentials] ${step} (${percent}%)`);
    if (onProgress) {
      onProgress(step, percent);
    }
  };

  // In browser environment, this feature is not available
  progress('Auto-credentials not available in browser', 0);
  
  return {
    clientId: '',
    clientSecret: '',
    organizationId: '',
    success: false,
    error: 'Automatic credential retrieval requires a backend service. Please use Manual Setup instead.',
  };
}

/**
 * Test if headless browser is available
 * NOTE: Always returns false in browser environment
 */
export async function testBrowserAvailability(): Promise<boolean> {
  return false;
}
