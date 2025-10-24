# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including TypeScript and dev deps)
RUN npm install

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Stage 2: Production - Use Playwright's official image
FROM mcr.microsoft.com/playwright:v1.40.0-jammy

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Install Playwright browsers
RUN npx playwright install chromium

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Create config directory for persistent storage
RUN mkdir -p /app/config && chmod 755 /app/config

EXPOSE 3001

CMD ["npm", "start"]
