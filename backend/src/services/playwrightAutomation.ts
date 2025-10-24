/**
 * Playwright Automation Service
 * 
 * Automates the process of logging into InControl2/ICVA and retrieving OAuth credentials.
 */

import { chromium, Browser, Page } from 'playwright';
import { logInfo, logError } from '../utils/logger.js';
import { ERROR_CODES } from '../utils/errors.js';

export interface AutoCredentialsParams {
  url: string;
  username: string;
  password: string;
  appName: string;
}

export interface AutoCredentialsResult {
  success: boolean;
  clientId?: string;
  clientSecret?: string;
  organizationId?: string;
  error?: string;
  errorCode?: string;
}

/**
 * Retrieve OAuth credentials using headless browser automation
 */
export async function retrieveCredentials(
  params: AutoCredentialsParams
): Promise<AutoCredentialsResult> {
  let browser: Browser | null = null;
  
  try {
    logInfo('Starting browser automation', { url: params.url, username: params.username });
    
    // Launch headless browser
    try {
      browser = await chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
    } catch (error) {
      logError(ERROR_CODES.BROWSER_LAUNCH_FAILED, 'Failed to launch browser', { error: String(error) });
      return {
        success: false,
        errorCode: ERROR_CODES.BROWSER_LAUNCH_FAILED,
        error: 'Failed to launch browser automation',
      };
    }
    
    const context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    });
    
    const page = await context.newPage();
    
    logInfo('Navigating to login page', { url: params.url });
    
    // Step 1: Navigate to login page
    try {
      await page.goto(params.url, { waitUntil: 'networkidle', timeout: 30000 });
    } catch (error) {
      logError(ERROR_CODES.PAGE_LOAD_TIMEOUT, 'Page load timeout', { url: params.url, error: String(error) });
      return {
        success: false,
        errorCode: ERROR_CODES.PAGE_LOAD_TIMEOUT,
        error: 'Page load timeout - server may be unreachable',
      };
    }
    
    logInfo('Filling login credentials');
    
    // Step 2: Fill login form
    try {
      // Wait for login form to be fully rendered and visible
      await page.waitForSelector('input[type="text"], input[type="email"]', { 
        timeout: 10000,
        state: 'visible'  // Wait until visible, not just in DOM
      });
      
      // Wait a moment for any animations/transitions to complete
      await page.waitForTimeout(1000);
      
      // Try different common selectors for username/email
      const usernameInput = await page.locator('input[type="email"]')
        .or(page.locator('input[name="username"]'))
        .or(page.locator('input[name="email"]'))
        .or(page.locator('input[type="text"]'))
        .first();
      
      await usernameInput.waitFor({ state: 'visible', timeout: 5000 });
      await usernameInput.fill(params.username);
      
      const passwordInput = await page.locator('input[type="password"]').first();
      await passwordInput.waitFor({ state: 'visible', timeout: 5000 });
      await passwordInput.fill(params.password);
      
      logInfo('Login credentials filled successfully');
    } catch (error) {
      logError(ERROR_CODES.ELEMENT_NOT_FOUND, 'Login form elements not found', { error: String(error) });
      return {
        success: false,
        errorCode: ERROR_CODES.ELEMENT_NOT_FOUND,
        error: 'Login form not found on page',
      };
    }
    
    logInfo('Submitting login form');
    
    // Step 3: Submit login
    try {
      const submitButton = await page.locator('button[type="submit"]').or(page.locator('input[type="submit"]')).first();
      await submitButton.click();
      
      // Wait for navigation after login
      await page.waitForLoadState('networkidle', { timeout: 30000 });
    } catch (error) {
      logError(ERROR_CODES.AUTOMATION_TIMEOUT, 'Login submission timeout', { error: String(error) });
      return {
        success: false,
        errorCode: ERROR_CODES.AUTOMATION_TIMEOUT,
        error: 'Login process timeout',
      };
    }
    
    // Check for login errors
    const errorElements = await page.locator('.error, .alert-danger, [class*="error"]').count();
    if (errorElements > 0) {
      const errorText = await page.locator('.error, .alert-danger, [class*="error"]').first().textContent();
      logError(ERROR_CODES.LOGIN_FAILED, 'Login failed', { errorText });
      return {
        success: false,
        errorCode: ERROR_CODES.LOGIN_FAILED,
        error: `Login failed: ${errorText}`,
      };
    }
    
    logInfo('Login successful, navigating to account settings');
    
    // Step 4: Navigate to Account Information / OAuth settings
    const result = await navigateToOAuthSettings(page, params);
    
    if (result.success) {
      logInfo('Credentials retrieved successfully', { clientId: result.clientId });
    }
    
    return result;
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    logError(ERROR_CODES.NETWORK_ERROR, 'Automation failed with unexpected error', { error: errorMessage });
    return {
      success: false,
      errorCode: ERROR_CODES.NETWORK_ERROR,
      error: errorMessage,
    };
  } finally {
    if (browser) {
      await browser.close();
      logInfo('Browser closed');
    }
  }
}

