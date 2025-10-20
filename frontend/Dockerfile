# =====================================================
# Stage 1: Base
# =====================================================
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# =====================================================
# Stage 2: Dependencies
# =====================================================
FROM base AS dependencies

# Install dependencies
RUN npm ci --only=production && \
    npm cache clean --force

# Install development dependencies in separate layer
FROM base AS dev-dependencies
RUN npm ci && \
    npm cache clean --force

# =====================================================
# Stage 3: Development
# =====================================================
FROM node:20-alpine AS development

WORKDIR /app

# Copy dependencies
COPY --from=dev-dependencies /app/node_modules ./node_modules
COPY package.json package-lock.json ./

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

# Development command with hot reload
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# =====================================================
# Stage 4: Build
# =====================================================
FROM node:20-alpine AS build

WORKDIR /app

# Copy dependencies
COPY --from=dev-dependencies /app/node_modules ./node_modules
COPY package.json package-lock.json ./

# Copy source code
COPY . .

# Build arguments for environment variables
ARG REACT_APP_API_URL=http://localhost:8000/api
ARG REACT_APP_API_TIMEOUT=30000
ARG REACT_APP_APP_NAME=TaskManager

# Set environment variables
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_API_TIMEOUT=$REACT_APP_API_TIMEOUT
ENV REACT_APP_APP_NAME=$REACT_APP_APP_NAME
ENV NODE_ENV=production

# Build application
RUN npm run build

# =====================================================
# Stage 5: Production with Nginx
# =====================================================
FROM nginx:alpine AS production

# Install curl for health checks
RUN apk add --no-cache curl

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built application from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Add non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Set permissions
RUN chown -R nodejs:nodejs /usr/share/nginx/html && \
    chown -R nodejs:nodejs /var/cache/nginx && \
    chown -R nodejs:nodejs /var/log/nginx && \
    chown -R nodejs:nodejs /etc/nginx/conf.d

# Create nginx pid directory with proper permissions
RUN touch /var/run/nginx.pid && \
    chown -R nodejs:nodejs /var/run/nginx.pid

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:80 || exit 1

# Switch to non-root user
USER nodejs

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

# =====================================================
# BUILD INSTRUCTIONS
# =====================================================
#
# Development build:
#   docker build --target development -t task-manager-frontend:dev .
#
# Production build:
#   docker build --target production -t task-manager-frontend:prod \
#     --build-arg REACT_APP_API_URL=https://api.example.com/api .
#
# Build with custom args:
#   docker build --target production \
#     --build-arg REACT_APP_API_URL=http://localhost:8000/api \
#     --build-arg REACT_APP_API_TIMEOUT=60000 \
#     -t task-manager-frontend:prod .
#
# Note: This Dockerfile now uses Vite instead of Create React App
# The dev command runs 'npm run dev' with host binding for Docker
#
# =====================================================