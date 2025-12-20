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

The main workflow runs both the frontend and backend concurrently using `./scripts/set-supabase-env.sh pnpm dev` which sets up the Supabase database connection.

- Frontend: http://localhost:5000
- Backend API: http://localhost:3001

## Database

Using Supabase PostgreSQL database with Prisma ORM.

Common commands (use the set-supabase-env.sh wrapper):
- `./scripts/set-supabase-env.sh pnpm db:generate` - Generate Prisma client
- `./scripts/set-supabase-env.sh pnpm db:push` - Push schema to database  
- `./scripts/set-supabase-env.sh pnpm db:migrate` - Run migrations
- `./scripts/set-supabase-env.sh pnpm db:seed` - Seed demo data

## Environment Variables / Secrets

Required for Supabase:
- `SUPABASE_URL` - Supabase project URL (for authentication)
- `SUPABASE_PG_PASS` - Supabase PostgreSQL password
- `SUPABASE_PROJECT_REF` - Supabase project reference ID

Optional:
- `SUPABASE_REGION` - AWS region (default: us-west-2)
- `GEMINI_API_KEY` - For AI features

## Architecture

- **Frontend**: React 18 with Vite, using Tailwind CSS
- **Backend**: Fastify with Prisma, rate limiting, and CORS
- **Database**: Supabase PostgreSQL with comprehensive schema for users, sessions, bookings, payments, chat, and more
- **Auth**: Supabase JWT authentication

## Recent Changes

- December 2024: Initial Replit environment setup
  - Configured Vite to use port 5000 with allowedHosts: true
  - Configured API to use localhost on port 3001
  - Connected to Supabase PostgreSQL (us-west-2 region)
  - Created set-supabase-env.sh script for proper connection string handling
  - Seeded database with demo data
