# Ultra-simple Dockerfile for Smithery - assumes dist/ is pre-built
FROM node:20-alpine

WORKDIR /app

# Copy only what's needed
COPY package*.json ./
COPY dist ./dist

# Install only production dependencies
RUN npm ci --production --ignore-scripts

# Run the server
CMD ["node", "dist/index.js"]