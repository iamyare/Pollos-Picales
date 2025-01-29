/*
  # Cash Management Schema for Pollo & Tortillas Manager

  1. New Tables
    - daily_cash (cash register tracking)
    - cash_movements (cash flow tracking)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users

  3. Features
    - Daily cash management
    - Cash movement tracking
*/

-- Daily Cash
CREATE TABLE IF NOT EXISTS daily_cash (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    date date NOT NULL,
    opening_balance decimal(10,2) NOT NULL,
    closing_balance decimal(10,2),
    total_sales decimal(10,2) DEFAULT 0,
    total_expenses decimal(10,2) DEFAULT 0,
    status text DEFAULT 'open',
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Cash Movements
CREATE TABLE IF NOT EXISTS cash_movements (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    daily_cash_id uuid REFERENCES daily_cash(id),
    amount decimal(10,2) NOT NULL,
    movement_type text NOT NULL,
    description text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE daily_cash ENABLE ROW LEVEL SECURITY;
ALTER TABLE cash_movements ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users" ON daily_cash FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable write access for authenticated users" ON daily_cash FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update access for authenticated users" ON daily_cash FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON cash_movements FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable write access for authenticated users" ON cash_movements FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update access for authenticated users" ON cash_movements FOR UPDATE TO authenticated USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_daily_cash_date ON daily_cash(date);
CREATE INDEX IF NOT EXISTS idx_cash_movements_daily_cash ON cash_movements(daily_cash_id);

-- Functions for cash management
CREATE OR REPLACE FUNCTION update_daily_cash_totals()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.movement_type = 'income' THEN
        UPDATE daily_cash
        SET total_sales = total_sales + NEW.amount
        WHERE id = NEW.daily_cash_id;
    ELSIF NEW.movement_type = 'expense' THEN
        UPDATE daily_cash
        SET total_expenses = total_expenses + NEW.amount
        WHERE id = NEW.daily_cash_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_daily_cash_on_movement
    AFTER INSERT ON cash_movements
    FOR EACH ROW
    EXECUTE FUNCTION update_daily_cash_totals();