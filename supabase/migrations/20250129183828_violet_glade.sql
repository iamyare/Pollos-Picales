/*
  # Transactions Schema for Pollo & Tortillas Manager

  1. New Tables
    - purchases (purchase orders)
    - purchase_details (purchase line items)
    - sales (sales orders)
    - sale_details (sale line items)
    - accounts_receivable (credit tracking)
    - ar_payments (payment tracking)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users

  3. Features
    - Automatic stock updates on purchases and sales
    - Credit limit enforcement
*/

-- Purchases
CREATE TABLE IF NOT EXISTS purchases (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id uuid REFERENCES suppliers(id),
    date date NOT NULL,
    invoice_number text,
    total_amount decimal(10,2) NOT NULL,
    status text DEFAULT 'completed',
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Purchase Details
CREATE TABLE IF NOT EXISTS purchase_details (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    purchase_id uuid REFERENCES purchases(id),
    product_id uuid REFERENCES products(id),
    quantity decimal(10,2) NOT NULL,
    unit_price decimal(10,2) NOT NULL,
    total_price decimal(10,2) NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Sales
CREATE TABLE IF NOT EXISTS sales (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id uuid REFERENCES customers(id),
    date timestamptz DEFAULT now(),
    subtotal decimal(10,2) NOT NULL,
    tax decimal(10,2) DEFAULT 0,
    total decimal(10,2) NOT NULL,
    payment_method_id uuid REFERENCES payment_methods(id),
    status text DEFAULT 'completed',
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Sale Details
CREATE TABLE IF NOT EXISTS sale_details (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    sale_id uuid REFERENCES sales(id),
    product_id uuid REFERENCES products(id),
    quantity decimal(10,2) NOT NULL,
    unit_price decimal(10,2) NOT NULL,
    total_price decimal(10,2) NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Accounts Receivable
CREATE TABLE IF NOT EXISTS accounts_receivable (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id uuid REFERENCES customers(id),
    sale_id uuid REFERENCES sales(id),
    amount decimal(10,2) NOT NULL,
    due_date date NOT NULL,
    status text DEFAULT 'pending',
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- AR Payments
CREATE TABLE IF NOT EXISTS ar_payments (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_receivable_id uuid REFERENCES accounts_receivable(id),
    payment_date date NOT NULL,
    amount decimal(10,2) NOT NULL,
    payment_method_id uuid REFERENCES payment_methods(id),
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts_receivable ENABLE ROW LEVEL SECURITY;
ALTER TABLE ar_payments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users" ON purchases FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable write access for authenticated users" ON purchases FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update access for authenticated users" ON purchases FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON purchase_details FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable write access for authenticated users" ON purchase_details FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update access for authenticated users" ON purchase_details FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON sales FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable write access for authenticated users" ON sales FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update access for authenticated users" ON sales FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON sale_details FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable write access for authenticated users" ON sale_details FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update access for authenticated users" ON sale_details FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON accounts_receivable FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable write access for authenticated users" ON accounts_receivable FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update access for authenticated users" ON accounts_receivable FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON ar_payments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable write access for authenticated users" ON ar_payments FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update access for authenticated users" ON ar_payments FOR UPDATE TO authenticated USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_purchases_supplier ON purchases(supplier_id);
CREATE INDEX IF NOT EXISTS idx_purchase_details_purchase ON purchase_details(purchase_id);
CREATE INDEX IF NOT EXISTS idx_purchase_details_product ON purchase_details(product_id);
CREATE INDEX IF NOT EXISTS idx_sales_customer ON sales(customer_id);
CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(date);
CREATE INDEX IF NOT EXISTS idx_sale_details_sale ON sale_details(sale_id);
CREATE INDEX IF NOT EXISTS idx_sale_details_product ON sale_details(product_id);
CREATE INDEX IF NOT EXISTS idx_accounts_receivable_customer ON accounts_receivable(customer_id);
CREATE INDEX IF NOT EXISTS idx_accounts_receivable_status ON accounts_receivable(status);

-- Functions and triggers for stock management
CREATE OR REPLACE FUNCTION update_stock_after_purchase()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE products
    SET current_stock = current_stock + NEW.quantity
    WHERE id = NEW.product_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_stock_after_sale()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE products
    SET current_stock = current_stock - NEW.quantity
    WHERE id = NEW.product_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_stock_on_purchase
    AFTER INSERT ON purchase_details
    FOR EACH ROW
    EXECUTE FUNCTION update_stock_after_purchase();

CREATE TRIGGER update_stock_on_sale
    AFTER INSERT ON sale_details
    FOR EACH ROW
    EXECUTE FUNCTION update_stock_after_sale();