# Docker Quick Reference - Flow Application

## 🚀 Quick Start

### Production (Recommended)
```bash
# Start Flow
docker compose up -d

# Access Flow
open http://localhost:2727

# View logs
docker compose logs -f

# Stop Flow
docker compose down
```

### Development
```bash
# Start development server with hot reload
docker compose -f docker-compose.flow-dev.yml up

# Access development server
open http://localhost:8181

# Stop development server
docker compose -f docker-compose.flow-dev.yml down
```

## 📋 Available Commands

### Production Commands
| Command | Description |
|---------|-------------|
| `docker compose up -d` | Start Flow in background |
| `docker compose up` | Start Flow with logs |
| `docker compose down` | Stop and remove containers |
| `docker compose restart` | Restart the container |
| `docker compose logs -f` | Follow container logs |
| `docker compose ps` | Check container status |
| `docker compose build --no-cache` | Rebuild image from scratch |

### Development Commands
| Command | Description |
|---------|-------------|
| `docker compose -f docker-compose.flow-dev.yml up` | Start dev server |
| `docker compose -f docker-compose.flow-dev.yml down` | Stop dev server |
| `docker compose -f docker-compose.flow-dev.yml logs -f` | Follow dev logs |
| `docker compose -f docker-compose.flow-dev.yml restart` | Restart dev server |

## 🔍 Health Checks

### Production
```bash
# Check health endpoint
curl http://localhost:2727/health
# Expected: "healthy"

# Check main app
curl -I http://localhost:2727/
# Expected: HTTP/1.1 200 OK

# Check icons
curl -I http://localhost:2727/iconpacks/isoflow-default/cloud.svg
# Expected: HTTP/1.1 200 OK
```

### Development
```bash
# Check dev server
curl -I http://localhost:8181/
# Expected: HTTP/1.1 200 OK
```

## 🐳 Docker Images

- **Production**: `flow:latest` (nginx:alpine based)
- **Development**: `flow:dev` (node:18-alpine based)

### Image Management
```bash
# List images
docker images | grep flow

# Remove old images
docker image prune -a

# Check image size
docker images flow:latest --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"
```

## 🔧 Configuration

### Environment Variables

#### Production
```yaml
environment:
  - NODE_ENV=production
```

#### Development
```yaml
environment:
  - NODE_ENV=development
  - VITE_PORT=8181
```

### Ports

| Environment | External | Internal | URL |
|-------------|----------|----------|-----|
| Production | 2727 | 2727 | http://localhost:2727 |
| Development | 8181 | 8181 | http://localhost:8181 |

## 📁 Volume Mounts

### Production
- `./public/iconpacks:/usr/share/nginx/html/iconpacks:ro` - Icon packs (read-only)

### Development
- `./src:/app/src:ro` - Source code (read-only)
- `./public:/app/public:ro` - Public assets (read-only)
- `./public/iconpacks:/app/public/iconpacks:ro` - Icon packs (read-only)
- `/app/node_modules` - Node modules (anonymous volume)

## 🛠️ Troubleshooting

### Port Already in Use
```bash
# Find process using port 2727
sudo lsof -i :2727

# Or use a different port
# Edit docker-compose.yml: "YOUR_PORT:2727"
```

### Container Won't Start
```bash
# Check logs
docker compose logs flow

# Rebuild image
docker compose build --no-cache
docker compose up -d
```

### Icons Not Loading
```bash
# Check iconpacks in container
docker exec flow ls -la /usr/share/nginx/html/iconpacks/

# Verify volume mount
docker inspect flow | grep -A 10 Mounts
```

### Dev Server Not Reloading
```bash
# Restart development container
docker compose -f docker-compose.flow-dev.yml restart

# Check if volumes are mounted
docker inspect flow-dev | grep -A 20 Mounts
```

## 🎯 Best Practices

1. **Production**: Always use `docker compose up -d` to run in background
2. **Development**: Use `docker compose -f docker-compose.flow-dev.yml up` (without -d) to see logs
3. **Updates**: Run `docker compose down && docker compose up -d --build` after pulling changes
4. **Cleanup**: Periodically run `docker system prune` to clean up unused resources

## 📊 Container Status

### Check if Running
```bash
docker ps
# Look for "flow" or "flow-dev" in the list
```

### Check Health Status
```bash
docker ps --format "table {{.Names}}\t{{.Status}}"
# Production should show "healthy"
```

### Resource Usage
```bash
docker stats flow
# or
docker stats flow-dev
```

## 🔐 Security

The production setup includes:
- Security headers (X-Frame-Options, X-Content-Type-Options, X-XSS-Protection)
- Read-only volume mounts where possible
- Minimal nginx configuration
- No unnecessary packages in production image

## 📚 More Information

- **Complete Docker Guide**: See `docs/docker.md`
- **Production Test Results**: See `progress/PR30/PRODUCTION_TEST_RESULTS.md`
- **Development Test Results**: See `progress/PR30/DEVELOPMENT_TEST_RESULTS.md`
- **Implementation Summary**: See `progress/PR30/DOCKER_IMPLEMENTATION_SUMMARY.md`

## ✅ Verification Checklist

After starting Flow, verify:

- [ ] Container is running: `docker ps`
- [ ] Health check passing: `curl http://localhost:2727/health`
- [ ] Application accessible: `open http://localhost:2727`
- [ ] Icons loading: Check browser console for errors
- [ ] No errors in logs: `docker compose logs`

## 🎉 Success!

If all checks pass, Flow is successfully running in Docker!

Access the application at:
- **Production**: http://localhost:2727
- **Development**: http://localhost:8181

Enjoy using Flow! 🌊
