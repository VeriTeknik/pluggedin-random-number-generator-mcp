# Multi-stage build for ultra-light Docker image
# Stage 1: Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install all dependencies (including dev) without running scripts
RUN npm ci --ignore-scripts

# Copy source code
COPY src ./src

# Build the TypeScript code
RUN npm run build

# Remove dev dependencies
RUN npm prune --production

# Stage 2: Production stage - using distroless for minimal size
FROM gcr.io/distroless/nodejs20-debian12:nonroot

# Set working directory
WORKDIR /app

# Copy only production dependencies and built code
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

# Use non-root user (already set by distroless)
USER nonroot

# Expose the stdio interface (MCP uses stdio, not network ports)
# This is just for documentation purposes
EXPOSE 0

# Set the entrypoint
ENTRYPOINT ["node", "dist/index.js"]