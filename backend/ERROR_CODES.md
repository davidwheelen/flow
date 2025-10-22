# Error Code Reference

This document provides a comprehensive reference for all error codes used in the Flow backend API.

## Error Code Format

All error codes follow the format: `ERR-XXXX`

## Error Code Categories

### 1xxx - Backend Server Errors

| Code | Description | Troubleshooting |
|------|-------------|-----------------|
| ERR-1001 | Backend server failed to start | Check if port 3001 is available. Verify all dependencies are installed. |
| ERR-1002 | Database connection failed | Verify database credentials and network connectivity. |

### 2xxx - API Endpoint Errors

| Code | Description | Troubleshooting |
|------|-------------|-----------------|
| ERR-2001 | Invalid request format | Ensure request body is valid JSON with required fields. |
| ERR-2002 | Missing required parameters | Check API documentation for required parameters. |
| ERR-2003 | Backend service not available | Verify backend server is running on port 3001. |

### 3xxx - Browser Automation Errors

| Code | Description | Troubleshooting |
|------|-------------|-----------------|
| ERR-3001 | Failed to launch browser automation | Ensure Playwright is installed. Check system resources. |
| ERR-3002 | Page load timeout - server may be unreachable | Verify the InControl2/ICVA URL is correct and accessible. Check network connectivity. |
| ERR-3003 | Required page element not found | The page structure may have changed. Consider using Manual Setup. |
| ERR-3004 | Automation process timeout | The automation process took too long. Try again or use Manual Setup. |
| ERR-3005 | Failed to capture screenshot | Check file system permissions and disk space. |

### 4xxx - Authentication Errors

| Code | Description | Troubleshooting |
|------|-------------|-----------------|
| ERR-4001 | Invalid username or password | Verify credentials are correct. Check for typos. |
| ERR-4002 | Login failed - check credentials | The login process failed. Verify credentials and try again. |
| ERR-4003 | Multi-factor authentication required (not supported) | MFA is not supported in auto-setup. Use Manual Setup instead. |
| ERR-4004 | Session expired | Your session has expired. Please log in again. |
| ERR-4005 | OAuth credentials not found after login | The OAuth credentials could not be found on the page. Use Manual Setup. |

### 5xxx - Network/Connection Errors

| Code | Description | Troubleshooting |
|------|-------------|-----------------|
| ERR-5001 | Network error occurred | Check network connectivity. Verify firewall settings. |
| ERR-5002 | Connection timeout | The connection timed out. Check network and try again. |
| ERR-5003 | Invalid or malformed URL | Verify the URL format is correct (e.g., https://incontrol2.peplink.com). |

### 6xxx - Validation Errors

| Code | Description | Troubleshooting |
|------|-------------|-----------------|
| ERR-6001 | Validation error | Check that all fields meet validation requirements. |
| ERR-6002 | Invalid email format | Ensure the email address is in valid format (e.g., user@example.com). |
| ERR-6003 | Invalid password format | Check password meets minimum requirements. |

## Logging

All errors are logged to `backend/logs/flow-backend.log` with detailed context including:
- Timestamp
- Error code
- Error message
- Additional details (when available)
- User context (when available)

## Log Format

Logs are written in JSON format for easy parsing:

```json
{
  "timestamp": "2025-10-22T20:23:09.644Z",
  "level": "ERROR",
  "errorCode": "ERR-4001",
  "message": "Login failed",
  "details": {
    "username": "user@example.com",
    "errorText": "Invalid credentials"
  }
}
```

## Common Issues and Solutions

### Auto-Setup Not Working

1. **ERR-3002 (Page load timeout)**
   - Solution: Verify the InControl2/ICVA URL is correct and the server is online
   - Alternative: Use Manual Setup

2. **ERR-4001 (Invalid credentials)**
   - Solution: Double-check username and password
   - Note: Some systems use email instead of username

3. **ERR-4005 (OAuth credentials not found)**
   - Solution: The page structure may have changed. Use Manual Setup to retrieve credentials
   - Note: This requires navigating to the OAuth/API settings page manually

### Backend Connection Issues

1. **ERR-2003 (Backend not available)**
   - Solution: Ensure the backend server is running (`npm run dev` in backend directory)
   - Check: Verify port 3001 is not blocked by firewall

2. **ERR-5001 (Network error)**
   - Solution: Check network connectivity and proxy settings
   - Check: Verify CORS settings allow frontend origin

## Support

For additional help or to report issues with error codes, please open an issue on the GitHub repository.
