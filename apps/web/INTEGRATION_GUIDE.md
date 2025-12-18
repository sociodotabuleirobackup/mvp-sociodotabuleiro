# Frontend-Backend Integration Guide

This document describes how the frontend has been integrated with the backend API.

## What Was Implemented

### 1. API Client (`src/lib/apiClient.ts`)

- Centralized API communication with error handling
- Authentication token management
- Type-safe endpoints for users, sessions, and bookings
- Automatic error parsing and user-friendly messages

### 2. Feature Hooks

- `src/features/auth/useAuth.ts` - Authentication with real API
- `src/features/sessions/useSessions.ts` - Session listing and management
- `src/features/sessions/useSession.ts` - Individual session details
- `src/features/bookings/useBookings.ts` - Booking management

### 3. Updated Components

- `src/store.tsx` - Now uses real API authentication
- `src/pages/Dashboard.tsx` - Displays real session and booking data
- `src/pages/SessionDetails.tsx` - Real session details and booking functionality

### 4. Type Updates

- Extended `Booking` type in `packages/shared/src/types.ts` to include session data from API responses

## How to Test

### 1. Start the Development Environment

```bash
# Start Docker services (API + Database)
pnpm docker:up

# In another terminal, start the web frontend
pnpm --filter web dev
```

### 2. Test Authentication

1. Go to the web app (http://localhost:3000)
2. Click "Login as Master", "Login as Player", or "Login as Venue"
3. The app will use mock JWT tokens and fetch real user data from the API

### 3. Test Dashboard

- **Master Dashboard**: Shows real sessions created by the master, with stats
- **Player Dashboard**: Shows real bookings and recommended sessions
- **Venue Dashboard**: Shows venue management interface

### 4. Test Session Details

1. Navigate to any session from the dashboard
2. View real session data from the API
3. Test booking functionality (creates real bookings)
4. Test payment simulation (confirms bookings)
5. Masters can cancel their own sessions

## API Endpoints Used

### Authentication

- `GET /api/me` - Get current user profile

### Sessions

- `GET /api/sessions` - List sessions with filters
- `GET /api/sessions/:id` - Get session details
- `POST /api/sessions` - Create session (masters only)
- `PUT /api/sessions/:id` - Update session (masters only)
- `DELETE /api/sessions/:id` - Cancel session (masters only)

### Bookings

- `GET /api/bookings/my` - Get user's bookings
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id/confirm` - Confirm booking (simulate payment)
- `DELETE /api/bookings/:id` - Cancel booking

## Mock vs Real Data

### What's Still Mocked

- JWT tokens (using predefined mock tokens for development)
- Notifications (not yet connected to real API)
- Maps integration (Google Maps API calls are mocked)
- Payment processing (Asaas integration is mocked)

### What's Real

- User authentication and profiles
- Session data (title, description, pricing, scheduling)
- Booking creation and management
- Master session management
- All CRUD operations go through the real API

## Error Handling

The integration includes comprehensive error handling:

- Network errors are caught and displayed to users
- API validation errors show specific field messages
- Authentication errors redirect to login
- Loading states prevent multiple requests

## Environment Variables

Make sure these are set in your `.env`:

```
VITE_API_URL=http://localhost:3001
```

## Next Steps

To complete the integration:

1. Implement real JWT authentication (replace mock tokens)
2. Connect notifications to real API endpoints
3. Implement real payment processing with Asaas
4. Add real-time features (WebSocket for chat, notifications)
5. Implement file upload for session images
6. Add comprehensive error boundaries
