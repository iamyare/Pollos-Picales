export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          category_id: string
          unit_id: string
          min_stock: number
          current_stock: number
          is_raw_material: boolean
          is_final_product: boolean
          barcode: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          category_id: string
          unit_id: string
          min_stock: number
          current_stock?: number
          is_raw_material?: boolean
          is_final_product?: boolean
          barcode?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          category_id?: string
          unit_id?: string
          min_stock?: number
          current_stock?: number
          is_raw_material?: boolean
          is_final_product?: boolean
          barcode?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      daily_production: {
        Row: {
          id: string
          date: string
          product_id: string
          quantity_produced: number
          waste_quantity: number
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          date: string
          product_id: string
          quantity_produced: number
          waste_quantity?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          date?: string
          product_id?: string
          quantity_produced?: number
          waste_quantity?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      sales: {
        Row: {
          id: string
          customer_id: string | null
          date: string
          subtotal: number
          tax: number
          total: number
          payment_method_id: string
          status: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id?: string | null
          date?: string
          subtotal: number
          tax?: number
          total: number
          payment_method_id: string
          status?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string | null
          date?: string
          subtotal?: number
          tax?: number
          total?: number
          payment_method_id?: string
          status?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Functions: {
      check_low_stock: {
        Args: Record<PropertyKey, never>
        Returns: {
          product_id: string
          product_name: string
          current_stock: number
          min_stock: number
          unit_name: string
        }[]
      }
      get_daily_sales_summary: {
        Args: { p_date: string }
        Returns: {
          product_name: string
          total_quantity: number
          total_amount: number
          average_price: number
        }[]
      }
      get_production_efficiency: {
        Args: { p_start_date: string; p_end_date: string }
        Returns: {
          product_name: string
          total_produced: number
          total_waste: number
          efficiency_percentage: number
        }[]
      }
    }
  }
}