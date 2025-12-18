-- =====================================================
-- SÓCIO DO TABULEIRO - DATABASE COMPLETE SETUP
-- Marketplace para RPG e Board Games no Brasil
-- =====================================================

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS ledger_entries CASCADE;
DROP TABLE IF EXISTS user_achievements CASCADE;
DROP TABLE IF EXISTS achievements CASCADE;
DROP TABLE IF EXISTS food_order_items CASCADE;
DROP TABLE IF EXISTS food_orders CASCADE;
DROP TABLE IF EXISTS food_menu_items CASCADE;
DROP TABLE IF EXISTS adventure_purchases CASCADE;
DROP TABLE IF EXISTS adventures CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS chats CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS venue_tables CASCADE;
DROP TABLE IF EXISTS venues CASCADE;
DROP TABLE IF EXISTS contracts CASCADE;
DROP TABLE IF EXISTS terms_acceptances CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Drop existing enums
DROP TYPE IF EXISTS ledger_entry_type CASCADE;
DROP TYPE IF EXISTS food_order_status CASCADE;
DROP TYPE IF EXISTS notification_type CASCADE;
DROP TYPE IF EXISTS subscription_status CASCADE;
DROP TYPE IF EXISTS subscription_plan CASCADE;
DROP TYPE IF EXISTS payment_method CASCADE;
DROP TYPE IF EXISTS payment_status CASCADE;
DROP TYPE IF EXISTS booking_status CASCADE;
DROP TYPE IF EXISTS session_status CASCADE;
DROP TYPE IF EXISTS contract_status CASCADE;
DROP TYPE IF EXISTS contract_type CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

-- =====================================================
-- ENUMS
-- =====================================================

CREATE TYPE user_role AS ENUM (
    'PLAYER',
    'MASTER', 
    'VENUE_OWNER',
    'ADMIN'
);

CREATE TYPE contract_type AS ENUM (
    'MASTER_AGREEMENT',
    'VENUE_PARTNERSHIP',
    'PREMIUM_SUBSCRIPTION'
);

CREATE TYPE contract_status AS ENUM (
    'PENDING',
    'SIGNED',
    'EXPIRED',
    'CANCELLED'
);

CREATE TYPE session_status AS ENUM (
    'OPEN',
    'FULL',
    'CANCELLED',
    'COMPLETED'
);

CREATE TYPE booking_status AS ENUM (
    'PENDING',
    'CONFIRMED',
    'CANCELLED',
    'COMPLETED'
);

CREATE TYPE payment_status AS ENUM (
    'PENDING',
    'PAID',
    'FAILED',
    'REFUNDED'
);

CREATE TYPE payment_method AS ENUM (
    'CREDIT_CARD',
    'DEBIT_CARD',
    'PIX',
    'BANK_SLIP'
);

CREATE TYPE subscription_plan AS ENUM (
    'BASIC',
    'PREMIUM',
    'MASTER'
);

CREATE TYPE subscription_status AS ENUM (
    'ACTIVE',
    'CANCELLED',
    'EXPIRED'
);

CREATE TYPE notification_type AS ENUM (
    'BOOKING_CONFIRMED',
    'BOOKING_CANCELLED',
    'SESSION_REMINDER',
    'PAYMENT_RECEIVED',
    'NEW_MESSAGE',
    'ACHIEVEMENT_UNLOCKED'
);

CREATE TYPE food_order_status AS ENUM (
    'PENDING',
    'CONFIRMED',
    'PREPARING',
    'READY',
    'DELIVERED',
    'CANCELLED'
);

CREATE TYPE ledger_entry_type AS ENUM (
    'CREDIT',
    'DEBIT',
    'REFUND',
    'COMMISSION'
);

-- =====================================================
-- TABLES
-- =====================================================

