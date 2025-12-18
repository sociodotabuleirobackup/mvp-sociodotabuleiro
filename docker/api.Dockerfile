# API Development Dockerfile
FROM node:20-alpine

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install dependencies for native modules
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# Copy workspace configuration
COPY pnpm-workspace.yaml ./
COPY package.json pnpm-lock.yaml ./

# Copy all package.json files for workspace resolution
COPY apps/api/package.json ./apps/api/
COPY packages/shared/package.json ./packages/shared/
COPY packages/database/package.json ./packages/database/

# Copy Prisma schema for generation
COPY packages/database/prisma ./packages/database/prisma/

# Install dependencies
RUN pnpm install

# Copy source code
COPY apps/api ./apps/api/
COPY packages/shared ./packages/shared/
COPY packages/database ./packages/database/

# Generate Prisma client
RUN pnpm db:generate

# Expose port
EXPOSE 3001

# Development command with hot reload
CMD ["pnpm", "dev:api"]