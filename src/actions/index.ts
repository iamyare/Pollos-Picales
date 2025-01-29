import { supabase } from "@/lib/supabase";

// Interfaces
interface DashboardParams {
  startDate?: string;
  endDate?: string;
  locationId?: string;
}

interface DashboardMetrics {
  dailySales: number;
  chickensProduced: number;
  tortillasProduced: number;
  lowStockItems: LowStockItem[];
}

interface LowStockItem {
  name: string;
  amount: number;
}

interface LowStockItemResponse {
  product_id: string;
  product_name: string;
  current_stock: number;
  min_stock: number;
  unit_name: string;
}

interface TransactionParams {
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
  status?: 'pending' | 'completed' | 'cancelled';
  locationId?: string;
  productId?: string;
  minAmount?: number;
  maxAmount?: number;
  sortBy?: 'date' | 'total' | 'status';
  sortOrder?: 'asc' | 'desc';
}

interface ProductionQuery {
  productId: string;
  startDate: string;
  endDate: string;
  locationId?: string;
  includeWaste?: boolean;
}

// Exportar la función para que pueda ser utilizada
export const getProductionData = async ({ 
  productId, 
  startDate, 
  endDate, 
  locationId, 
  includeWaste 
}: ProductionQuery) => {
  let query = supabase
    .from('daily_production')
    .select(includeWaste ? 'quantity_produced, waste_quantity' : 'quantity_produced')
    .eq('product_id', productId)
    .gte('date', startDate)
    .lte('date', endDate);

  if (locationId) {
    query = query.eq('location_id', locationId);
  }

  const { data, error } = await query;

  if (error) {
    console.error(`Error fetching production for ${productId}:`, error);
    return null;
  }

  return data;
};

export const getDashboardMetrics = async ({
  startDate = new Date().toISOString().split('T')[0],
  endDate = new Date().toISOString().split('T')[0],
}: DashboardParams = {}): Promise<DashboardMetrics> => {
  try {
    // Consulta de ventas
    const { data: sales, error: salesError } = await supabase
      .from('sales')
      .select('total, date')
      .gte('date', startDate)
      .lte('date', endDate);

    if (salesError) throw salesError;

    // Consulta de producción de pollos
    const { data: chickenProduction, error: chickenError } = await supabase
      .from('daily_production')
      .select(`
        quantity_produced,
        products!inner(
          name
        )
      `)
      .eq('products.name', 'Pollo')
      .gte('date', startDate)
      .lte('date', endDate);

    if (chickenError) throw chickenError;

    // Consulta de producción de tortillas
    const { data: tortillaProduction, error: tortillaError } = await supabase
      .from('daily_production')
      .select(`
        quantity_produced,
        products!inner(
          name
        )
      `)
      .eq('products.name', 'Tortilla')
      .gte('date', startDate)
      .lte('date', endDate);

    if (tortillaError) throw tortillaError;

    // Obtener items con stock bajo utilizando la función RPC existente
    // Tipar correctamente la respuesta de check_low_stock
    const { data: lowStockItems, error: lowStockError } = await supabase
      .rpc('check_low_stock');

    if (lowStockError) throw lowStockError;

    return {
      dailySales: sales?.reduce((acc, curr) => acc + (curr.total || 0), 0) || 0,
      chickensProduced: chickenProduction?.reduce((acc, curr) => acc + (curr.quantity_produced || 0), 0) || 0,
      tortillasProduced: tortillaProduction?.reduce((acc, curr) => acc + (curr.quantity_produced || 0), 0) || 0,
      lowStockItems: lowStockItems?.map((item: LowStockItemResponse) => ({
        name: item.product_name,
        amount: Number(item.current_stock)
      })) || []
    };
  } catch (error) {
    console.error('Error in getDashboardMetrics:', error);
    return {
      dailySales: 0,
      chickensProduced: 0,
      tortillasProduced: 0,
      lowStockItems: [{ name: 'Error al cargar datos', amount: 0 }]
    };
  }
};

export const getLowStockItems = async () => {
  const { data, error } = await supabase.rpc('check_low_stock');

  if (error) {
    console.error('Error fetching low stock items:', error);
    return [];
  }

  return data || [];
};

export const getRecentTransactions = async ({
  startDate,
  endDate,
  limit = 5,
  offset = 0,
  status,
  productId,
  minAmount,
  maxAmount,
  sortBy = 'date',
  sortOrder = 'desc'
}: TransactionParams = {}) => {
  try {
    let query = supabase
      .from('sales')
      .select(`
        id,
        date,
        total,
        status,
        sale_details (
          product_id,
          quantity,
          unit_price
        )
      `)
      .order(sortBy, { ascending: sortOrder === 'asc' });

    // Aplicar filtros solo si están definidos
    if (startDate) query = query.gte('date', startDate);
    if (endDate) query = query.lte('date', endDate);
    if (status) query = query.eq('status', status);
    if (minAmount) query = query.gte('total', minAmount);
    if (maxAmount) query = query.lte('total', maxAmount);
    if (productId) {
      query = query.contains('sale_details', [{ product_id: productId }]);
    }

    const { data, error } = await query
      .limit(limit)
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error in getRecentTransactions:', error);
    return [];
  }
};