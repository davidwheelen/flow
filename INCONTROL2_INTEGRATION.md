# InControl2 API Integration

This document describes the InControl2 API integration features added to Flow.

## Overview

Flow now supports direct integration with Peplink InControl2 (incontrol2.peplink.com) or custom ICVA servers using OAuth 2.0 authentication. The integration provides real-time device monitoring with automatic polling and secure credential storage.

## Features

### 🔐 Secure Authentication
- **OAuth 2.0 Authentication**: Full OAuth 2.0 client credentials flow
- **Encrypted Storage**: Credentials encrypted using Web Crypto API (AES-GCM 256-bit)
- **Automatic Token Refresh**: Tokens automatically refreshed before expiration
- **Masked Display**: Credentials shown as `•••••••` after saving

### 📡 Real-time Data Polling
- **30-Second Intervals**: Automatic polling every 30 seconds
- **Rate Limiting**: Built-in rate limiter (20 requests/second max)
- **Comprehensive Data**: Fetches devices, WAN status, bandwidth, cellular, and PepVPN

### 🎨 Glassmorphism UI
- Beautiful settings dialog with glassmorphism design
- Visual feedback for connection status
- Clear error messages and validation

### 🔄 Custom Server Support
- Support for standard InControl2 (incontrol2.peplink.com)
- Support for custom ICVA server URLs
- Configurable API endpoint

## Setup

### 1. Get Your API Credentials

1. Log in to your InControl2 account
2. Navigate to **Organization Settings** > **API Access**
3. Create a new OAuth2 application
4. Note your:
   - Client ID
   - Client Secret
   - Organization ID

### 2. Configure Flow

1. Click the **Settings** button (gear icon) in the top right
2. Enter your credentials:
   - **API URL**: `https://incontrol2.peplink.com` (or your custom ICVA server)
   - **Client ID**: Your OAuth2 Client ID
   - **Client Secret**: Your OAuth2 Client Secret
   - **Organization ID**: Your Organization ID
3. Click **Test & Save**

The connection will be tested and credentials will be securely stored if successful.

## API Endpoints Used

The integration fetches data from the following InControl2 API endpoints:

### Authentication
- `POST /api/oauth2/token` - OAuth2 token generation and refresh

### Groups
- `GET /api/groups` - List organization groups

### Devices
- `GET /api/groups/{groupId}/devices` - List devices in a group
- `GET /api/devices/{deviceId}/status` - Device status
- `GET /api/devices/{deviceId}/wan` - WAN connections
- `GET /api/devices/{deviceId}/cellular` - Cellular connections
- `GET /api/devices/{deviceId}/bandwidth` - Bandwidth metrics
- `GET /api/devices/{deviceId}/pepvpn` - PepVPN connections

## Architecture

### Services

#### `secureStorage.ts`
- Encrypts credentials using Web Crypto API
- Stores encrypted data in localStorage
- Provides masked string display

#### `authService.ts`
- Manages OAuth 2.0 authentication flow
- Handles token refresh automatically
- Provides authenticated API client

#### `pollingService.ts`
- Polls API every 30 seconds
- Rate limits requests (20/sec max)
- Aggregates device data from multiple endpoints

### React Hooks

#### `useAuth()`
Returns authentication state and methods:
```typescript
const { 
  isAuthenticated,    // boolean
  isLoading,         // boolean
  error,            // string | null
  credentials,      // IC2Credentials | null
  login,           // (credentials) => Promise<boolean>
  logout,          // () => void
  clearError       // () => void
} = useAuth();
```

#### `useDeviceData(groupId, enabled)`
Returns device data with polling:
```typescript
const {
  devices,        // PeplinkDevice[]
  isLoading,     // boolean
  isPolling,     // boolean
  error,         // string | null
  clearError,    // () => void
  refresh        // () => void
} = useDeviceData(groupId, enabled);
```

### Components

#### `Settings`
- Glassmorphism settings dialog
- Form validation
- Connection testing
- Credential masking
- Eye icon to show/hide secrets

## Security Features

### Encryption
- **Algorithm**: AES-GCM 256-bit
- **Key Storage**: Encryption key stored in localStorage
- **IV**: Unique initialization vector per encryption
- **Format**: Base64-encoded encrypted data

### Display Masking
Credentials are displayed as `•••••••` after saving:
- Shows last 4 characters for verification
- Eye icon toggles visibility
- Read-only when saved

### Token Management
- Tokens automatically refreshed 60 seconds before expiration
- Failed refresh triggers re-authentication
- Logout clears all credentials and tokens

## Rate Limiting

The polling service implements rate limiting to respect InControl2's API limits:

- **Maximum**: 20 requests per second
- **Queue**: Requests queued when limit reached
- **Wait**: Automatic waiting when limit exceeded
- **Buffer**: 10ms safety buffer between requests

## Polling Behavior

### When Authenticated
- Automatic polling every 30 seconds
- Fetches all device data in parallel (with rate limiting)
- Updates UI in real-time
- Continues until component unmounted or group changed

### When Not Authenticated
- Falls back to mock data (for development)
- Manual device loading via sidebar
- No automatic polling

## Error Handling

### Authentication Errors
- Invalid credentials: Clear error message
- Network errors: Retry available
- Token expiration: Automatic refresh

### Polling Errors
- API errors: Displayed in UI
- Rate limit: Automatic queueing
- Network errors: Retry on next poll

## Development Mode

When InControl2 credentials are not configured:
- App automatically uses mock data
- All features work with simulated devices
- No API calls made
- Perfect for development and testing

## API Reference

See the official Peplink InControl2 API documentation:
https://www.peplink.com/ic2-api-doc/

## Troubleshooting

### "Authentication failed"
- Verify your Client ID and Client Secret
- Check your Organization ID
- Ensure your API application has proper permissions

### "Connection failed"
- Check your internet connection
- Verify the API URL is correct
- Ensure your InControl2 account is active

### "Rate limit exceeded"
- The rate limiter should prevent this
- If you see this, reduce polling frequency
- Check for other applications using the API

### Credentials not saving
- Check browser's localStorage is enabled
- Ensure Web Crypto API is supported
- Try clearing browser cache

## Browser Compatibility

Requires browsers with Web Crypto API support:
- Chrome/Edge 60+
- Firefox 60+
- Safari 11+

## Future Enhancements

- [ ] WebSocket support for real-time updates
- [ ] Multiple organization support
- [ ] Advanced rate limiting strategies
- [ ] Offline mode with cached data
- [ ] Export configuration
- [ ] API usage statistics
