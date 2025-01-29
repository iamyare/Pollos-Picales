/*
  # Utility Functions for Pollo & Tortillas Manager

  1. New Functions
    - check_low_stock: Identifies products below minimum stock levels
    - get_customer_balance: Calculates current customer balance
    - get_daily_sales_summary: Summarizes daily sales
    - get_production_efficiency: Calculates production efficiency metrics

  2. Features
    - Stock monitoring
    - Financial calculations
    - Production analytics
*/

-- Function to check for low stock items
CREATE OR REPLACE FUNCTION check_low_stock()
RETURNS TABLE (
    product_id uuid,
    product_name text,
    current_stock decimal,
    min_stock decimal,
    unit_name text
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.name,
        p.current_stock,
        p.min_stock,
        u.name as unit_name
    FROM products p
    JOIN units u ON p.unit_id = u.id
    WHERE p.current_stock <= p.min_stock
    AND p.status = 'active';
END;
$$ LANGUAGE plpgsql;

-- Function to get customer balance
CREATE OR REPLACE FUNCTION get_customer_balance(p_customer_id uuid)
RETURNS decimal AS $$
DECLARE
    total_receivable decimal;
    total_paid decimal;
BEGIN
    SELECT COALESCE(SUM(amount), 0) INTO total_receivable
    FROM accounts_receivable
    WHERE customer_id = p_customer_id AND status = 'pending';
    
    SELECT COALESCE(SUM(amount), 0) INTO total_paid
    FROM ar_payments p
    JOIN accounts_receivable ar ON p.account_receivable_id = ar.id
    WHERE ar.customer_id = p_customer_id;
    
    RETURN total_receivable - total_paid;
END;
$$ LANGUAGE plpgsql;

-- Function to get daily sales summary
CREATE OR REPLACE FUNCTION get_daily_sales_summary(p_date date)
RETURNS TABLE (
    product_name text,
    total_quantity decimal,
    total_amount decimal,
    average_price decimal
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.name,
        SUM(sd.quantity) as total_quantity,
        SUM(sd.total_price) as total_amount,
        ROUND(AVG(sd.unit_price), 2) as average_price
    FROM sales s
    JOIN sale_details sd ON s.id = sd.sale_id
    JOIN products p ON sd.product_id = p.id
    WHERE DATE(s.date) = p_date
    GROUP BY p.name
    ORDER BY total_amount DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate production efficiency
CREATE OR REPLACE FUNCTION get_production_efficiency(p_start_date date, p_end_date date)
RETURNS TABLE (
    product_name text,
    total_produced decimal,
    total_waste decimal,
    efficiency_percentage decimal
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.name,
        SUM(dp.quantity_produced) as total_produced,
        SUM(dp.waste_quantity) as total_waste,
        ROUND(
            (1 - (SUM(dp.waste_quantity) / NULLIF(SUM(dp.quantity_produced), 0))) * 100, 
            2
        ) as efficiency_percentage
    FROM daily_production dp
    JOIN products p ON dp.product_id = p.id
    WHERE dp.date BETWEEN p_start_date AND p_end_date
    GROUP BY p.name
    ORDER BY efficiency_percentage DESC;
END;
$$ LANGUAGE plpgsql;