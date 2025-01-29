import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

interface CartItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total: number;
}

interface PosStore {
  cart: CartItem[];
  isLoading: boolean;
  error: string | null;
  products: any[];
  fetchProducts: () => Promise<void>;
  addToCart: (product: any, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  processTransaction: (paymentMethod: string) => Promise<void>;
  calculateTotal: () => number;
}

export const usePosStore = create<PosStore>((set, get) => ({
  cart: [],
  isLoading: false,
  error: null,
  products: [],

  fetchProducts: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase
        .from('products')
        .select('id, name, current_stock, unit_price')
        .eq('is_final_product', true)
        .eq('status', 'active');

      if (error) throw error;
      set({ products: data || [] });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  addToCart: (product, quantity) => {
    const cart = get().cart;
    const existingItem = cart.find(item => item.product_id === product.id);

    if (existingItem) {
      set({
        cart: cart.map(item =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + quantity, total: (item.quantity + quantity) * item.unit_price }
            : item
        )
      });
    } else {
      set({
        cart: [...cart, {
          product_id: product.id,
          product_name: product.name,
          quantity,
          unit_price: product.unit_price,
          total: quantity * product.unit_price
        }]
      });
    }
  },

  removeFromCart: (productId) => {
    set({ cart: get().cart.filter(item => item.product_id !== productId) });
  },

  updateQuantity: (productId, quantity) => {
    set({
      cart: get().cart.map(item =>
        item.product_id === productId
          ? { ...item, quantity, total: quantity * item.unit_price }
          : item
      )
    });
  },

  clearCart: () => set({ cart: [] }),

  processTransaction: async (paymentMethod) => {
    try {
      set({ isLoading: true, error: null });
      const cart = get().cart;
      const total = get().calculateTotal();

      const { data: sale, error: saleError } = await supabase
        .from('sales')
        .insert({
          total,
          payment_method_id: paymentMethod,
          status: 'completed',
          date: new Date().toISOString()
        })
        .select('id')
        .single();

      if (saleError) throw saleError;

      const saleDetails = cart.map(item => ({
        sale_id: sale.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total
      }));

      const { error: detailsError } = await supabase
        .from('sale_details')
        .insert(saleDetails);

      if (detailsError) throw detailsError;

      get().clearCart();
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  calculateTotal: () => {
    return get().cart.reduce((acc, item) => acc + item.total, 0);
  },
}));
