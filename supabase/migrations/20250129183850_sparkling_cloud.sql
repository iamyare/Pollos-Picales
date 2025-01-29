/*
  # Production Management Schema for Pollo & Tortillas Manager

  1. New Tables
    - daily_production (production tracking)
    - recipes (product formulas)
    - recipe_details (formula components)
    - leftovers (waste management)
    - leftover_usage (waste reuse tracking)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users

  3. Features
    - Production tracking
    - Recipe management
    - Waste control
*/

-- Daily Production
CREATE TABLE IF NOT EXISTS daily_production (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    date date NOT NULL,
    product_id uuid REFERENCES products(id),
    quantity_produced decimal(10,2) NOT NULL,
    waste_quantity decimal(10,2) DEFAULT 0,
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Recipes/Formulas
CREATE TABLE IF NOT EXISTS recipes (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    final_product_id uuid REFERENCES products(id),
    name text NOT NULL,
    description text,
    expected_output decimal(10,2),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Recipe Details
CREATE TABLE IF NOT EXISTS recipe_details (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipe_id uuid REFERENCES recipes(id),
    raw_material_id uuid REFERENCES products(id),
    quantity decimal(10,2) NOT NULL,
    unit_id uuid REFERENCES units(id),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Leftovers
CREATE TABLE IF NOT EXISTS leftovers (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id uuid REFERENCES products(id),
    quantity decimal(10,2) NOT NULL,
    date_registered date NOT NULL,
    expiry_date date,
    status text DEFAULT 'available',
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Leftover Usage
CREATE TABLE IF NOT EXISTS leftover_usage (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    leftover_id uuid REFERENCES leftovers(id),
    quantity_used decimal(10,2) NOT NULL,
    usage_date date NOT NULL,
    new_product_id uuid REFERENCES products(id),
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE daily_production ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE leftovers ENABLE ROW LEVEL SECURITY;
ALTER TABLE leftover_usage ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users" ON daily_production FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable write access for authenticated users" ON daily_production FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update access for authenticated users" ON daily_production FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON recipes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable write access for authenticated users" ON recipes FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update access for authenticated users" ON recipes FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON recipe_details FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable write access for authenticated users" ON recipe_details FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update access for authenticated users" ON recipe_details FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON leftovers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable write access for authenticated users" ON leftovers FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update access for authenticated users" ON leftovers FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON leftover_usage FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable write access for authenticated users" ON leftover_usage FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update access for authenticated users" ON leftover_usage FOR UPDATE TO authenticated USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_daily_production_date ON daily_production(date);
CREATE INDEX IF NOT EXISTS idx_daily_production_product ON daily_production(product_id);
CREATE INDEX IF NOT EXISTS idx_recipe_details_recipe ON recipe_details(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_details_raw_material ON recipe_details(raw_material_id);
CREATE INDEX IF NOT EXISTS idx_leftovers_product ON leftovers(product_id);
CREATE INDEX IF NOT EXISTS idx_leftovers_date ON leftovers(date_registered);