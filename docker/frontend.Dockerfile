# Multi-stage build for React/Vite frontend

# Stage 1: Build the application
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY frontend/package*.json ./

# Install dependencies (using --legacy-peer-deps to handle React peer dependency conflicts)
RUN npm ci --legacy-peer-deps

# Copy source code
COPY frontend/ .

# Set API base URL for Vite build
ENV VITE_API_BASE_URL=https://expense-tracker-1-2ly3.onrender.com

# Build the application
RUN npm run build

# Stage 2: Serve the built application with Nginx
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx config for SPA routing (optional, but recommended for React Router)
# If you have a custom nginx.conf, uncomment and copy it
COPY docker/nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
