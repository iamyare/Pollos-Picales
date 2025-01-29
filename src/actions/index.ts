import { supabase } from "@/lib/supabase";
import { Database } from "@/lib/database.types";

type Sales = Database['public']['Tables']['sales']['Row'];
type Production = Database['public']['Tables']['daily_production']['Row'];
type LowStockItem = Awaited<ReturnType<typeof getLowStockItems>>[number];

export const getDashboardMetrics = async () => {
  const today = new Date().toISOString().split('T')[0];
  
  // Obtener ventas del día
  const { data: sales } = await supabase
    .from('sales')
    .select('total')
    .gte('date', today);

  // Obtener producción de pollos
  const { data: chickenProduction } = await supabase
    .from('daily_production')
    .select('quantity_produced, waste_quantity')
    .eq('product_id', 'CHICKEN_PRODUCT_ID')
    .gte('date', today);

  // Obtener producción de tortillas
  const { data: tortillaProduction } = await supabase
    .from('daily_production')
    .select('quantity_produced, waste_quantity')
    .eq('product_id', 'TORTILLA_PRODUCT_ID')
    .gte('date', today);

  // Obtener stock bajo
  const lowStockItems = await getLowStockItems();

  return {
    dailySales: sales?.reduce((acc, curr) => acc + (curr.total || 0), 0) || 0,
    chickensProduced: chickenProduction?.[0]?.quantity_produced || 0,
    tortillasProduced: tortillaProduction?.[0]?.quantity_produced || 0,
    lowStockItems
  };
};

export const getLowStockItems = async () => {
  const { data } = await supabase.rpc('check_low_stock');
  return data || [];
};

export const getRecentTransactions = async () => {
  const { data } = await supabase
    .from('sales')
    .select('id, date, total, sale_details ( product_id, quantity )')
    .order('date', { ascending: false })
    .limit(5);

  return data || [];
};