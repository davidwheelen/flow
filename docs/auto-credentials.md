# Automatic Credential Retrieval (Framework/Foundation)

Flow includes the framework for automatic OAuth credential retrieval using headless browser automation. **Note: This feature currently requires a backend service and is disabled in browser-only deployments.**

## Current Status

✅ **Implemented Infrastructure**:
- Token Manager service with auto-refresh logic
- Encryption service (AES-256-GCM) for secure credential storage
- Re-authentication modal for manual token refresh
- Auto Setup UI component with tabs (Auto Setup / Manual Setup)
- useTokenManager React hook for lifecycle management
- Extended credentials storage with token expiry tracking

⚠️ **Requires Backend Service**:
- Playwright headless browser automation cannot run in browser environment
- Auto-credentials feature is currently **disabled** in the UI
- Users must use **Manual Setup** tab to configure credentials

## Implementation Details

### What's Built

The auto-credentials infrastructure is complete and ready to integrate with a backend service:

1. **Token Management** (`src/services/tokenManager.ts`)
   - Monitors token expiry every 5 minutes
   - Triggers re-auth modal when token expires in < 10 minutes
   - Supports both auto-refresh and manual re-auth modes
   - Stores encrypted credentials for auto-refresh

2. **Encryption** (`src/services/encryption.ts`)
   - AES-256-GCM encryption for username/password
   - Device-specific encryption keys
   - Secure storage in browser localStorage

3. **UI Components**
   - `AutoSetup.tsx`: Auto-credentials form (currently disabled)
   - `ReauthModal.tsx`: Manual re-authentication dialog
   - Settings tabs: Auto Setup / Manual Setup

4. **Storage** (`src/services/secureStorage.ts`)
   - Extended credentials interface with token data
   - Support for storing access tokens, refresh tokens, expiry
   - Auto-refresh preference storage

### Architecture Considerations

Playwright is a Node.js automation framework that cannot run in browser environments. To enable auto-credentials, you need:

**Option 1: Backend API Service**
- Create a backend API endpoint (Node.js/Express)
- Run Playwright automation on the server
- Frontend calls API with credentials
- API returns extracted OAuth credentials

**Option 2: Electron App**
- Package Flow as Electron desktop application
- Run Playwright in Electron main process
- Full auto-credentials functionality available

**Option 3: Browser Extension**
- Create Chrome/Firefox extension
- Use extension APIs for automation
- Limited but functional approach

## Overview

The auto-credentials feature uses Playwright (a headless browser automation library) to:

1. Log into your InControl2/ICVA account
2. Navigate to Account Information settings
3. Create a new OAuth client application
4. Extract Client ID, Client Secret, and Organization ID
5. Store credentials securely with token lifecycle management

## Current User Experience

### Settings Panel

When users open Settings, they see two tabs:

1. **Auto Setup Tab** (Currently Disabled)
   - Shows warning: "Feature Not Available in Browser"
   - Explains requirement for backend service
   - All form fields visible but disabled
   - Directs users to Manual Setup

2. **Manual Setup Tab** (Fully Functional)
   - Traditional credential entry
   - Client ID, Client Secret, Organization ID
   - Test & Save functionality
   - Encrypted storage

### Token Lifecycle Management

Even though auto-credentials is disabled, the token management system is fully functional:

- **Token Expiry Monitoring**: Checks every 5 minutes
- **Re-auth Modal**: Appears when token expires
- **Manual Re-authentication**: Users enter credentials to refresh token
- **Secure Storage**: All credentials encrypted in browser localStorage

## How It Works (When Backend Available)

1. Open Settings (gear icon in top-right)
2. Click on "Auto Setup" tab
3. Select InControl2 URL or enter custom ICVA server URL
4. Enter your InControl2/ICVA username and password
5. Choose token refresh preference:
   - **Prompt me to login again** (more secure): You'll be asked to re-authenticate when your session expires
   - **Auto-refresh automatically** (more convenient): Credentials are encrypted and stored for automatic token refresh
6. Click "Get Credentials Automatically"
7. Wait while the automated process completes (typically 30-60 seconds)
8. Credentials are automatically saved and ready to use

### Manual Setup (Fallback)

The traditional manual credential entry is still available under the "Manual Setup" tab. Use this if:

- Headless browser automation fails
- You prefer to manually create OAuth applications
- You're troubleshooting credential issues

## Token Refresh Management

Flow manages OAuth token lifecycle automatically with two modes:

### Manual Re-authentication (More Secure)

- Credentials are NOT stored after initial setup
- When token expires, you'll see a re-authentication modal
- Enter your username and password to get a new token
- No credentials stored on disk between sessions

### Auto-refresh (More Convenient)

- Username and password are encrypted using AES-256-GCM
- Encryption key is device-specific and stored locally
- Token is automatically refreshed before expiration
- No user interaction needed for token refresh
- Background monitoring checks every 5 minutes
- Auto-refresh triggers if token expires in < 10 minutes

## Security Considerations

### Encryption

- **Algorithm**: AES-256-GCM (industry standard)
- **Key Storage**: Device-specific, stored in browser localStorage
- **Data Encrypted**: Username, password (only when auto-refresh enabled)
- **Scope**: Local only - credentials never transmitted to external servers

### Browser Automation Security

