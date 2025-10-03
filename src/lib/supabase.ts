import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database schema SQL - run this in your Supabase SQL editor
export const DATABASE_SCHEMA = `
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create todos table
CREATE TABLE IF NOT EXISTS todos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('huis', 'DJ', 'persoonlijk')),
  impact TEXT NOT NULL CHECK (impact IN ('laag', 'middel', 'hoog')),
  active BOOLEAN DEFAULT true,
  can_repeat BOOLEAN DEFAULT true,
  min_weeks_between INTEGER DEFAULT 1,
  last_planned_week INTEGER,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  week_size INTEGER DEFAULT 5,
  max_high_per_week INTEGER DEFAULT 2,
  max_medium_per_week INTEGER DEFAULT 2,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create rewards table
CREATE TABLE IF NOT EXISTS rewards (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  threshold_points INTEGER NOT NULL,
  reward_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings
INSERT INTO settings (week_size, max_high_per_week, max_medium_per_week) 
VALUES (5, 2, 2) 
ON CONFLICT DO NOTHING;

-- Insert default rewards
INSERT INTO rewards (threshold_points, reward_name) VALUES 
(50, 'Koffie buiten de deur'),
(80, '10 euro uitgeven op Bandcamp'),
(100, 'Nieuw Pale tasje')
ON CONFLICT DO NOTHING;

-- Insert sample todos
INSERT INTO todos (title, category, impact, can_repeat, min_weeks_between) VALUES 
('Wc schoonmaken', 'huis', 'laag', true, 1),
('Badkamer dweilen', 'huis', 'middel', true, 2),
('Boekhoudtaken', 'DJ', 'hoog', false, 0),
('Set voor vrijdag voorbereiden', 'DJ', 'hoog', false, 0),
('Pauzewandeling 20 min', 'persoonlijk', 'laag', true, 1),
('Social media content plannen', 'DJ', 'middel', true, 1),
('Keuken opruimen', 'huis', 'laag', true, 1),
('Wekelijkse boodschappen', 'huis', 'middel', true, 1),
('Mix opnemen', 'DJ', 'hoog', false, 0),
('Meditatie 10 min', 'persoonlijk', 'laag', true, 1),
('Stofzuigen woonkamer', 'huis', 'laag', true, 1),
('DJ equipment schoonmaken', 'DJ', 'middel', true, 3),
('Sportschool bezoek', 'persoonlijk', 'middel', true, 1),
('Administratie bijwerken', 'persoonlijk', 'hoog', true, 4),
('Planten water geven', 'huis', 'laag', true, 1),
('Nieuwe tracks zoeken', 'DJ', 'middel', true, 1),
('Vrienden bellen', 'persoonlijk', 'laag', true, 2),
('Kledingkast opruimen', 'huis', 'middel', true, 8),
('Backup maken van sets', 'DJ', 'hoog', true, 4),
('Boek lezen (30 min)', 'persoonlijk', 'laag', true, 1)
ON CONFLICT DO NOTHING;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_todos_updated_at BEFORE UPDATE ON todos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rewards_updated_at BEFORE UPDATE ON rewards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
`;
