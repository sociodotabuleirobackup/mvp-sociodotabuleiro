# Local Development Guide

This guide explains how to set up and run the Sócio do Tabuleiro application locally.

## Prerequisites

- **Node.js** 20+ (with corepack enabled)
- **pnpm** 8+ (install via `corepack enable`)
- **Docker** and **Docker Compose**
- **Git**

## Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd mvp-sociodotabuleiro

# Install dependencies
pnpm install
```

### 2. Environment Setup

```bash
# Copy environment files
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# Edit the .env files with your values (optional for development)
```

### 3. Start Development Environment

```bash
# Start all services with Docker
pnpm docker:up

# Wait for services to be ready (about 30 seconds)
# Check status
pnpm docker:ps
```

### 4. Database Setup

```bash
# Run migrations
pnpm db:migrate

# Seed with test data
pnpm db:seed
```

### 5. Verify Setup

```bash
# Check API health
curl http://localhost:3001/healthz

# Check web frontend
curl -I http://localhost:3000
```

## Development Workflow

### Running Applications

```bash
# Start all services (API + Web + Database)
pnpm docker:up

# Or run individually:
pnpm dev:api    # API only (requires database)
pnpm dev:web    # Web frontend only
pnpm dev:mobile # Mobile app (Expo)
```

### Code Quality

```bash
# Lint all code
pnpm lint

# Fix linting issues
pnpm lint:fix

# Format all code
pnpm format

# Type checking
pnpm typecheck
```

### Database Operations

```bash
# Generate Prisma client
pnpm db:generate

# Create new migration
pnpm db:migrate

# Reset database (destructive!)
pnpm db:reset

# Open Prisma Studio
pnpm db:studio

# Seed database with test data
pnpm db:seed
```

### Building

```bash
# Build all packages and apps
pnpm build

# Build specific apps
pnpm build:api
pnpm build:web
```

## Docker Services

The development environment includes:

| Service        | Port | Description              |
| -------------- | ---- | ------------------------ |
| **API**        | 3001 | Fastify backend server   |
| **Web**        | 3000 | React frontend (Vite)    |
| **PostgreSQL** | 5432 | Database                 |
| **Adminer**    | 8080 | Database admin interface |

### Docker Commands

```bash
# Start all services
pnpm docker:up

# Stop all services
pnpm docker:down

# View logs
pnpm docker:logs
pnpm docker:logs:api
pnpm docker:logs:web

# Rebuild containers
pnpm docker:build

# Clean up (removes volumes and images)
pnpm docker:clean
```

## Project Structure

```
mvp-sociodotabuleiro/
├── apps/
│   ├── api/          # Fastify backend
│   ├── web/          # React frontend
│   └── mobile/       # React Native (Expo)
├── packages/
│   ├── shared/       # Shared types and utilities
│   └── database/     # Prisma schema and migrations
├── docker/           # Docker configurations
├── docs/             # Documentation
└── scripts/          # Utility scripts
```

## Troubleshooting

### Port Conflicts

If ports are already in use:

```bash
# Check what's using the ports
lsof -i :3000  # Web
lsof -i :3001  # API
lsof -i :5432  # PostgreSQL

# Kill processes or change ports in docker-compose.yml
```

### Database Issues

```bash
# Reset database completely
pnpm docker:down
docker volume rm mvp-sociodotabuleiro_postgres_data
pnpm docker:up
pnpm db:migrate
pnpm db:seed
```

### Permission Issues

```bash
# Fix node_modules permissions (macOS/Linux)
sudo chown -R $(whoami) node_modules/
```

### Docker Issues

```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
pnpm docker:build
```

## API Testing

### Health Check

```bash
curl http://localhost:3001/healthz
```

### Authentication (Development)

The API uses mock JWT tokens in development:

```bash
# Test as Master
curl -H "Authorization: Bearer mock-master-token" \
  http://localhost:3001/api/me

# Test as Player
curl -H "Authorization: Bearer mock-player-token" \
  http://localhost:3001/api/me
```

### Example API Calls

```bash
# List sessions
curl http://localhost:3001/api/sessions

# Get session details
curl http://localhost:3001/api/sessions/[session-id]

# Create booking (requires auth)
curl -X POST \
  -H "Authorization: Bearer mock-player-token" \
  -H "Content-Type: application/json" \
  -d '{"sessionId": "[session-id]"}' \
  http://localhost:3001/api/bookings
```

## IDE Setup

### VS Code Extensions

Recommended extensions:

- ESLint
- Prettier
- TypeScript and JavaScript Language Features
- Prisma
- Docker

### Settings

Add to `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "eslint.workingDirectories": ["apps/api", "apps/web", "packages/shared"]
}
```

## Performance Tips

- Use `pnpm` instead of `npm` for faster installs
- Keep Docker containers running between sessions
- Use `pnpm --filter` to run commands on specific packages
- Enable TypeScript strict mode for better development experience

## Getting Help

- Check the [Environment Variables Guide](./ENV_VARS.md)
- Review API documentation in `apps/api/API_EXAMPLES.md`
- Check Docker logs for runtime issues
- Ensure all environment variables are properly set