-- Profiles (Users)
CREATE TABLE profiles (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    avatar TEXT,
    phone TEXT,
    cpf TEXT UNIQUE,
    role user_role DEFAULT 'PLAYER' NOT NULL,
    is_premium BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Terms Acceptances
CREATE TABLE terms_acceptances (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    version TEXT NOT NULL,
    accepted_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    UNIQUE(profile_id, version)
);

-- Contracts
CREATE TABLE contracts (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    profile_id TEXT NOT NULL REFERENCES profiles(id),
    zap_sign_id TEXT UNIQUE,
    type contract_type NOT NULL,
    status contract_status DEFAULT 'PENDING' NOT NULL,
    signed_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Venues
CREATE TABLE venues (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    owner_id TEXT NOT NULL REFERENCES profiles(id),
    name TEXT NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Venue Tables
CREATE TABLE venue_tables (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    venue_id TEXT NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    capacity INTEGER NOT NULL,
    price_per_hour DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Sessions
CREATE TABLE sessions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    master_id TEXT NOT NULL REFERENCES profiles(id),
    venue_id TEXT REFERENCES venues(id),
    table_id TEXT REFERENCES venue_tables(id),
    title TEXT NOT NULL,
    description TEXT,
    game_system TEXT NOT NULL,
    max_players INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    duration INTEGER NOT NULL, -- minutes
    status session_status DEFAULT 'OPEN' NOT NULL,
    scheduled_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Bookings
CREATE TABLE bookings (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    session_id TEXT NOT NULL REFERENCES sessions(id),
    player_id TEXT NOT NULL REFERENCES profiles(id),
    status booking_status DEFAULT 'PENDING' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(session_id, player_id)
);

-- Payments
CREATE TABLE payments (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    profile_id TEXT NOT NULL REFERENCES profiles(id),
    booking_id TEXT UNIQUE REFERENCES bookings(id),
    asaas_id TEXT UNIQUE,
    amount DECIMAL(10,2) NOT NULL,
    status payment_status DEFAULT 'PENDING' NOT NULL,
    method payment_method NOT NULL,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Subscriptions
CREATE TABLE subscriptions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    profile_id TEXT NOT NULL REFERENCES profiles(id),
    plan subscription_plan NOT NULL,
    status subscription_status DEFAULT 'ACTIVE' NOT NULL,
    starts_at TIMESTAMPTZ NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Chats
CREATE TABLE chats (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Chat Messages
CREATE TABLE chat_messages (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    chat_id TEXT NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
    sender_id TEXT NOT NULL REFERENCES profiles(id),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Notifications
CREATE TABLE notifications (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Reviews
CREATE TABLE reviews (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    session_id TEXT NOT NULL REFERENCES sessions(id),
    reviewer_id TEXT NOT NULL REFERENCES profiles(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(session_id, reviewer_id)
);

-- Adventures
CREATE TABLE adventures (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    game_system TEXT NOT NULL,
    difficulty INTEGER NOT NULL CHECK (difficulty >= 1 AND difficulty <= 5),
    duration INTEGER NOT NULL, -- minutes
    cover_image TEXT,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Adventure Purchases
CREATE TABLE adventure_purchases (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    adventure_id TEXT NOT NULL REFERENCES adventures(id),
    profile_id TEXT NOT NULL REFERENCES profiles(id),
    price DECIMAL(10,2) NOT NULL,
    purchased_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(adventure_id, profile_id)
);

-- Food Menu Items
CREATE TABLE food_menu_items (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    venue_id TEXT NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category TEXT NOT NULL,
    is_available BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Food Orders
CREATE TABLE food_orders (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    profile_id TEXT NOT NULL REFERENCES profiles(id),
    venue_id TEXT NOT NULL,
    status food_order_status DEFAULT 'PENDING' NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Food Order Items
CREATE TABLE food_order_items (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    order_id TEXT NOT NULL REFERENCES food_orders(id) ON DELETE CASCADE,
    menu_item_id TEXT NOT NULL REFERENCES food_menu_items(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL
);

-- Achievements
CREATE TABLE achievements (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    icon TEXT,
    points INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- User Achievements
CREATE TABLE user_achievements (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    achievement_id TEXT NOT NULL REFERENCES achievements(id),
    unlocked_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(profile_id, achievement_id)
);

-- Ledger Entries (Digital Wallet)
CREATE TABLE ledger_entries (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    profile_id TEXT NOT NULL REFERENCES profiles(id),
    type ledger_entry_type NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_sessions_master_id ON sessions(master_id);
CREATE INDEX idx_sessions_venue_id ON sessions(venue_id);
CREATE INDEX idx_sessions_status ON sessions(status);
CREATE INDEX idx_sessions_scheduled_at ON sessions(scheduled_at);
CREATE INDEX idx_bookings_session_id ON bookings(session_id);
CREATE INDEX idx_bookings_player_id ON bookings(player_id);
CREATE INDEX idx_payments_profile_id ON payments(profile_id);
CREATE INDEX idx_notifications_profile_id ON notifications(profile_id);
CREATE INDEX idx_reviews_session_id ON reviews(session_id);
CREATE INDEX idx_chat_messages_chat_id ON chat_messages(chat_id);
CREATE INDEX idx_venues_owner_id ON venues(owner_id);
CREATE INDEX idx_venues_city ON venues(city);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE terms_acceptances ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE adventures ENABLE ROW LEVEL SECURITY;
ALTER TABLE adventure_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE ledger_entries ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Public profiles are viewable" ON profiles
    FOR SELECT USING (true);

-- Terms acceptances policies
CREATE POLICY "Users can manage their own terms acceptances" ON terms_acceptances
    FOR ALL USING (auth.uid() = profile_id);

-- Contracts policies
CREATE POLICY "Users can view their own contracts" ON contracts
    FOR SELECT USING (auth.uid() = profile_id);

-- Venues policies
CREATE POLICY "Venue owners can manage their venues" ON venues
    FOR ALL USING (auth.uid() = owner_id);

CREATE POLICY "Anyone can view active venues" ON venues
    FOR SELECT USING (is_active = true);

-- Venue tables policies
CREATE POLICY "Venue owners can manage their tables" ON venue_tables
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM venues 
            WHERE venues.id = venue_tables.venue_id 
            AND venues.owner_id = auth.uid()
        )
    );

CREATE POLICY "Anyone can view active tables" ON venue_tables
    FOR SELECT USING (is_active = true);

-- Sessions policies
CREATE POLICY "Masters can manage their sessions" ON sessions
    FOR ALL USING (auth.uid() = master_id);

CREATE POLICY "Venue owners can view sessions at their venues" ON sessions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM venues 
            WHERE venues.id = sessions.venue_id 
            AND venues.owner_id = auth.uid()
        )
    );

CREATE POLICY "Anyone can view open sessions" ON sessions
    FOR SELECT USING (status = 'OPEN');

-- Bookings policies
CREATE POLICY "Players can manage their own bookings" ON bookings
    FOR ALL USING (auth.uid() = player_id);

CREATE POLICY "Masters can view bookings for their sessions" ON bookings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM sessions 
            WHERE sessions.id = bookings.session_id 
            AND sessions.master_id = auth.uid()
        )
    );

-- Payments policies
CREATE POLICY "Users can view their own payments" ON payments
    FOR SELECT USING (auth.uid() = profile_id);

-- Subscriptions policies
CREATE POLICY "Users can view their own subscriptions" ON subscriptions
    FOR SELECT USING (auth.uid() = profile_id);

-- Chat messages policies
CREATE POLICY "Session participants can view chat messages" ON chat_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM chats c
            JOIN sessions s ON c.session_id = s.id
            WHERE c.id = chat_messages.chat_id
            AND (s.master_id = auth.uid() OR EXISTS (
                SELECT 1 FROM bookings b 
                WHERE b.session_id = s.id 
                AND b.player_id = auth.uid()
            ))
        )
    );

CREATE POLICY "Session participants can send messages" ON chat_messages
    FOR INSERT WITH CHECK (
        auth.uid() = sender_id AND
        EXISTS (
            SELECT 1 FROM chats c
            JOIN sessions s ON c.session_id = s.id
            WHERE c.id = chat_messages.chat_id
            AND (s.master_id = auth.uid() OR EXISTS (
                SELECT 1 FROM bookings b 
                WHERE b.session_id = s.id 
                AND b.player_id = auth.uid()
            ))
        )
    );

-- Notifications policies
CREATE POLICY "Users can manage their own notifications" ON notifications
    FOR ALL USING (auth.uid() = profile_id);

-- Reviews policies
CREATE POLICY "Users can manage their own reviews" ON reviews
    FOR ALL USING (auth.uid() = reviewer_id);

CREATE POLICY "Anyone can view reviews" ON reviews
    FOR SELECT USING (true);

-- Adventures policies
CREATE POLICY "Anyone can view active adventures" ON adventures
    FOR SELECT USING (is_active = true);

-- Adventure purchases policies
CREATE POLICY "Users can view their own purchases" ON adventure_purchases
    FOR SELECT USING (auth.uid() = profile_id);

-- Food menu items policies
CREATE POLICY "Venue owners can manage their menu items" ON food_menu_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM venues 
            WHERE venues.id = food_menu_items.venue_id 
            AND venues.owner_id = auth.uid()
        )
    );

CREATE POLICY "Anyone can view available menu items" ON food_menu_items
    FOR SELECT USING (is_available = true);

-- Food orders policies
CREATE POLICY "Users can manage their own food orders" ON food_orders
    FOR ALL USING (auth.uid() = profile_id);

-- Achievements policies
CREATE POLICY "Anyone can view achievements" ON achievements
    FOR SELECT USING (true);

-- User achievements policies
CREATE POLICY "Users can view their own achievements" ON user_achievements
    FOR SELECT USING (auth.uid() = profile_id);

-- Ledger entries policies
CREATE POLICY "Users can view their own ledger entries" ON ledger_entries
    FOR SELECT USING (auth.uid() = profile_id);

-- =====================================================
-- SAMPLE DATA
-- =====================================================

-- Sample Profiles
INSERT INTO profiles (id, email, name, role) VALUES
('user_player_1', 'joao@email.com', 'João Silva', 'PLAYER'),
('user_master_1', 'maria@email.com', 'Maria Santos', 'MASTER'),
('user_venue_1', 'carlos@email.com', 'Carlos Loja', 'VENUE_OWNER'),
('user_admin_1', 'admin@socio.com', 'Admin Sistema', 'ADMIN');

-- Sample Venues
INSERT INTO venues (id, owner_id, name, description, address, city, state, zip_code) VALUES
('venue_1', 'user_venue_1', 'Taverna do Dragão', 'Loja especializada em RPG e board games', 'Rua dos Jogos, 123', 'São Paulo', 'SP', '01234-567'),
('venue_2', 'user_venue_1', 'Café Geek', 'Café temático com mesas para jogos', 'Av. Nerd, 456', 'Rio de Janeiro', 'RJ', '20000-000');

-- Sample Venue Tables
INSERT INTO venue_tables (id, venue_id, name, capacity, price_per_hour) VALUES
('table_1', 'venue_1', 'Mesa Principal', 6, 25.00),
('table_2', 'venue_1', 'Mesa VIP', 4, 35.00),
('table_3', 'venue_2', 'Mesa Café', 8, 20.00);

-- Sample Sessions
INSERT INTO sessions (id, master_id, venue_id, table_id, title, description, game_system, max_players, price, duration, scheduled_at) VALUES
('session_1', 'user_master_1', 'venue_1', 'table_1', 'D&D 5e - Maldição de Strahd', 'Aventura épica em Barovia', 'D&D 5e', 5, 50.00, 240, NOW() + INTERVAL '7 days'),
('session_2', 'user_master_1', 'venue_2', 'table_3', 'Pathfinder - Kingmaker', 'Construa seu próprio reino', 'Pathfinder', 6, 60.00, 300, NOW() + INTERVAL '14 days');

-- Sample Adventures
INSERT INTO adventures (id, title, description, price, game_system, difficulty, duration) VALUES
('adv_1', 'O Tesouro Perdido', 'Uma aventura para iniciantes em D&D', 15.00, 'D&D 5e', 2, 180),
('adv_2', 'A Torre do Mago Louco', 'Aventura desafiadora para veteranos', 25.00, 'D&D 5e', 4, 300),
('adv_3', 'Mistério na Taverna', 'Investigação e roleplay intenso', 20.00, 'Call of Cthulhu', 3, 240);

-- Sample Achievements
INSERT INTO achievements (id, name, description, points) VALUES
('ach_1', 'Primeiro Jogo', 'Participou da primeira sessão', 10),
('ach_2', 'Mestre Iniciante', 'Mestrou a primeira sessão', 25),
('ach_3', 'Colecionador', 'Comprou 5 aventuras', 50),
('ach_4', 'Veterano', 'Participou de 10 sessões', 100),
('ach_5', 'Lojista', 'Cadastrou o primeiro local', 30);

-- Sample Food Menu Items
INSERT INTO food_menu_items (id, venue_id, name, description, price, category) VALUES
('food_1', 'venue_1', 'Hambúrguer do Dragão', 'Hambúrguer artesanal com batata', 25.00, 'Lanches'),
('food_2', 'venue_1', 'Poção de Cura (Refrigerante)', 'Refrigerante gelado', 8.00, 'Bebidas'),
('food_3', 'venue_2', 'Café Élfico', 'Café especial da casa', 12.00, 'Bebidas'),
('food_4', 'venue_2', 'Torta de Maçã Hobbit', 'Torta caseira quentinha', 18.00, 'Sobremesas');

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_venues_updated_at BEFORE UPDATE ON venues FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- View for session details with related data
CREATE VIEW session_details AS
SELECT 
    s.id,
    s.title,
    s.description,
    s.game_system,
    s.max_players,
    s.price,
    s.duration,
    s.status,
    s.scheduled_at,
    s.created_at,
    -- Master info
    m.name as master_name,
    m.avatar as master_avatar,
    -- Venue info
    v.name as venue_name,
    v.address as venue_address,
    v.city as venue_city,
    -- Table info
    vt.name as table_name,
    vt.capacity as table_capacity,
    -- Booking count
    (SELECT COUNT(*) FROM bookings b WHERE b.session_id = s.id AND b.status = 'CONFIRMED') as confirmed_bookings
FROM sessions s
LEFT JOIN profiles m ON s.master_id = m.id
LEFT JOIN venues v ON s.venue_id = v.id
LEFT JOIN venue_tables vt ON s.table_id = vt.id;

-- View for user statistics
CREATE VIEW user_stats AS
SELECT 
    p.id,
    p.name,
    p.role,
    -- Session stats for masters
    CASE WHEN p.role = 'MASTER' THEN
        (SELECT COUNT(*) FROM sessions s WHERE s.master_id = p.id)
    ELSE 0 END as sessions_mastered,
    -- Booking stats for players
    CASE WHEN p.role = 'PLAYER' THEN
        (SELECT COUNT(*) FROM bookings b WHERE b.player_id = p.id AND b.status = 'COMPLETED')
    ELSE 0 END as sessions_played,
    -- Achievement points
    COALESCE((
        SELECT SUM(a.points) 
        FROM user_achievements ua 
        JOIN achievements a ON ua.achievement_id = a.id 
        WHERE ua.profile_id = p.id
    ), 0) as total_points
FROM profiles p;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

SELECT 'Database setup completed successfully! 🎲' as status;