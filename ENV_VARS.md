# Environment Variables Guide

This document explains all environment variables used in the Sócio do Tabuleiro application.

## Overview

The application uses a **single consolidated** `.env` file in the root directory for all environment variables across the entire monorepo. This simplifies configuration management and ensures consistency.

- **Root** (`.env`) - **ALL configuration variables** for API, Web, Database, and External Services

**Benefits of consolidated approach:**
- Single source of truth for all environment variables
- Easier to manage and maintain
- Prevents configuration drift between services
- Simplified deployment and CI/CD setup

## Security Notes

⚠️ **IMPORTANT**: Never commit `.env` files to version control. Always use `.env.example` files as templates.

- Use strong, unique values for production
- Rotate secrets regularly
- Use environment-specific values
- Consider using secret management services for production

## Root Environment Variables

### Node Environment

```bash
NODE_ENV=development  # development | staging | production
```

### Database Configuration

```bash
# PostgreSQL connection details
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=sociodotabuleiro
POSTGRES_PORT=5432

# Prisma database URLs
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/sociodotabuleiro?schema=public
DIRECT_URL=postgresql://postgres:postgres@localhost:5432/sociodotabuleiro?schema=public
```

**Notes:**

- `DATABASE_URL` is used by Prisma for migrations and queries
- `DIRECT_URL` is used for direct database connections (bypassing connection pooling)
- For production, use strong passwords and consider connection pooling

### Application Ports

```bash
API_PORT=3001      # Backend API port
WEB_PORT=3000      # Frontend development server port
ADMINER_PORT=8080  # Database admin interface port
```

### CORS Configuration

```bash
CORS_ORIGIN=http://localhost:3000  # Allowed frontend origins
```

## API Environment Variables

### Server Configuration

```bash
NODE_ENV=development
API_PORT=3001
HOST=0.0.0.0      # Bind to all interfaces (Docker)
LOG_LEVEL=debug   # debug | info | warn | error
```

### Authentication & Security

```bash
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d  # Token expiration (7 days)
```

**Security Notes:**

- Use a strong, random JWT secret (minimum 32 characters)
- Consider shorter expiration times for production
- Implement refresh token rotation for enhanced security

### Rate Limiting

```bash
RATE_LIMIT_MAX=100     # Maximum requests per window
RATE_LIMIT_WINDOW=60000 # Window duration in milliseconds (1 minute)
```

### External API Keys

#### Gemini AI (Content Generation)

```bash
GEMINI_API_KEY=your-gemini-api-key-here
```

#### Asaas Payment Gateway

```bash
ASAAS_API_KEY=your-asaas-api-key-here
ASAAS_WALLET_ID=your-asaas-wallet-id-here
ASAAS_ENVIRONMENT=sandbox  # sandbox | production
```

#### ZapSign (Digital Signatures)

```bash
ZAPSIGN_API_KEY=your-zapsign-api-key-here
```

#### Google APIs

```bash
GOOGLE_MAPS_API_KEY=your-google-maps-api-key-here
GOOGLE_CALENDAR_CLIENT_ID=your-google-calendar-client-id
GOOGLE_CALENDAR_CLIENT_SECRET=your-google-calendar-client-secret
```

#### Firebase (Push Notifications)

```bash
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY=your-firebase-private-key
FIREBASE_CLIENT_EMAIL=your-firebase-client-email
```

## Web Frontend Environment Variables

### Development Server

```bash
VITE_PORT=3000  # Development server port
```

### API Configuration

```bash
VITE_API_URL=http://localhost:3001  # Backend API URL
```

**Notes:**

- All Vite environment variables must be prefixed with `VITE_`
- These variables are exposed to the client-side code
- Never put sensitive data in frontend environment variables

### Supabase (Optional)

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Client-side APIs

```bash
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key-here
VITE_GA_TRACKING_ID=your-ga-tracking-id-here
VITE_SENTRY_DSN=your-sentry-dsn-here
```

### Feature Flags

```bash
VITE_ENABLE_ANALYTICS=false      # Enable Google Analytics
VITE_ENABLE_ERROR_TRACKING=false # Enable Sentry error tracking
VITE_ENABLE_MAPS=true           # Enable Google Maps integration
VITE_ENABLE_PAYMENTS=true       # Enable payment features
```

### App Metadata

```bash
VITE_APP_NAME="Sócio do Tabuleiro"
VITE_APP_VERSION=1.0.0
VITE_APP_DESCRIPTION="Marketplace para Mestres, Lojistas e Jogadores de RPG"
```

## Environment-Specific Configurations

### Development

- Use `localhost` URLs
- Enable debug logging
- Use sandbox/test API keys
- Disable analytics and error tracking

### Staging

- Use staging API endpoints
- Enable error tracking
- Use test payment gateways
- Enable analytics with test tracking IDs

### Production

- Use production API endpoints
- Use strong, unique secrets
- Enable all monitoring and analytics
- Use production payment gateways
- Implement proper secret management

## Database URLs by Environment

### Local Development (Docker)

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/sociodotabuleiro?schema=public
```

### Supabase (Production)

```bash
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
```

### Railway/Render (Alternative hosting)

```bash
DATABASE_URL=postgresql://user:password@host:port/database?schema=public
```

## Security Best Practices

### Development

1. Use `.env.example` files as templates
2. Never commit actual `.env` files
3. Use weak/default values for local development
4. Document all required variables

### Production

1. Use environment-specific secret management
2. Rotate secrets regularly
3. Use strong, unique passwords
4. Enable audit logging
5. Restrict API key permissions
6. Use HTTPS for all external communications

### Secret Management Services

Consider using:

- **AWS Secrets Manager**
- **HashiCorp Vault**
- **Azure Key Vault**
- **Google Secret Manager**
- **Railway/Render built-in secrets**

## Validation

The application validates environment variables at startup. Missing required variables will cause the application to fail to start with descriptive error messages.

### Required Variables (API)

- `DATABASE_URL`
- `JWT_SECRET`

### Required Variables (Web)

- `VITE_API_URL`

### Optional Variables

All external API keys are optional and features will be disabled if not provided.

## Troubleshooting

### Common Issues

1. **Database connection fails**
   - Check `DATABASE_URL` format
   - Ensure database server is running
   - Verify credentials and permissions

2. **CORS errors in browser**
   - Check `CORS_ORIGIN` matches frontend URL
   - Ensure protocol (http/https) matches

3. **API authentication fails**
   - Verify `JWT_SECRET` is set and consistent
   - Check token expiration settings

4. **External API features not working**
   - Verify API keys are correct
   - Check API key permissions and quotas
   - Ensure correct environment (sandbox vs production)

### Environment Variable Debugging

```bash
# Check if variables are loaded (API)
curl http://localhost:3001/healthz

# Check frontend build variables
pnpm --filter web build

# Validate environment in development
echo $DATABASE_URL
```

## Migration Guide

When updating environment variables:

1. Update `.env.example` files
2. Document changes in this file
3. Notify team members
4. Update deployment configurations
5. Test in staging before production
