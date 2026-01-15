-- BYOUR Database Schema

-- Users profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  handle TEXT UNIQUE,
  avatar_url TEXT,
  current_mode TEXT DEFAULT 'self' CHECK (current_mode IN ('boss', 'hq', 'self', 'shaper')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Websites table for HQ microsite builder
CREATE TABLE websites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  handle TEXT UNIQUE NOT NULL,
  template TEXT NOT NULL DEFAULT 'minimal' CHECK (template IN ('minimal', 'editorial', 'grid')),
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Website blocks (Hero, About, Services, Contact)
CREATE TABLE website_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  website_id UUID NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
  block_type TEXT NOT NULL CHECK (block_type IN ('hero', 'about', 'services', 'contact', 'creative')),
  order_index INTEGER NOT NULL DEFAULT 0,
  content JSONB NOT NULL DEFAULT '{}',
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services table (dynamic service cards within Services block)
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  website_id UUID NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  price_type TEXT NOT NULL DEFAULT 'fixed' CHECK (price_type IN ('fixed', 'quote')),
  price_amount DECIMAL(10,2),
  currency TEXT DEFAULT 'VND',
  order_index INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_websites_user_id ON websites(user_id);
CREATE INDEX idx_websites_handle ON websites(handle);
CREATE INDEX idx_website_blocks_website_id ON website_blocks(website_id);
CREATE INDEX idx_services_website_id ON services(website_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for websites (owner access)
CREATE POLICY "Users can view their own websites" ON websites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own websites" ON websites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own websites" ON websites FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own websites" ON websites FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for website_blocks (owner access through website)
CREATE POLICY "Users can view their own website blocks" ON website_blocks FOR SELECT 
  USING (EXISTS (SELECT 1 FROM websites WHERE websites.id = website_blocks.website_id AND websites.user_id = auth.uid()));
CREATE POLICY "Users can insert their own website blocks" ON website_blocks FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM websites WHERE websites.id = website_blocks.website_id AND websites.user_id = auth.uid()));
CREATE POLICY "Users can update their own website blocks" ON website_blocks FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM websites WHERE websites.id = website_blocks.website_id AND websites.user_id = auth.uid()));
CREATE POLICY "Users can delete their own website blocks" ON website_blocks FOR DELETE 
  USING (EXISTS (SELECT 1 FROM websites WHERE websites.id = website_blocks.website_id AND websites.user_id = auth.uid()));

-- RLS Policies for services (owner access through website)
CREATE POLICY "Users can view their own services" ON services FOR SELECT 
  USING (EXISTS (SELECT 1 FROM websites WHERE websites.id = services.website_id AND websites.user_id = auth.uid()));
CREATE POLICY "Users can insert their own services" ON services FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM websites WHERE websites.id = services.website_id AND websites.user_id = auth.uid()));
CREATE POLICY "Users can update their own services" ON services FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM websites WHERE websites.id = services.website_id AND websites.user_id = auth.uid()));
CREATE POLICY "Users can delete their own services" ON services FOR DELETE 
  USING (EXISTS (SELECT 1 FROM websites WHERE websites.id = services.website_id AND websites.user_id = auth.uid()));

-- Public access policies for published websites
CREATE POLICY "Anyone can view published websites" ON websites FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Anyone can view blocks of published websites" ON website_blocks FOR SELECT 
  USING (EXISTS (SELECT 1 FROM websites WHERE websites.id = website_blocks.website_id AND websites.is_published = TRUE));
CREATE POLICY "Anyone can view services of published websites" ON services FOR SELECT 
  USING (EXISTS (SELECT 1 FROM websites WHERE websites.id = services.website_id AND websites.is_published = TRUE));

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_websites_updated_at BEFORE UPDATE ON websites FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_website_blocks_updated_at BEFORE UPDATE ON website_blocks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
