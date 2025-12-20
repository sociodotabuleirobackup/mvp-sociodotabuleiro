#!/bin/bash

if [ -z "$SUPABASE_PG_PASS" ]; then
  echo "SUPABASE_PG_PASS not set, using default DATABASE_URL"
  exec "$@"
fi

ENCODED_PASS=$(node -e "console.log(encodeURIComponent(process.env.SUPABASE_PG_PASS))")

if [ -n "$SUPABASE_URL" ]; then
  PROJECT_REF=$(echo "$SUPABASE_URL" | sed -n 's/.*db\.\([^.]*\)\.supabase\.co.*/\1/p')
  if [ -z "$PROJECT_REF" ]; then
    PROJECT_REF="${SUPABASE_PROJECT_REF}"
  fi
else
  PROJECT_REF="${SUPABASE_PROJECT_REF}"
fi

if [ -z "$PROJECT_REF" ]; then
  echo "Could not determine Supabase project reference, using default DATABASE_URL"
  exec "$@"
fi

REGION="${SUPABASE_REGION:-us-west-2}"

export DATABASE_URL="postgresql://postgres.${PROJECT_REF}:${ENCODED_PASS}@aws-0-${REGION}.pooler.supabase.com:6543/postgres?pgbouncer=true"
export DIRECT_URL="postgresql://postgres.${PROJECT_REF}:${ENCODED_PASS}@aws-0-${REGION}.pooler.supabase.com:5432/postgres"

# Set Vite frontend environment variables for Supabase client
# The anon key is public by design and safe to expose to the frontend
export VITE_SUPABASE_URL="https://${PROJECT_REF}.supabase.co"

if [ -z "$SUPABASE_ANON_KEY" ]; then
  echo "Warning: SUPABASE_ANON_KEY not set. Frontend authentication will not work."
else
  export VITE_SUPABASE_ANON_KEY="${SUPABASE_ANON_KEY}"
fi

exec "$@"