/**
 * Navigate to OAuth settings and extract credentials
 * 
 * Note: This is a placeholder implementation that needs to be customized
 * based on the actual InControl2/ICVA UI structure.
 */
async function navigateToOAuthSettings(
  page: Page,
  params: AutoCredentialsParams
): Promise<AutoCredentialsResult> {
  try {
    // Step 5: Look for Account/Settings navigation
    logInfo('Looking for settings/account navigation');
    
    const settingsLink = await page.locator('a:has-text("Account"), a:has-text("Settings"), [aria-label*="Settings"], [aria-label*="Account"]').first();
    
    if (await settingsLink.count() > 0) {
      await settingsLink.click();
      await page.waitForLoadState('networkidle', { timeout: 15000 });
    }
    
    logInfo('Looking for OAuth/API settings');
    
    // Step 6: Find OAuth/API credentials section
    const oauthSection = await page.locator('a:has-text("API"), a:has-text("OAuth"), a:has-text("Credentials"), a:has-text("Applications")').first();
    
    if (await oauthSection.count() > 0) {
      await oauthSection.click();
      await page.waitForLoadState('networkidle', { timeout: 15000 });
    }
    
    logInfo('Creating new OAuth application');
    
    // Step 7: Create new OAuth application
    const createButton = await page.locator('button:has-text("Create"), button:has-text("Add"), button:has-text("New")').first();
    
    if (await createButton.count() > 0) {
      await createButton.click();
      await page.waitForTimeout(2000);
      
      // Fill application name if there's a form
      const nameInput = await page.locator('input[name="name"], input[placeholder*="name" i]').first();
      if (await nameInput.count() > 0) {
        await nameInput.fill(params.appName);
      }
      
      // Submit form
      const submitButton = await page.locator('button:has-text("Save"), button:has-text("Create"), button[type="submit"]').first();
      if (await submitButton.count() > 0) {
        await submitButton.click();
        await page.waitForTimeout(2000);
      }
    }
    
    logInfo('Extracting credentials');
    
    // Step 8: Extract Client ID, Client Secret, and Organization ID
    const clientId = await extractValue(page, ['Client ID', 'ClientId', 'API Key', 'client_id']);
    const clientSecret = await extractValue(page, ['Client Secret', 'ClientSecret', 'API Secret', 'client_secret']);
    const organizationId = await extractValue(page, ['Organization ID', 'OrganizationId', 'Org ID', 'organization_id']);
    
    if (!clientId || !clientSecret || !organizationId) {
      logError(ERROR_CODES.OAUTH_TOKEN_NOT_FOUND, 'Failed to extract OAuth credentials', { 
        foundClientId: !!clientId, 
        foundClientSecret: !!clientSecret, 
        foundOrganizationId: !!organizationId 
      });
      return {
        success: false,
        errorCode: ERROR_CODES.OAUTH_TOKEN_NOT_FOUND,
        error: 'Failed to extract all required credentials. Please use Manual Setup instead.',
      };
    }
    
    return {
      success: true,
      clientId,
      clientSecret,
      organizationId,
    };
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to extract credentials';
    logError(ERROR_CODES.OAUTH_TOKEN_NOT_FOUND, 'Failed to navigate OAuth settings', { error: errorMessage });
    return {
      success: false,
      errorCode: ERROR_CODES.OAUTH_TOKEN_NOT_FOUND,
      error: errorMessage,
    };
  }
}

/**
 * Helper function to extract values from the page
 * Tries multiple label variations to find the value
 */
async function extractValue(page: Page, labels: string[]): Promise<string | null> {
  for (const label of labels) {
    try {
      // Try to find by label text
      const labelElement = await page.locator(`label:has-text("${label}"), dt:has-text("${label}"), th:has-text("${label}")`).first();
      
      if (await labelElement.count() > 0) {
        // Look for associated input or value
        const valueElement = await labelElement.locator('~ input, ~ code, ~ span, + dd, + td').first();
        
        if (await valueElement.count() > 0) {
          const value = await valueElement.inputValue().catch(() => valueElement.textContent());
          if (value && value.trim()) {
            return value.trim();
          }
        }
      }
      
      // Try data attribute approach
      const dataElement = await page.locator(`[data-label="${label}"], [data-field="${label}"]`).first();
      if (await dataElement.count() > 0) {
        const value = await dataElement.textContent();
        if (value && value.trim()) {
          return value.trim();
        }
      }
    } catch (error) {
      // Continue trying other labels
      continue;
    }
  }
  
  return null;
}
