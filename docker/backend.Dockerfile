# Use Node.js 22 Alpine as base image for lightweight and secure build
FROM node:22-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package files to leverage Docker layer caching
COPY backend/package*.json ./

# Install dependencies (including dev deps for nodemon in development)
RUN npm ci

# Copy the backend source code
COPY backend/ .

# Expose port 4000 (as defined in server.js)
EXPOSE 4000

# Start the application with nodemon for development hot-reload
CMD ["npm", "start"]
