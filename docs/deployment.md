# Flow Deployment Guide

This guide covers deploying Flow with the backend API service for auto-credentials functionality.

## Architecture

Flow consists of two services:

1. **Frontend (port 2727)**: React application served by Nginx
2. **Backend (port 3001)**: Node.js/Express API service for auto-credentials

Both services run in Docker containers and communicate through an internal network.

## Prerequisites

- Docker Engine 20.10 or higher
- Docker Compose 2.0 or higher
- 2GB RAM minimum
- Internet access for initial setup

## Quick Start

### Production Deployment

```bash
# Clone the repository
git clone https://github.com/davidwheelen/flow.git
cd flow

# Start all services
docker compose up -d

# Check service health
docker compose ps

# View logs
docker compose logs -f
```

Flow will be accessible at `http://localhost:2727`

### Development Deployment

For development with hot-reload:

```bash
# Start development environment
docker compose -f docker-compose.flow-dev.yml up

# Access at http://localhost:8181
```

## Services

### Frontend Service

- **Container**: `flow`
- **Port**: 2727
- **Image**: `flow:latest`
- **Health Check**: HTTP GET `/health`

The frontend is a React SPA built with Vite and served by Nginx. It includes:
- InControl2 API integration
- Real-time device visualization
- Settings and configuration UI
- Auto-credentials form

### Backend Service

- **Container**: `flow-backend`
- **Port**: 3001 (internal only)
- **Image**: `flow-backend:latest`
- **Health Check**: HTTP GET `/health`

The backend is a Node.js Express API that provides:
- Auto-credentials endpoint: `POST /api/auto-credentials`
- Playwright browser automation
- Rate limiting (10 requests per 15 minutes)
- CORS protection (frontend only)
- Input validation with Zod

### Network

Services communicate through the `flow-network` bridge network:
- Frontend → Backend: `http://backend:3001`
- External → Frontend: `http://localhost:2727`
- Backend is not exposed externally

### Nginx Reverse Proxy

Nginx proxies API requests from frontend to backend:
- `/api/*` → `http://backend:3001`
- All other requests → React SPA

## Configuration

### Environment Variables

**Frontend Container:**
```bash
NODE_ENV=production
BACKEND_URL=http://backend:3001
```

**Backend Container:**
```bash
NODE_ENV=production
PORT=3001
FRONTEND_URL=http://flow:2727
```

### CORS Configuration

Backend CORS is restricted to the frontend service only. In production, only requests from `http://flow:2727` are allowed.

For development, CORS is more permissive to allow local testing.

### Rate Limiting

The backend implements rate limiting to prevent abuse:
- **Auto-credentials endpoint**: 10 requests per 15 minutes per IP
- **General API**: 100 requests per 15 minutes per IP

To disable rate limiting in development:
```bash
SKIP_RATE_LIMIT=true
```

## Building Images

### Build Both Services

```bash
docker compose build
```

### Build Frontend Only

```bash
docker build -t flow:latest .
```

### Build Backend Only

```bash
cd backend
docker build -t flow-backend:latest .
```

## Managing Services

### Start Services

```bash
docker compose up -d
```

### Stop Services

```bash
docker compose down
```

### Restart Services

```bash
docker compose restart
```

### View Logs

```bash
# All services
docker compose logs -f

# Frontend only
docker compose logs -f flow

# Backend only
docker compose logs -f backend
```

### Check Service Status

```bash
docker compose ps
```

### Update Services

```bash
# Pull latest code
git pull

# Rebuild and restart
docker compose up -d --build
```

## Troubleshooting

### Backend Service Won't Start

**Symptoms**: Backend container exits immediately or shows unhealthy status

**Solutions**:
1. Check logs: `docker compose logs backend`
2. Verify Chromium installation: `docker exec flow-backend chromium-browser --version`
3. Check port availability: `lsof -i :3001`
4. Rebuild backend: `docker compose build backend`

### Frontend Can't Connect to Backend

**Symptoms**: Auto-credentials feature shows "Backend service not available"

**Solutions**:
1. Verify backend is running: `docker compose ps backend`
2. Check backend health: `curl http://localhost:2727/api/health`
3. Check Nginx proxy configuration
4. Verify network connectivity: `docker network inspect flow-network`

### Auto-Credentials Fails

**Symptoms**: Automation completes but doesn't return credentials

**Solutions**:
1. Verify InControl2/ICVA URL is correct
2. Check username and password
3. Review backend logs for Playwright errors
4. Ensure account has permission to create OAuth applications
5. Try Manual Setup as fallback

