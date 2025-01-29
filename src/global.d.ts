import { Database } from '@/lib/database.types';

declare global {
    type DB = Database;
    type DailyProduction = DB['public']['Tables']['daily_production']['Insert'];
    type Sales = Database['public']['Tables']['sales']['Row'];
type Production = Database['public']['Tables']['daily_production']['Row'];
type LowStockItem = Awaited<ReturnType<typeof getLowStockItems>>[number];

}