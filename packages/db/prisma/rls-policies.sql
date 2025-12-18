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