import { Database } from '@/lib/database.types';

declare global {
    type DB = Database;
    type DailyProduction = DB['public']['Tables']['daily_production']['Insert'];
    type LowStockItem = Awaited<ReturnType<typeof getLowStockItems>>[number];
}