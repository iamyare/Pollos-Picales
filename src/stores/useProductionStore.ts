import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface DailyProduction {
  id?: string;
  date: string;
  product_id: string;
  quantity_produced: number;
  waste_quantity?: number;
  location_id?: string;
}

interface ProductionEfficiency {
  product_id: string;
  product_name: string;
  total_produced: number;
  waste_quantity: number;
  efficiency_percentage: number;
}

interface ProductionStore {
  isLoading: boolean;
  error: string | null;
  dailyStats: {
    totalChicken: number;
    totalTortillas: number;
    efficiency: number;
  };
  registerProduction: (production: DailyProduction) => Promise<void>;
  fetchDailyStats: (date: string) => Promise<void>;
}

export const useProductionStore = create<ProductionStore>((set) => ({
  isLoading: false,
  error: null,
  dailyStats: {
    totalChicken: 0,
    totalTortillas: 0,
    efficiency: 0,
  },
  registerProduction: async (production: DailyProduction) => {
    try {
      set({ isLoading: true, error: null });
      const { error } = await supabase
        .from('daily_production')
        .insert(production);
      
      if (error) throw error;
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchDailyStats: async (date: string) => {
    try {
      set({ isLoading: true, error: null });
      const { data: efficiency } = await supabase
        .rpc('get_production_efficiency', {
          p_start_date: date,
          p_end_date: date,
        }) as { data: ProductionEfficiency[] | null };

      if (efficiency && efficiency.length > 0) {
        const totalChicken = efficiency.find((p: ProductionEfficiency) => 
          p.product_name.includes('Pollo'))?.total_produced || 0;
        const totalTortillas = efficiency.find((p: ProductionEfficiency) => 
          p.product_name.includes('Tortilla'))?.total_produced || 0;
        const avgEfficiency = efficiency.reduce((acc: number, curr: ProductionEfficiency) => 
          acc + curr.efficiency_percentage, 0) / efficiency.length;

        set({
          dailyStats: {
            totalChicken,
            totalTortillas,
            efficiency: avgEfficiency,
          },
        });
      }
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },
}));