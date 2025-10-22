/**
 * Playwright Automation Service
 * 
 * Automates the process of logging into InControl2/ICVA and retrieving OAuth credentials.
 */

import { chromium, Browser, Page } from 'playwright';

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
}

/**
 * Retrieve OAuth credentials using headless browser automation
 */
export async function retrieveCredentials(
  params: AutoCredentialsParams
): Promise<AutoCredentialsResult> {
  let browser: Browser | null = null;
  
  try {
    console.log('[Playwright] Starting browser automation...');
    
    // Launch headless browser
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    
    const context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    });
    
    const page = await context.newPage();
    
    console.log('[Playwright] Navigating to login page...');
    
    // Step 1: Navigate to login page
    await page.goto(params.url, { waitUntil: 'networkidle', timeout: 30000 });
    
    console.log('[Playwright] Filling login credentials...');
    
    // Step 2: Fill login form
    // Note: These selectors may need to be updated based on actual InControl2/ICVA UI
    await page.waitForSelector('input[type="text"], input[type="email"]', { timeout: 10000 });
    
    // Try different common selectors for username/email
    const usernameInput = await page.locator('input[type="email"]').or(page.locator('input[name="username"]')).or(page.locator('input[type="text"]')).first();
    await usernameInput.fill(params.username);
    
    const passwordInput = await page.locator('input[type="password"]').first();
    await passwordInput.fill(params.password);
    
    console.log('[Playwright] Submitting login form...');
    
    // Step 3: Submit login
    const submitButton = await page.locator('button[type="submit"]').or(page.locator('input[type="submit"]')).first();
    await submitButton.click();
    
    // Wait for navigation after login
    await page.waitForLoadState('networkidle', { timeout: 30000 });
    
    // Check for login errors
    const errorElements = await page.locator('.error, .alert-danger, [class*="error"]').count();
    if (errorElements > 0) {
      const errorText = await page.locator('.error, .alert-danger, [class*="error"]').first().textContent();
      throw new Error(`Login failed: ${errorText}`);
    }
    
    console.log('[Playwright] Login successful, navigating to account settings...');
    
    // Step 4: Navigate to Account Information / OAuth settings
    // This is a placeholder - actual navigation will depend on InControl2/ICVA UI structure
    const result = await navigateToOAuthSettings(page, params);
    
    return result;
    
  } catch (error) {
    console.error('[Playwright] Automation failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  } finally {
    if (browser) {
      await browser.close();
      console.log('[Playwright] Browser closed');
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
    // Common patterns: gear icon, "Account" link, "Settings" menu
    
    // Try to find settings/account link
    const settingsLink = await page.locator('a:has-text("Account"), a:has-text("Settings"), [aria-label*="Settings"], [aria-label*="Account"]').first();
    
    if (await settingsLink.count() > 0) {
      await settingsLink.click();
      await page.waitForLoadState('networkidle', { timeout: 15000 });
    }
    
    console.log('[Playwright] Looking for OAuth/API settings...');
    
    // Step 6: Find OAuth/API credentials section
    // Look for API, OAuth, or Credentials sections
    const oauthSection = await page.locator('a:has-text("API"), a:has-text("OAuth"), a:has-text("Credentials"), a:has-text("Applications")').first();
    
    if (await oauthSection.count() > 0) {
      await oauthSection.click();
      await page.waitForLoadState('networkidle', { timeout: 15000 });
    }
    
    console.log('[Playwright] Creating new OAuth application...');
    
    // Step 7: Create new OAuth application
    // Look for "Create", "Add", "New Application" buttons
    const createButton = await page.locator('button:has-text("Create"), button:has-text("Add"), button:has-text("New")').first();
    
    if (await createButton.count() > 0) {
      await createButton.click();
      await page.waitForTimeout(2000); // Wait for modal/form to appear
      
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
    
    console.log('[Playwright] Extracting credentials...');
    
    // Step 8: Extract Client ID, Client Secret, and Organization ID
    // This is highly dependent on the actual UI structure
    // These are placeholder selectors that need to be customized
    
    const clientId = await extractValue(page, ['Client ID', 'ClientId', 'API Key', 'client_id']);
    const clientSecret = await extractValue(page, ['Client Secret', 'ClientSecret', 'API Secret', 'client_secret']);
    const organizationId = await extractValue(page, ['Organization ID', 'OrganizationId', 'Org ID', 'organization_id']);
    
    if (!clientId || !clientSecret || !organizationId) {
      throw new Error('Failed to extract all required credentials. Please use Manual Setup instead.');
    }
    
    console.log('[Playwright] Credentials extracted successfully');
    
    return {
      success: true,
      clientId,
      clientSecret,
      organizationId,
    };
    
  } catch (error) {
    console.error('[Playwright] Failed to extract credentials:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to extract credentials',
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
