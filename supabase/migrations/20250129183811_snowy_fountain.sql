/*
  # Initial Schema Setup for Pollo & Tortillas Manager

  1. New Tables
    - units (measurement units)
    - categories (product categories)
    - products (inventory items)
    - suppliers (vendor information)
    - customers (client data)
    - payment_methods (payment types)

  2. Security
    - Enable RLS on all tables
    - Add basic read/write policies for authenticated users

  3. Extensions
    - Enable UUID generation
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Units of Measurement
CREATE TABLE IF NOT EXISTS units (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    abbreviation text NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Product Categories
CREATE TABLE IF NOT EXISTS categories (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    description text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Products
CREATE TABLE IF NOT EXISTS products (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    description text,
    category_id uuid REFERENCES categories(id),
    unit_id uuid REFERENCES units(id),
    min_stock decimal(10,2),
    current_stock decimal(10,2) DEFAULT 0,
    is_raw_material boolean DEFAULT false,
    is_final_product boolean DEFAULT false,
    barcode text,
    status text DEFAULT 'active',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Suppliers
CREATE TABLE IF NOT EXISTS suppliers (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    contact_person text,
    phone text,
    email text,
    address text,
    tax_id text,
    status text DEFAULT 'active',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Customers
CREATE TABLE IF NOT EXISTS customers (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    phone text,
    email text,
    address text,
    credit_limit decimal(10,2) DEFAULT 0,
    current_balance decimal(10,2) DEFAULT 0,
    status text DEFAULT 'active',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Payment Methods
CREATE TABLE IF NOT EXISTS payment_methods (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    description text,
    status text DEFAULT 'active',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users" ON units FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable write access for authenticated users" ON units FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update access for authenticated users" ON units FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON categories FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable write access for authenticated users" ON categories FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update access for authenticated users" ON categories FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON products FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable write access for authenticated users" ON products FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update access for authenticated users" ON products FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON suppliers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable write access for authenticated users" ON suppliers FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update access for authenticated users" ON suppliers FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON customers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable write access for authenticated users" ON customers FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update access for authenticated users" ON customers FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON payment_methods FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable write access for authenticated users" ON payment_methods FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update access for authenticated users" ON payment_methods FOR UPDATE TO authenticated USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_unit ON products(unit_id);