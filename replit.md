# Sócio do Tabuleiro

A marketplace platform for RPG Masters, Store owners, and Players in Brazil.

## Overview

This is a pnpm monorepo containing:
- **apps/web**: React + Vite frontend (port 5000)
- **apps/api**: Fastify backend API (port 3001)
- **apps/mobile**: React Native mobile app (not running in Replit)
- **packages/database**: Prisma ORM with PostgreSQL
- **packages/shared**: Shared TypeScript types and utilities

## Running the Application

The main workflow runs both the frontend and backend concurrently:
```bash
pnpm dev
```

- Frontend: http://localhost:5000
- Backend API: http://localhost:3001

## Database

PostgreSQL database managed via Prisma ORM.

Common commands:
- `pnpm db:generate` - Generate Prisma client
- `pnpm db:push` - Push schema to database
- `pnpm db:migrate` - Run migrations
- `pnpm db:studio` - Open Prisma Studio

## Environment Variables

Optional:
- `SUPABASE_URL` - For authentication (if not set, auth is disabled)
- `GEMINI_API_KEY` - For AI features

## Architecture

- **Frontend**: React 18 with Vite, using Tailwind CSS
- **Backend**: Fastify with Prisma, rate limiting, and CORS
- **Database**: PostgreSQL with comprehensive schema for users, sessions, bookings, payments, chat, and more

## Recent Changes

- December 2024: Initial Replit environment setup
  - Configured Vite to use port 5000 with allowedHosts: true
  - Configured API to use localhost
  - Made Supabase authentication optional
  - Set up PostgreSQL database with Prisma
