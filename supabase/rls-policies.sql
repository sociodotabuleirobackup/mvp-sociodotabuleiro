-- RLS Policies para Sócio do Tabuleiro
-- Execute este arquivo no SQL Editor do Supabase

-- Enable RLS em todas as tabelas
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "master_profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "store_profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "sessions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "bookings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "reviews" ENABLE ROW LEVEL SECURITY;

-- Políticas para tabela users
DROP POLICY IF EXISTS "Users can view their own profile" ON "users";
DROP POLICY IF EXISTS "Users can update their own profile" ON "users";
DROP POLICY IF EXISTS "Anyone can view public user info" ON "users";

CREATE POLICY "Users can view their own profile" ON "users"
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON "users"
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can view public user info" ON "users"
    FOR SELECT USING (true);

-- Políticas para master_profiles
DROP POLICY IF EXISTS "Masters can manage their own profile" ON "master_profiles";
DROP POLICY IF EXISTS "Anyone can view master profiles" ON "master_profiles";

CREATE POLICY "Masters can manage their own profile" ON "master_profiles"
    FOR ALL USING (auth.uid() = "userId");

CREATE POLICY "Anyone can view master profiles" ON "master_profiles"
    FOR SELECT USING (true);

-- Políticas para store_profiles
DROP POLICY IF EXISTS "Stores can manage their own profile" ON "store_profiles";
DROP POLICY IF EXISTS "Anyone can view store profiles" ON "store_profiles";

CREATE POLICY "Stores can manage their own profile" ON "store_profiles"
    FOR ALL USING (auth.uid() = "userId");

CREATE POLICY "Anyone can view store profiles" ON "store_profiles"
    FOR SELECT USING (true);

-- Políticas para sessions
DROP POLICY IF EXISTS "Masters can manage their own sessions" ON "sessions";
DROP POLICY IF EXISTS "Stores can manage sessions at their venue" ON "sessions";
DROP POLICY IF EXISTS "Anyone can view open sessions" ON "sessions";
DROP POLICY IF EXISTS "Participants can view their booked sessions" ON "sessions";

CREATE POLICY "Masters can manage their own sessions" ON "sessions"
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM "master_profiles" 
            WHERE "master_profiles"."id" = "sessions"."masterId" 
            AND "master_profiles"."userId" = auth.uid()
        )
    );

CREATE POLICY "Stores can manage sessions at their venue" ON "sessions"
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM "store_profiles" 
            WHERE "store_profiles"."id" = "sessions"."storeId" 
            AND "store_profiles"."userId" = auth.uid()
        )
    );

CREATE POLICY "Anyone can view open sessions" ON "sessions"
    FOR SELECT USING (status = 'OPEN');

CREATE POLICY "Participants can view their booked sessions" ON "sessions"
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM "bookings" 
            WHERE "bookings"."sessionId" = "sessions"."id" 
            AND "bookings"."userId" = auth.uid()
        )
    );

-- Políticas para bookings
DROP POLICY IF EXISTS "Users can manage their own bookings" ON "bookings";
DROP POLICY IF EXISTS "Masters can view bookings for their sessions" ON "bookings";
DROP POLICY IF EXISTS "Stores can view bookings for sessions at their venue" ON "bookings";

CREATE POLICY "Users can manage their own bookings" ON "bookings"
    FOR ALL USING (auth.uid() = "userId");

CREATE POLICY "Masters can view bookings for their sessions" ON "bookings"
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM "sessions" s
            JOIN "master_profiles" mp ON s."masterId" = mp."id"
            WHERE s."id" = "bookings"."sessionId" 
            AND mp."userId" = auth.uid()
        )
    );

CREATE POLICY "Stores can view bookings for sessions at their venue" ON "bookings"
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM "sessions" s
            JOIN "store_profiles" sp ON s."storeId" = sp."id"
            WHERE s."id" = "bookings"."sessionId" 
            AND sp."userId" = auth.uid()
        )
    );

-- Políticas para reviews
DROP POLICY IF EXISTS "Users can manage their own reviews" ON "reviews";
DROP POLICY IF EXISTS "Anyone can view reviews" ON "reviews";
DROP POLICY IF EXISTS "Masters can view reviews for their sessions" ON "reviews";

CREATE POLICY "Users can manage their own reviews" ON "reviews"
    FOR ALL USING (auth.uid() = "userId");

CREATE POLICY "Anyone can view reviews" ON "reviews"
    FOR SELECT USING (true);

CREATE POLICY "Masters can view reviews for their sessions" ON "reviews"
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM "sessions" s
            JOIN "master_profiles" mp ON s."masterId" = mp."id"
            WHERE s."id" = "reviews"."sessionId" 
            AND mp."userId" = auth.uid()
        )
    );