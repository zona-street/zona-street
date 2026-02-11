# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy source files needed for production
COPY drizzle ./drizzle
COPY drizzle.config.ts ./drizzle.config.ts

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Expose port (Railway will override this with PORT env var)
EXPOSE 3333

# Start the application
CMD ["npm", "start"]