- Runs entirely on your local machine
- No credentials sent to third-party services
- Headless browser isolated from your normal browsing
- Browser instance closed immediately after credential retrieval

### Best Practices

1. **Use Manual Re-auth for Shared Computers**: Don't enable auto-refresh on shared or public computers
2. **Use Auto-refresh for Personal Devices**: Safe for your own workstation/laptop
3. **Clear Credentials When Done**: Use "Clear Credentials" button in Manual Setup tab if you need to remove all stored data
4. **Monitor Session Expiry**: Check your InControl2/ICVA token expiration settings

## Troubleshooting

### Browser Launch Failures

**Error**: "Failed to launch browser" or "Chromium not found"

**Solutions**:
- In Docker: Ensure Dockerfile includes Chromium installation
- Development: Run `npx playwright install chromium`
- Check browser availability: The app will test if headless browser is available

### Login Failures

**Error**: "Login failed - invalid credentials"

**Solutions**:
- Verify your username/email and password are correct
- Check if your account has two-factor authentication enabled (not currently supported)
- Ensure your account has permission to create OAuth applications
- Try logging in manually to InControl2/ICVA to verify credentials

### Selector Changes

**Error**: "Failed to extract Client ID/Secret"

**Solutions**:
- InControl2/ICVA UI may have changed
- Use Manual Setup tab as fallback
- Report issue to Flow developers with screenshots

### Network Errors

**Error**: "Navigation timeout" or "Network error"

**Solutions**:
- Check internet connectivity
- Verify InControl2/ICVA server URL is correct and accessible
- Check if firewall/proxy is blocking connections
- Try increasing timeout in autoCredentials service

## Docker Deployment

The Dockerfile includes Chromium installation for future backend integration:

```dockerfile
# Chromium and dependencies installed
RUN apk add --no-cache chromium nss freetype harfbuzz

# Environment variables set
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
ENV PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium-browser
```

**Note**: Currently, these packages are installed but not used since auto-credentials requires a backend service. They are included for future compatibility when a backend API is added.

Build and run:

```bash
# Build with auto-credentials foundation
docker build -t flow:latest .

# Run container
docker run -p 2727:2727 flow:latest
```

## Development

### Dependencies

```json
{
  "playwright": "^1.40.0"
}
```

### Install Playwright Browsers

```bash
# Install Chromium for local development
npx playwright install chromium

# Or install all browsers
npx playwright install
```

### Test Browser Availability

The app includes a test function to check if headless browser is available:

```typescript
import { testBrowserAvailability } from '@/services/autoCredentials';

const isAvailable = await testBrowserAvailability();
console.log('Browser available:', isAvailable);
```

## API Reference

### autoRetrieveCredentials

Automatically retrieve OAuth credentials using headless browser.

```typescript
import { autoRetrieveCredentials } from '@/services/autoCredentials';

const result = await autoRetrieveCredentials(
  {
    url: 'https://incontrol2.peplink.com',
    username: 'your-email@example.com',
    password: 'your-password',
    appName: 'Flow - Device Monitor' // optional
  },
  (step, progress) => {
    console.log(`${step}: ${progress}%`);
  }
);

if (result.success) {
  console.log('Client ID:', result.clientId);
  console.log('Client Secret:', result.clientSecret);
  console.log('Organization ID:', result.organizationId);
}
```

### TokenManager

Manages token lifecycle with auto-refresh or manual re-auth.

```typescript
import { tokenManager } from '@/services/tokenManager';

// Start monitoring
tokenManager.start(() => {
  console.log('Re-authentication required');
});

// Store credentials with auto-refresh
await tokenManager.storeAutoCredentials(
  credentials,
  accessToken,
  expiresIn,
  true, // autoRefresh enabled
  username,
  password
);

// Get token info
const info = await tokenManager.getTokenInfo();
console.log('Expires at:', new Date(info.expiresAt));
console.log('Auto-refresh:', info.autoRefresh);

// Stop monitoring
tokenManager.stop();
```

### useTokenManager Hook

React hook for token management with re-auth modal.

```typescript
import { useTokenManager } from '@/hooks/useTokenManager';
import { ReauthModal } from '@/components/Modals/ReauthModal';

function App() {
  const { showReauthModal, handleReauth, cancelReauth } = useTokenManager();

  return (
    <>
      {/* Your app content */}
      
      <ReauthModal
        isOpen={showReauthModal}
        onReauth={handleReauth}
        onCancel={cancelReauth}
      />
    </>
  );
}
```

## Limitations

- **Two-Factor Authentication**: Not currently supported by automated login
- **CAPTCHA**: Cannot bypass CAPTCHA challenges
- **Custom Login Flows**: May not work with heavily customized login pages
- **UI Changes**: Dependent on InControl2/ICVA UI structure remaining stable

## Future Enhancements

- Support for two-factor authentication
- Multi-organization support
- Credential migration/import tools
- Enhanced error recovery
- Retry mechanisms with exponential backoff

## Support

If you encounter issues with auto-credentials:

1. Check this documentation for troubleshooting steps
2. Try Manual Setup as fallback
3. Report issues on GitHub with:
   - Error messages
   - InControl2/ICVA URL (if custom)
   - Steps to reproduce
   - Browser console logs

---

**Note**: Auto-credentials feature is designed to work seamlessly, but Manual Setup remains available as a reliable fallback option.
