import { createClient } from './supabase/client';
import { Customer, Invoice, ApiResponse } from '../types/dashboard';
import { logger } from './logger';
import { PostgrestError, SupabaseClient } from '@supabase/supabase-js';

const supabase = createClient() as SupabaseClient;

// Cache voor API responses met proper typing
const apiCache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_DURATION = 60 * 1000; // 1 minuut in milliseconden

// Error types voor betere error handling
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Generieke fetch functie met caching en error handling
async function fetchWithCache<T>(
  cacheKey: string,
  fetchFn: () => Promise<{ data: T | null; error: unknown }>,
  skipCache = false
): Promise<ApiResponse<T>> {
  try {
    // Check cache als we niet expliciet de cache overslaan
    if (!skipCache) {
      const cachedData = apiCache.get(cacheKey);
      const now = Date.now();
      
      if (cachedData && now - cachedData.timestamp < CACHE_DURATION) {
        logger.debug(`Using cached data for ${cacheKey}`, 'api');
        return { success: true, data: cachedData.data as T, error: undefined, status: 200 };
      }
    }

    // Fetch data
    const { data, error } = await fetchFn();

    // Handle error
    if (error) {
            const errorMessage = error instanceof Error ? error.message : 'Er is een fout opgetreden';
      const errorStatus = (error as PostgrestError)?.code ? 400 : 500;
      return {
        success: false,
        error: errorMessage,
        status: errorStatus
      };
    }

    // Cache resultaat
    apiCache.set(cacheKey, { data, timestamp: Date.now() });
    
    return { success: true, data: data || undefined, status: 200 };
  } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Er is een onverwachte fout opgetreden';
    return { 
      success: false,
      error: errorMessage, 
      status: 500 
    };
  }
}

// API functies voor klanten
export const customersApi = {
  // Haal alle klanten op
  getAll: async (skipCache = false): Promise<ApiResponse<Customer[]>> => {
    return fetchWithCache<Customer[]>(
      'customers:all',
      async () => {
        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .order('name', { ascending: true });
        
        return { data, error };
      },
      skipCache
    );
  },

  // Haal een specifieke klant op
  getById: async (id: string, skipCache = false): Promise<ApiResponse<Customer>> => {
    return fetchWithCache<Customer>(
      `customers:${id}`,
      async () => {
        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .eq('id', id)
          .single();
        
        return { data, error };
      },
      skipCache
    );
  },

  // Maak een nieuwe klant aan
  create: async (customerData: Omit<Customer, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Customer>> => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .insert(customerData)
        .select()
        .single();
      
      if (error) {
        const errorMessage = error instanceof Error ? error.message : 'Fout bij het aanmaken van de klant';
        const errorStatus = (error as PostgrestError)?.code ? 400 : 500;
        return { success: false, error: errorMessage, status: errorStatus };
      }
      
      // Invalidate cache
      apiCache.delete('customers:all');
      
      return { success: true, data, status: 201 };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || 'Fout bij het aanmaken van de klant', 
        status: 500 
      };
    }
  },

  // Update een klant
  update: async (id: string, customerData: Partial<Omit<Customer, 'id' | 'created_at' | 'updated_at'>>): Promise<ApiResponse<Customer>> => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .update(customerData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        const errorMessage = error instanceof Error ? error.message : 'Fout bij het bijwerken van de klant';
        const errorStatus = (error as PostgrestError)?.code ? 400 : 500;
        return { success: false, error: errorMessage, status: errorStatus };
      }
      
      // Invalidate cache
      apiCache.delete('customers:all');
      apiCache.delete(`customers:${id}`);
      
      return { success: true, data: data || undefined, status: 200 };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || 'Fout bij het bijwerken van de klant', 
        status: 500 
      };
    }
  },

  // Verwijder een klant
  delete: async (id: string): Promise<ApiResponse<null>> => {
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);
      
      if (error) {
        const errorMessage = error instanceof Error ? error.message : 'Fout bij het verwijderen van de klant';
        const errorStatus = (error as PostgrestError)?.code ? 400 : 500;
        return { success: false, error: errorMessage, status: errorStatus };
      }
      
      // Invalidate cache
      apiCache.delete('customers:all');
      apiCache.delete(`customers:${id}`);
      
      return { success: false, error: undefined, status: 200 };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || 'Fout bij het verwijderen van de klant', 
        status: 500 
      };
    }
  }
};

// API functies voor facturen
export const invoicesApi = {
  // Haal alle facturen op
  getAll: async (skipCache = false): Promise<ApiResponse<Invoice[]>> => {
    return fetchWithCache<Invoice[]>(
      'invoices:all',
      async () => {
        const { data, error } = await supabase
          .from('invoices')
          .select(`
            *,
            customers (
              id,
              name,
              email
            )
          `)
          .order('created_at', { ascending: false });
        
        return { data, error };
      },
      skipCache
    );
  },

  // Haal een specifieke factuur op
  getById: async (id: string, skipCache = false): Promise<ApiResponse<Invoice>> => {
    return fetchWithCache<Invoice>(
      `invoices:${id}`,
      async () => {
        const { data, error } = await supabase
          .from('invoices')
          .select(`
            *,
            customers (
              id,
              name,
              email
            )
          `)
          .eq('id', id)
          .single();
        
        return { data, error };
      },
      skipCache
    );
  },

  // Maak een nieuwe factuur aan
  create: async (invoiceData: Omit<Invoice, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Invoice>> => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .insert(invoiceData)
        .select()
        .single();
      
      if (error) {
        const errorMessage = error instanceof Error ? error.message : 'Fout bij het aanmaken van de factuur';
        const errorStatus = (error as PostgrestError)?.code ? 400 : 500;
        return { success: false, error: errorMessage, status: errorStatus };
      }
      
      // Invalidate cache
      apiCache.delete('invoices:all');
      
      return { success: true, data, status: 201 };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || 'Fout bij het aanmaken van de factuur', 
        status: 500 
      };
    }
  },

  // Update een factuur
  update: async (id: string, invoiceData: Partial<Omit<Invoice, 'id' | 'created_at' | 'updated_at'>>): Promise<ApiResponse<Invoice>> => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .update(invoiceData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        const errorMessage = error instanceof Error ? error.message : 'Fout bij het bijwerken van de factuur';
        const errorStatus = (error as PostgrestError)?.code ? 400 : 500;
        return { success: false, error: errorMessage, status: errorStatus };
      }
      
      // Invalidate cache
      apiCache.delete('invoices:all');
      apiCache.delete(`invoices:${id}`);
      
      return { success: true, data: data || undefined, status: 200 };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || 'Fout bij het bijwerken van de factuur', 
        status: 500 
      };
    }
  },

  // Verwijder een factuur
  delete: async (id: string): Promise<ApiResponse<null>> => {
    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id);
      
      if (error) {
        const errorMessage = error instanceof Error ? error.message : 'Fout bij het verwijderen van de factuur';
        const errorStatus = (error as PostgrestError)?.code ? 400 : 500;
        return { success: false, error: errorMessage, status: errorStatus };
      }
      
      // Invalidate cache
      apiCache.delete('invoices:all');
      apiCache.delete(`invoices:${id}`);
      
      return { success: false, error: undefined, status: 200 };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || 'Fout bij het verwijderen van de factuur', 
        status: 500 
      };
    }
  }
};

// Functie om de cache te wissen
export const clearApiCache = () => {
  apiCache.clear();
  logger.info('Cache cleared', 'api');
};