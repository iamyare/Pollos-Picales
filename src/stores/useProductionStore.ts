import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

type DailyProduction = Database['public']['Tables']['daily_production']['Insert'];

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
  registerProduction: async (production) => {
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
  fetchDailyStats: async (date) => {
    try {
      set({ isLoading: true, error: null });
      const { data: efficiency } = await supabase
        .rpc('get_production_efficiency', {
          p_start_date: date,
          p_end_date: date,
        });

      if (efficiency && efficiency.length > 0) {
        const totalChicken = efficiency.find(p => p.product_name.includes('Pollo'))?.total_produced || 0;
        const totalTortillas = efficiency.find(p => p.product_name.includes('Tortilla'))?.total_produced || 0;
        const avgEfficiency = efficiency.reduce((acc, curr) => acc + curr.efficiency_percentage, 0) / efficiency.length;

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