### Rate Limiting Issues

**Symptoms**: "Too many requests" error

**Solutions**:
1. Wait 15 minutes for rate limit to reset
2. In development, set `SKIP_RATE_LIMIT=true`
3. Check if multiple users are behind same IP

### Browser Launch Fails

**Symptoms**: "Failed to launch browser" or "Chromium not found"

**Solutions**:
1. Verify Chromium is installed in container
2. Check Playwright environment variables
3. Rebuild backend image with dependencies
4. Check container logs for detailed error

## Security Considerations

### CORS Protection

- Backend only accepts requests from frontend service
- External API access is blocked
- Development mode is more permissive for testing

### Rate Limiting

- Prevents abuse of auto-credentials feature
- IP-based limiting (10 requests per 15 minutes)
- Can be adjusted via environment variables

### Credential Handling

- Credentials are not stored in backend
- Transmitted over internal Docker network only
- Frontend encrypts credentials locally
- Backend runs automation in isolated browser context

### Helmet Security Headers

Backend uses Helmet.js to set security headers:
- X-Frame-Options: SAMEORIGIN
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block

## Monitoring

### Health Checks

Both services have health check endpoints:

```bash
# Frontend health
curl http://localhost:2727/health

# Backend health (through proxy)
curl http://localhost:2727/api/health
```

### Docker Health Status

```bash
docker compose ps
```

Healthy services show "healthy" status.

### Logs

Monitor logs for errors and performance:

```bash
# Real-time logs
docker compose logs -f

# Last 100 lines
docker compose logs --tail=100
```

## Performance Tuning

### Memory Allocation

- Frontend: 512MB minimum
- Backend: 1GB minimum (Chromium requires memory)

Adjust in docker-compose.yml:

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 2G
```

### Timeout Configuration

Auto-credentials can take 30-60 seconds. Nginx proxy timeout is set to 60 seconds.

To increase:

```nginx
proxy_connect_timeout 120s;
proxy_send_timeout 120s;
proxy_read_timeout 120s;
```

## Backup and Restore

### Backup Icon Packs

```bash
docker cp flow:/usr/share/nginx/html/iconpacks ./iconpacks-backup
```

### Restore Icon Packs

```bash
docker cp ./iconpacks-backup/. flow:/usr/share/nginx/html/iconpacks/
```

## Upgrading

### Minor Updates

```bash
git pull
docker compose up -d --build
```

### Major Updates

1. Backup configuration and data
2. Stop services: `docker compose down`
3. Pull updates: `git pull`
4. Rebuild images: `docker compose build --no-cache`
5. Start services: `docker compose up -d`
6. Verify functionality

## Support

For issues or questions:
- Check logs: `docker compose logs`
- Review troubleshooting section
- Open an issue on GitHub
- Consult auto-credentials documentation

## Advanced Configuration

### Custom Ports

Edit docker-compose.yml to change exposed ports:

```yaml
services:
  flow:
    ports:
      - "8080:2727"  # Expose on port 8080
```

### Behind Reverse Proxy

If running behind Nginx or Traefik:

```yaml
services:
  flow:
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.flow.rule=Host(`flow.example.com`)"
```

### SSL/TLS

Add SSL certificate mounting:

```yaml
services:
  flow:
    volumes:
      - ./ssl:/etc/nginx/ssl:ro
```

Update nginx.conf for SSL configuration.

## Production Recommendations

1. **Use SSL/TLS** for external access
2. **Set strong CORS** restrictions
3. **Monitor logs** regularly
4. **Update regularly** for security patches
5. **Backup configurations** before updates
6. **Use health checks** for monitoring
7. **Set resource limits** to prevent resource exhaustion
8. **Use secrets management** for sensitive data
9. **Enable log rotation** to prevent disk fill
10. **Test auto-credentials** after deployment

## Development vs Production

### Development

- Hot-reload enabled
- More verbose logging
- CORS more permissive
- Rate limiting optional
- Source maps available

### Production

- Optimized builds
- Minimal logging
- Strict CORS
- Rate limiting enforced
- No source maps
- Health checks enabled

## Conclusion

Flow's two-service architecture provides security and scalability. The backend service enables auto-credentials while maintaining security through CORS, rate limiting, and validation.

For more information:
- [Auto-Credentials Documentation](./auto-credentials.md)
- [Docker Setup Guide](./docker.md)
- [Main README](../README.md)
