# Web Development Dockerfile
FROM node:20-alpine

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install dependencies for native modules
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy workspace configuration
COPY pnpm-workspace.yaml ./
COPY package.json pnpm-lock.yaml ./

# Copy all package.json files for workspace resolution
COPY apps/web/package.json ./apps/web/
COPY packages/shared/package.json ./packages/shared/

# Install dependencies
RUN pnpm install

# Copy source code
COPY apps/web ./apps/web/
COPY packages/shared ./packages/shared/

# Expose Vite dev server port
EXPOSE 3000

# Development command with HMR
CMD ["pnpm", "dev:web", "--", "--host", "0.0.0.0", "--port", "3000"]