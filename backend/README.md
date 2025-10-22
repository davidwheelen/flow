# Flow Backend API

Backend API service for Flow auto-credentials feature using Playwright browser automation.

## Overview

This backend service provides an API endpoint for automatic OAuth credential retrieval from InControl2/ICVA systems. It uses Playwright to automate the login and credential extraction process.

## Features

- **Express Server**: Lightweight REST API on port 3001
- **Playwright Automation**: Headless browser automation for credential retrieval
- **Security**: CORS protection, rate limiting, input validation
- **Health Checks**: Built-in health check endpoint
- **Docker Support**: Containerized deployment with Chromium

## API Endpoints

### POST /api/auto-credentials

Automatically retrieve OAuth credentials using browser automation.

**Request:**
```json
{
  "url": "https://incontrol2.peplink.com",
  "username": "user@example.com",
  "password": "your-password",
  "appName": "Flow - Device Monitor"
}
```

**Response:**
```json
{
  "success": true,
  "clientId": "your-client-id",
  "clientSecret": "your-client-secret",
  "organizationId": "your-org-id"
}
```

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "service": "flow-backend",
  "timestamp": "2025-10-22T15:00:00.000Z"
}
```

## Development

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Chromium (for Playwright)

### Installation

```bash
# Install dependencies
npm install

# Install Playwright browsers (for local development)
npx playwright install chromium
```

### Running Locally

```bash
# Development mode with auto-reload
npm run dev

# Production build
npm run build
npm start

# Lint code
npm run lint
```

The server will start on port 3001 by default.

### Environment Variables

- `PORT`: Server port (default: 3001)
- `NODE_ENV`: Environment mode (development/production)
- `FRONTEND_URL`: Allowed frontend URL for CORS (default: http://localhost:2727)
- `SKIP_RATE_LIMIT`: Skip rate limiting in development (true/false)

## Docker Deployment

### Build Image

```bash
docker build -t flow-backend:latest .
```

### Run Container

```bash
docker run -d \
  -p 3001:3001 \
  --name flow-backend \
  -e NODE_ENV=production \
  -e FRONTEND_URL=http://flow:2727 \
  flow-backend:latest
```

### Docker Compose

The backend is included in the main docker-compose.yml:

```bash
cd ..
docker compose up -d
```

## Architecture

### Middleware

- **CORS**: Restricts access to frontend only
- **Rate Limiter**: 10 requests per 15 minutes for auto-credentials
- **Validation**: Zod schema validation for request bodies
- **Helmet**: Security headers

### Services

- **playwrightAutomation**: Browser automation logic
- **Express Routes**: API endpoint handlers

### Security Features

- CORS restricted to frontend service
- Rate limiting per IP address
- Input validation with Zod
- No credential storage in backend
- Helmet security headers
- Isolated browser context

## Testing

Since this involves browser automation, testing can be done:

1. **Unit Tests**: Test individual functions (not yet implemented)
2. **Integration Tests**: Test API endpoints (not yet implemented)
3. **Manual Testing**: Use curl or frontend to test

### Manual Testing with curl

```bash
# Health check
curl http://localhost:3001/health

# Auto-credentials (through frontend proxy)
curl -X POST http://localhost:2727/api/auto-credentials \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://incontrol2.peplink.com",
    "username": "test@example.com",
    "password": "password123",
    "appName": "Test App"
  }'
```

## Troubleshooting

### Browser Launch Fails

**Error**: "Failed to launch browser"

**Solution**: Ensure Chromium is installed:
```bash
# In Docker
docker exec flow-backend chromium-browser --version

# Locally
npx playwright install chromium
```

### CORS Errors

**Error**: "Not allowed by CORS"

**Solution**: Check FRONTEND_URL environment variable matches your frontend URL.

### Rate Limiting

**Error**: "Too many requests"

**Solution**: Wait 15 minutes or set `SKIP_RATE_LIMIT=true` in development.

## Project Structure

```
backend/
├── src/
│   ├── middleware/
│   │   ├── cors.ts          # CORS configuration
│   │   ├── rateLimiter.ts   # Rate limiting
│   │   └── validation.ts    # Request validation
│   ├── routes/
│   │   └── autoCredentials.ts # API routes
│   ├── services/
│   │   └── playwrightAutomation.ts # Browser automation
│   └── server.ts            # Express server
├── Dockerfile               # Docker image definition
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── .eslintrc.cjs            # ESLint config
└── .gitignore               # Git ignore rules
```

## Dependencies

### Production

- `express`: Web framework
- `playwright`: Browser automation
- `helmet`: Security headers
- `cors`: CORS middleware
- `express-rate-limit`: Rate limiting
- `zod`: Schema validation

### Development

- `typescript`: TypeScript compiler
- `tsx`: TypeScript execution
- `eslint`: Code linting
- `@types/*`: TypeScript type definitions

## Notes

- The Playwright selectors in `playwrightAutomation.ts` are placeholders and need to be customized based on the actual InControl2/ICVA UI structure
- Auto-credentials may fail if the UI changes or if 2FA is enabled
- Manual setup is always available as a fallback in the frontend

## License

MIT
