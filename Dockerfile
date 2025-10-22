# Stage 1: Build
FROM node:18 AS builder

WORKDIR /app

# Copy everything including node_modules (faster for build)
COPY . .

# Install/update dependencies if needed
RUN npm install --prefer-offline --no-audit --no-fund

# Build the application
RUN npm run build

# Stage 2: Production
FROM nginx:alpine

# Install Chromium and dependencies for Playwright
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# Set Playwright environment variables
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
ENV PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built application from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy icon packs (PROTECTED DIRECTORY)
COPY --from=builder /app/public/iconpacks /usr/share/nginx/html/iconpacks

# Expose port 2727
EXPOSE 2727

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:2727/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
