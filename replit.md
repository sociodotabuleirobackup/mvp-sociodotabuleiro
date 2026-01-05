# Sócio do Tabuleiro

## Overview

Sócio do Tabuleiro is a marketplace platform for RPG (Role-Playing Game) and Board Game communities in Brazil. The platform connects three main user types:

- **Masters (Mestres)**: Game Masters who create and run RPG sessions
- **Players (Jogadores)**: Users who join sessions and participate in games
- **Venue Owners (Lojistas)**: Store owners who provide physical spaces for gaming sessions

The platform enables session booking, digital payments, marketplace for game assets (maps, tokens, modules), real-time chat, and digital contract signing for commercial operations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Monorepo Structure

The project uses a **pnpm workspace monorepo** with clear separation between applications and shared packages:

- **apps/**: Contains deployable applications (API, Web, Mobile)
- **packages/**: Contains shared libraries consumed by apps
- **tools/**: Contains scripts, configurations, and automation utilities

### Frontend Architecture

**Web Application** (`apps/web/`)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **Routing**: React Router 7 (using HashRouter)
- **Styling**: Tailwind CSS (loaded via CDN with custom configuration)
- **State Management**: React Context API (`store.tsx`)
- **Design System**: Dark theme with purple/gold accent colors, glass-morphism effects

**Mobile Application** (`apps/mobile/`)
- **Framework**: React Native with Expo SDK 51
- **Navigation**: React Navigation (Stack Navigator)
- **Shared Code**: Imports types and utilities from `@socio-do-tabuleiro/shared`

### Backend Architecture

**API Server** (`apps/api/`)
- **Framework**: Fastify 4 with TypeScript
- **Build Tool**: esbuild (bundles to single dist/index.js)
- **Authentication**: JWT verification using Supabase JWKS endpoint (via `jose` library)
- **Rate Limiting**: Built-in via `@fastify/rate-limit`
- **CORS**: Configured via `@fastify/cors`
- **Static Files**: @fastify/static (v7.0.4) serves frontend in production
- **Validation**: Zod schemas from shared package
- **Logging**: Pino logger with pretty-print in development

### Production Deployment

**Single-Origin Architecture**: Backend serves both API and frontend from port 5000
- Production start: `pnpm run start` builds web and API, then runs Node.js server
- Backend serves static files from `apps/web/dist` when `NODE_ENV=production`
- SPA fallback configured for client-side routing
- Health endpoints: `/health` (simple), `/healthz` (with database check)

### Database Layer

**Primary Database**: PostgreSQL with Prisma ORM
- Two database packages exist (`packages/database/` and `packages/db/`) - consolidation may be needed
- Prisma Client is used for all database operations
- Schema includes: Users/Profiles, Sessions, Bookings, Venues, Payments

### Shared Package

`@socio-do-tabuleiro/shared` provides:
- **Types**: TypeScript enums and interfaces (UserRole, SessionStatus, PaymentStatus, etc.)
- **Schemas**: Zod validation schemas for API requests
- **Utils**: Formatting functions (currency, date), validators (email, CPF)
- **Constants**: App configuration, API endpoints, UI color palette

### Service Stubs (Frontend)

The web app includes service stubs for future integrations:
- **Asaas**: Payment processing with split payments support
- **ZapSign**: Digital contract signing
- **Google Calendar**: Session event management
- **Google Maps**: Geocoding and distance calculations
- **Browser Notifications**: Push notification support

## External Dependencies

### Authentication & Backend Services

| Service | Purpose | Status |
|---------|---------|--------|
| **Supabase** | Authentication (JWT), potentially database hosting | Configured via environment variables |
| **Firebase** | Push notifications (FCM), Firestore (legacy/alternative data store) | Service worker configured, admin scripts available |

### Payment Processing

| Service | Purpose | Status |
|---------|---------|--------|
| **Asaas** | Payment gateway (PIX, Credit Card), wallet management, split payments | Service stub implemented |

### Digital Contracts

| Service | Purpose | Status |
|---------|---------|--------|
| **ZapSign** | Digital signature for "Founder Pact" and venue agreements | Service stub implemented |

### Maps & Location

| Service | Purpose | Status |
|---------|---------|--------|
| **Google Maps API** | Geocoding addresses, calculating distances to venues | Service stub implemented |
| **Google Calendar API** | Creating session events, Google Meet links for online sessions | Service stub implemented |

### AI Integration

| Service | Purpose | Status |
|---------|---------|--------|
| **Google Gemini** | AI features (API key configured in Vite) | Environment variable defined |

### Database

| Service | Purpose | Status |
|---------|---------|--------|
| **PostgreSQL** | Primary relational database | Required, accessed via Prisma |
| **Prisma** | ORM for database access and migrations | Configured in packages/database |

### Environment Variables Required

```
# Supabase
SUPABASE_URL / VITE_SUPABASE_URL
SUPABASE_ANON_KEY / VITE_SUPABASE_ANON_KEY

# Firebase (for notifications)
VITE_FIREBASE_PROJECT_ID
FIREBASE_SERVICE_ACCOUNT_JSON (or FIREBASE_SERVICE_ACCOUNT_PATH)

# AI
GEMINI_API_KEY

# Database
DATABASE_URL (PostgreSQL connection string)
```