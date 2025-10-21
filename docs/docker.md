# Docker Setup Guide for Flow

Complete guide for running Flow in Docker containers for both production and development environments.

## Table of Contents

- [Quick Start](#quick-start)
- [Production Deployment](#production-deployment)
- [Development Environment](#development-environment)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)
- [Advanced Usage](#advanced-usage)

## Quick Start

### Prerequisites

- Docker 20.10 or higher
- Docker Compose 2.0 or higher

### Production (Recommended)

```bash
# Clone the repository
git clone https://github.com/davidwheelen/flow.git
cd flow

# Start Flow
docker-compose up -d

# Access Flow
# Open http://localhost:2727 in your browser
```

That's it! Flow is now running in production mode.

## Production Deployment

### Build and Run

```bash
# Build and start the container
docker-compose up -d

# View logs
docker-compose logs -f flow

# Stop the container
docker-compose down
```

### Architecture

The production setup uses a **multi-stage Docker build**:

1. **Builder Stage**: Uses Node.js 18 Alpine to build the application
   - Installs dependencies with `npm ci`
   - Runs TypeScript compilation and Vite build
   - Generates optimized production assets in `/app/dist`

2. **Production Stage**: Uses Nginx Alpine for serving
   - Copies nginx configuration for port 2727
   - Copies built assets from builder stage
   - Copies iconpacks directory (protected)
   - Includes health check endpoint at `/health`

### Features

- **Port**: 2727 (both internal and external)
- **Auto-restart**: Container restarts automatically unless stopped
- **Health checks**: Built-in health monitoring
- **Gzip compression**: Automatic compression for assets
- **Security headers**: X-Frame-Options, X-Content-Type-Options, X-XSS-Protection
- **Asset caching**: 1-year cache for static assets
- **SPA routing**: Proper fallback for single-page application

### Accessing the Application

Once running, access Flow at:
- **Main Application**: http://localhost:2727
- **Health Check**: http://localhost:2727/health

### Managing the Container

```bash
# View container status
docker ps

# View container logs
docker-compose logs -f

# Restart container
docker-compose restart

# Stop and remove container
docker-compose down

# Rebuild and restart
docker-compose up -d --build
```

## Development Environment

For active development with hot-reload:

### Start Development Mode

```bash
# Start development container
docker-compose -f docker-compose.flow-dev.yml up

# Or in detached mode
docker-compose -f docker-compose.flow-dev.yml up -d
```

### Features

- **Port**: 8181 (both internal and external)
- **Hot Reload**: Automatic reload on file changes
- **Volume Mounts**: Source code mounted for instant updates
  - `./src` - Application source code
  - `./public` - Public assets
  - `./public/iconpacks` - Icon packs (protected)
- **Node Modules**: Isolated in container (not mounted)

### Accessing Development Application

- **Development Server**: http://localhost:8181

### Development Workflow

```bash
# View development logs
docker-compose -f docker-compose.flow-dev.yml logs -f

# Restart development container
docker-compose -f docker-compose.flow-dev.yml restart

# Stop development container
docker-compose -f docker-compose.flow-dev.yml down

# Rebuild development container
docker-compose -f docker-compose.flow-dev.yml up -d --build
```

## Configuration

### Environment Variables

#### Production
- `NODE_ENV=production` - Production mode

#### Development
- `NODE_ENV=development` - Development mode
- `VITE_PORT=8181` - Development server port

### Port Configuration

**Production**:
- External: 2727
- Internal: 2727

**Development**:
- External: 8181
- Internal: 8181

To change ports, modify the `docker-compose.yml` or `docker-compose.flow-dev.yml` files:

```yaml
ports:
  - "YOUR_PORT:2727"  # For production
  # or
  - "YOUR_PORT:8181"  # For development
```

### Volume Mounts

#### Production
- `./public/iconpacks:/usr/share/nginx/html/iconpacks:ro` - Icon packs (read-only)

#### Development
- `./src:/app/src:ro` - Source code (read-only)
- `./public:/app/public:ro` - Public assets (read-only)
- `./public/iconpacks:/app/public/iconpacks:ro` - Icon packs (read-only)
- `/app/node_modules` - Anonymous volume for node_modules

**Important**: The `/iconpacks/isoflow-default/` directory is protected and should never be modified or deleted.

## Troubleshooting

### Port Already in Use

If you see "port already in use" error:

```bash
# Check what's using the port
sudo lsof -i :2727  # For production
sudo lsof -i :8181  # For development

# Stop the conflicting process or change the port in docker-compose.yml
```

### Container Won't Start

```bash
# Check container logs
docker-compose logs flow

# Check container status
docker ps -a

# Remove and rebuild
docker-compose down
docker-compose up -d --build
```

### File Changes Not Reflecting (Development)

```bash
# Ensure you're using the development compose file
docker-compose -f docker-compose.flow-dev.yml restart

# Check if volumes are mounted correctly
docker inspect flow-dev | grep Mounts -A 20
```

### Health Check Failing

```bash
# Check nginx logs
docker-compose exec flow cat /var/log/nginx/error.log

# Test health endpoint manually
curl http://localhost:2727/health
```

### Icons Not Loading

The iconpacks directory is mounted as a volume. Ensure:

1. `/public/iconpacks/isoflow-default/` exists
2. Volume mount in docker-compose.yml is correct
3. Nginx has proper permissions

```bash
# Check iconpacks in container
docker-compose exec flow ls -la /usr/share/nginx/html/iconpacks/
```

### Build Fails

```bash
# Clear Docker cache and rebuild
docker-compose down
docker system prune -a
docker-compose up -d --build
```

## Advanced Usage

### Custom Nginx Configuration

Modify `nginx.conf` to customize:
- Port settings
- Cache headers
- Security headers
- Compression settings

After changes:
```bash
docker-compose down
docker-compose up -d --build
```

### Running Multiple Instances

You can run both production and development simultaneously:

```bash
# Terminal 1: Production on port 2727
docker-compose up

# Terminal 2: Development on port 8181
docker-compose -f docker-compose.flow-dev.yml up
```

### Building Custom Images

```bash
# Build production image
docker build -t flow:custom .

# Build development image
docker build -f Dockerfile.dev -t flow:dev-custom .
```

### Docker Image Management

```bash
# List images
docker images | grep flow

# Remove old images
docker image prune -a

# Tag image for registry
docker tag flow:latest your-registry/flow:latest

# Push to registry
docker push your-registry/flow:latest
```

### Inspecting Containers

```bash
# Enter running container
docker-compose exec flow sh

# View container details
docker inspect flow

# Check resource usage
docker stats flow
```

### Networking

Containers run on the `flow-network` bridge network. To connect other services:

```yaml
services:
  your-service:
    networks:
      - flow-network

networks:
  flow-network:
    external: true
```

## Performance Optimization

### Production Build Optimization

The production build includes:
- Tree-shaking and code splitting
- Minification of JS/CSS
- Gzip compression
- Long-term caching headers
- Optimized asset delivery

### Development Performance

For better development performance:
- Use volume mounts (already configured)
- Enable polling for file watching (already configured in vite.config.ts)
- Allocate sufficient Docker resources (recommend 4GB RAM)

## Security Considerations

1. **Never expose development containers to public internet**
2. **Keep Docker and images updated**
3. **Use environment variables for secrets** (not hardcoded)
4. **Implement proper authentication** for production deployments
5. **Regular security audits**: `docker scan flow:latest`

## Backup and Restore

### Backup Configuration

```bash
# Backup docker-compose files
tar -czf flow-docker-config.tar.gz docker-compose*.yml Dockerfile* nginx.conf

# Backup icon packs (if customized)
tar -czf flow-iconpacks.tar.gz public/iconpacks/
```

### Restore

```bash
# Extract configuration
tar -xzf flow-docker-config.tar.gz

# Extract icon packs
tar -xzf flow-iconpacks.tar.gz

# Rebuild and restart
docker-compose up -d --build
```

## Support

For issues or questions:
- GitHub Issues: https://github.com/davidwheelen/flow/issues
- Documentation: https://github.com/davidwheelen/flow
- Check logs: `docker-compose logs -f`

## Summary

- **Production**: `docker-compose up -d` → http://localhost:2727
- **Development**: `docker-compose -f docker-compose.flow-dev.yml up` → http://localhost:8181
- **Logs**: `docker-compose logs -f`
- **Stop**: `docker-compose down`
- **Rebuild**: `docker-compose up -d --build`
