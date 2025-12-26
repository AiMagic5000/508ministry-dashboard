-- 508 Ministry Dashboard Database Schema
-- Run this migration on your Cognabase/Supabase instance

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Trust Data table
CREATE TABLE IF NOT EXISTS trust_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trust_name VARCHAR(255) NOT NULL,
    ein VARCHAR(20),
    formation_date DATE,
    trustees TEXT[],
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Donations table
CREATE TABLE IF NOT EXISTS donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    donor_name VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    date DATE NOT NULL,
    type VARCHAR(20) CHECK (type IN ('cash', 'check', 'online', 'in-kind')) DEFAULT 'cash',
    notes TEXT,
    receipt_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Partner Churches table
CREATE TABLE IF NOT EXISTS partner_churches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(50),
    zip VARCHAR(20),
    contact_name VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    partnership_date DATE,
    status VARCHAR(20) CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Distributions table
CREATE TABLE IF NOT EXISTS distributions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    partner_id UUID REFERENCES partner_churches(id) ON DELETE SET NULL,
    partner_name VARCHAR(255),
    date DATE NOT NULL,
    items JSONB DEFAULT '[]',
    total_weight_lbs DECIMAL(10,2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Volunteers table
CREATE TABLE IF NOT EXISTS volunteers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    skills TEXT[],
    availability TEXT[],
    status VARCHAR(20) CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
    hours_logged DECIMAL(10,2) DEFAULT 0,
    joined_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Farm Production table
CREATE TABLE IF NOT EXISTS farm_production (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    crop_name VARCHAR(255) NOT NULL,
    variety VARCHAR(255),
    planted_date DATE,
    harvest_date DATE,
    quantity_lbs DECIMAL(10,2) DEFAULT 0,
    status VARCHAR(20) CHECK (status IN ('planted', 'growing', 'harvested', 'distributed')) DEFAULT 'planted',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Schedule Events table
CREATE TABLE IF NOT EXISTS schedule_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    location VARCHAR(255),
    type VARCHAR(20) CHECK (type IN ('harvest', 'distribution', 'volunteer', 'meeting', 'other')) DEFAULT 'other',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    category VARCHAR(20) CHECK (category IN ('tax', 'legal', 'compliance', 'other')) DEFAULT 'other',
    file_url TEXT,
    uploaded_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity Log table
CREATE TABLE IF NOT EXISTS activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action VARCHAR(255) NOT NULL,
    description TEXT,
    "user" VARCHAR(255),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    category VARCHAR(100)
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_donations_date ON donations(date);
CREATE INDEX IF NOT EXISTS idx_distributions_date ON distributions(date);
CREATE INDEX IF NOT EXISTS idx_volunteers_status ON volunteers(status);
CREATE INDEX IF NOT EXISTS idx_farm_production_status ON farm_production(status);
CREATE INDEX IF NOT EXISTS idx_schedule_events_start_date ON schedule_events(start_date);
CREATE INDEX IF NOT EXISTS idx_activity_log_timestamp ON activity_log(timestamp);

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE trust_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_churches ENABLE ROW LEVEL SECURITY;
ALTER TABLE distributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE farm_production ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Create policies for anonymous access (for demo purposes - adjust for production)
CREATE POLICY "Enable read access for all users" ON trust_data FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON trust_data FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON trust_data FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON trust_data FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON donations FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON donations FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON donations FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON donations FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON partner_churches FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON partner_churches FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON partner_churches FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON partner_churches FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON distributions FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON distributions FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON distributions FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON distributions FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON volunteers FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON volunteers FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON volunteers FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON volunteers FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON farm_production FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON farm_production FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON farm_production FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON farm_production FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON schedule_events FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON schedule_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON schedule_events FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON schedule_events FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON documents FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON documents FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON documents FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON documents FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON activity_log FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON activity_log FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON activity_log FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON activity_log FOR DELETE USING (true);

-- Insert initial trust data
INSERT INTO trust_data (trust_name, ein, formation_date, trustees, status) VALUES
('Harvest Hope Farm Ministry', '99-1234567', '2024-01-15', ARRAY['John Doe', 'Jane Smith', 'Bob Johnson'], 'active')
ON CONFLICT DO NOTHING;

-- Insert sample activity log entry
INSERT INTO activity_log (action, description, "user", category) VALUES
('System Initialized', '508 Ministry Dashboard database initialized', 'System', 'system');
