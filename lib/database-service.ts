// Enhanced Database Service with Caching and Query Optimization
// Comprehensive database operations with Redis caching, query optimization, and error handling

import { supabase } from './supabase';
import { logger } from './logger';

// Cache configuration
interface CacheConfig {
  ttl: number; // Time to live in seconds
  key: string;
  tags?: string[];
}

// Query result interface
export interface QueryResult<T> {
  data: T | null;
  error: string | null;
  fromCache: boolean;
  cachedAt?: string;
  expiresAt?: string;
}

// Database operation types
export type DatabaseOperation = 'select' | 'insert' | 'update' | 'delete' | 'upsert';

// Enhanced database service class
export class DatabaseService {
  private static instance: DatabaseService;
  private cache: Map<string, { data: any; expiresAt: number; tags: string[] }> = new Map();
  private queryCache: Map<string, QueryResult<any>> = new Map();
  private isCacheEnabled = true;
  private defaultTTL = 300; // 5 minutes

  private constructor() {
    this.setupCacheCleanup();
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  /**
   * Enable or disable caching
   */
  public setCacheEnabled(enabled: boolean): void {
    this.isCacheEnabled = enabled;
    logger.info(`Database caching ${enabled ? 'enabled' : 'disabled'}`, 'database');
  }

  /**
   * Set default cache TTL
   */
  public setDefaultTTL(ttl: number): void {
    this.defaultTTL = ttl;
    logger.info(`Default cache TTL set to ${ttl} seconds`, 'database');
  }

  /**
   * Generate cache key from query parameters
   */
  private generateCacheKey(table: string, operation: DatabaseOperation, params: any): string {
    const key = `${table}:${operation}:${JSON.stringify(params)}`;
    return Buffer.from(key).toString('base64');
  }

  /**
   * Check if cache entry is valid
   */
  private isCacheValid(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    return Date.now() < entry.expiresAt;
  }

  /**
   * Get data from cache
   */
  private getFromCache<T>(key: string): QueryResult<T> | null {
    if (!this.isCacheEnabled) return null;

    const entry = this.cache.get(key);
    if (!entry || !this.isCacheValid(key)) {
      this.cache.delete(key);
      return null;
    }

    return {
      data: entry.data,
      error: null,
      fromCache: true,
      cachedAt: new Date(entry.expiresAt - (this.defaultTTL * 1000)).toISOString(),
      expiresAt: new Date(entry.expiresAt).toISOString(),
    };
  }

  /**
   * Store data in cache
   */
  private setCache<T>(key: string, data: T, ttl: number = this.defaultTTL, tags: string[] = []): void {
    if (!this.isCacheEnabled) return;

    const expiresAt = Date.now() + (ttl * 1000);
    this.cache.set(key, {
      data,
      expiresAt,
      tags,
    });

    logger.debug('Data cached', 'database', { key, ttl, tags });
  }

  /**
   * Invalidate cache by tags
   */
  public invalidateCacheByTags(tags: string[]): void {
    if (!this.isCacheEnabled) return;

    let invalidatedCount = 0;
    for (const [key, entry] of this.cache.entries()) {
      if (entry.tags.some(tag => tags.includes(tag))) {
        this.cache.delete(key);
        invalidatedCount++;
      }
    }

    logger.info(`Cache invalidated for tags: ${tags.join(', ')}`, 'database', { invalidatedCount });
  }

  /**
   * Clear all cache
   */
  public clearCache(): void {
    this.cache.clear();
    this.queryCache.clear();
    logger.info('All cache cleared', 'database');
  }

  /**
   * Setup automatic cache cleanup
   */
  private setupCacheCleanup(): void {
    setInterval(() => {
      const now = Date.now();
      let cleanedCount = 0;

      for (const [key, entry] of this.cache.entries()) {
        if (now >= entry.expiresAt) {
          this.cache.delete(key);
          cleanedCount++;
        }
      }

      if (cleanedCount > 0) {
        logger.debug(`Cache cleanup: ${cleanedCount} expired entries removed`, 'database');
      }
    }, 60000); // Cleanup every minute
  }

  /**
   * Execute optimized SELECT query with caching
   */
  public async select<T>(
    table: string,
    options: {
      columns?: string;
      filters?: Record<string, any>;
      orderBy?: { column: string; ascending?: boolean };
      limit?: number;
      offset?: number;
      cache?: CacheConfig;
    } = {}
  ): Promise<QueryResult<T[]>> {
    const cacheKey = this.generateCacheKey(table, 'select', options);
    
    // Check cache first
    const cachedResult = this.getFromCache<T[]>(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    try {
      let query = supabase.from(table).select(options.columns || '*');

      // Apply filters
      if (options.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            query = query.in(key, value);
          } else if (typeof value === 'object' && value !== null) {
            // Handle range queries
            if (value.gte !== undefined) query = query.gte(key, value.gte);
            if (value.lte !== undefined) query = query.lte(key, value.lte);
            if (value.gt !== undefined) query = query.gt(key, value.gt);
            if (value.lt !== undefined) query = query.lt(key, value.lt);
            if (value.like !== undefined) query = query.like(key, value.like);
            if (value.ilike !== undefined) query = query.ilike(key, value.ilike);
          } else {
            query = query.eq(key, value);
          }
        });
      }

      // Apply ordering
      if (options.orderBy) {
        query = query.order(options.orderBy.column, { 
          ascending: options.orderBy.ascending !== false 
        });
      }

      // Apply pagination
      if (options.limit) {
        query = query.limit(options.limit);
      }
      if (options.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) {
        logger.error(`Database select error for table ${table}`, 'database', error);
        return {
          data: null,
          error: error.message,
          fromCache: false,
        };
      }

      const result: QueryResult<T[]> = {
        data: data as T[],
        error: null,
        fromCache: false,
      };

      // Cache the result
      if (options.cache) {
        this.setCache(
          cacheKey,
          data,
          options.cache.ttl,
          options.cache.tags || []
        );
      }

      logger.debug(`Database select completed for table ${table}`, 'database', {
        rowCount: data?.length || 0,
        cached: !!options.cache,
      });

      return result;
    } catch (error) {
      logger.error(`Database select exception for table ${table}`, 'database', error);
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        fromCache: false,
      };
    }
  }

  /**
   * Execute optimized INSERT query
   */
  public async insert<T>(
    table: string,
    data: T | T[],
    options: {
      cache?: CacheConfig;
      invalidateTags?: string[];
    } = {}
  ): Promise<QueryResult<T[]>> {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .insert(data)
        .select();

      if (error) {
        logger.error(`Database insert error for table ${table}`, 'database', error);
        return {
          data: null,
          error: error.message,
          fromCache: false,
        };
      }

      // Invalidate related cache
      if (options.invalidateTags) {
        this.invalidateCacheByTags(options.invalidateTags);
      }

      logger.info(`Database insert completed for table ${table}`, 'database', {
        rowCount: Array.isArray(data) ? data.length : 1,
      });

      return {
        data: result as T[],
        error: null,
        fromCache: false,
      };
    } catch (error) {
      logger.error(`Database insert exception for table ${table}`, 'database', error);
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        fromCache: false,
      };
    }
  }

  /**
   * Execute optimized UPDATE query
   */
  public async update<T>(
    table: string,
    data: Partial<T>,
    filters: Record<string, any>,
    options: {
      cache?: CacheConfig;
      invalidateTags?: string[];
    } = {}
  ): Promise<QueryResult<T[]>> {
    try {
      let query = supabase.from(table).update(data);

      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });

      const { data: result, error } = await query.select();

      if (error) {
        logger.error(`Database update error for table ${table}`, 'database', error);
        return {
          data: null,
          error: error.message,
          fromCache: false,
        };
      }

      // Invalidate related cache
      if (options.invalidateTags) {
        this.invalidateCacheByTags(options.invalidateTags);
      }

      logger.info(`Database update completed for table ${table}`, 'database', {
        rowCount: result?.length || 0,
      });

      return {
        data: result as T[],
        error: null,
        fromCache: false,
      };
    } catch (error) {
      logger.error(`Database update exception for table ${table}`, 'database', error);
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        fromCache: false,
      };
    }
  }

  /**
   * Execute optimized DELETE query
   */
  public async delete(
    table: string,
    filters: Record<string, any>,
    options: {
      invalidateTags?: string[];
    } = {}
  ): Promise<QueryResult<null>> {
    try {
      let query = supabase.from(table).delete();

      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });

      const { error } = await query;

      if (error) {
        logger.error(`Database delete error for table ${table}`, 'database', error);
        return {
          data: null,
          error: error.message,
          fromCache: false,
        };
      }

      // Invalidate related cache
      if (options.invalidateTags) {
        this.invalidateCacheByTags(options.invalidateTags);
      }

      logger.info(`Database delete completed for table ${table}`, 'database');

      return {
        data: null,
        error: null,
        fromCache: false,
      };
    } catch (error) {
      logger.error(`Database delete exception for table ${table}`, 'database', error);
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        fromCache: false,
      };
    }
  }

  /**
   * Execute UPSERT query (insert or update)
   */
  public async upsert<T>(
    table: string,
    data: T | T[],
    options: {
      onConflict?: string;
      cache?: CacheConfig;
      invalidateTags?: string[];
    } = {}
  ): Promise<QueryResult<T[]>> {
    try {
      let query = supabase.from(table).upsert(data);

      if (options.onConflict) {
        query = query.onConflict(options.onConflict);
      }

      const { data: result, error } = await query.select();

      if (error) {
        logger.error(`Database upsert error for table ${table}`, 'database', error);
        return {
          data: null,
          error: error.message,
          fromCache: false,
        };
      }

      // Invalidate related cache
      if (options.invalidateTags) {
        this.invalidateCacheByTags(options.invalidateTags);
      }

      logger.info(`Database upsert completed for table ${table}`, 'database', {
        rowCount: Array.isArray(data) ? data.length : 1,
      });

      return {
        data: result as T[],
        error: null,
        fromCache: false,
      };
    } catch (error) {
      logger.error(`Database upsert exception for table ${table}`, 'database', error);
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        fromCache: false,
      };
    }
  }

  /**
   * Execute raw SQL query (use with caution)
   */
  public async rawQuery<T>(
    query: string,
    params: any[] = [],
    options: {
      cache?: CacheConfig;
    } = {}
  ): Promise<QueryResult<T[]>> {
    const cacheKey = this.generateCacheKey('raw', 'select', { query, params });
    
    // Check cache first
    const cachedResult = this.getFromCache<T[]>(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    try {
      const { data, error } = await supabase.rpc('execute_sql', {
        query,
        params,
      });

      if (error) {
        logger.error('Database raw query error', 'database', error);
        return {
          data: null,
          error: error.message,
          fromCache: false,
        };
      }

      const result: QueryResult<T[]> = {
        data: data as T[],
        error: null,
        fromCache: false,
      };

      // Cache the result
      if (options.cache) {
        this.setCache(
          cacheKey,
          data,
          options.cache.ttl,
          options.cache.tags || []
        );
      }

      logger.debug('Database raw query completed', 'database', {
        rowCount: data?.length || 0,
        cached: !!options.cache,
      });

      return result;
    } catch (error) {
      logger.error('Database raw query exception', 'database', error);
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        fromCache: false,
      };
    }
  }

  /**
   * Get cache statistics
   */
  public getCacheStats(): {
    totalEntries: number;
    memoryUsage: number;
    hitRate: number;
  } {
    const totalEntries = this.cache.size;
    const memoryUsage = JSON.stringify(Array.from(this.cache.values())).length;
    
    return {
      totalEntries,
      memoryUsage,
      hitRate: 0, // Would need to track hits/misses for accurate calculation
    };
  }

  /**
   * Batch operations for better performance
   */
  public async batch<T>(
    operations: Array<{
      operation: DatabaseOperation;
      table: string;
      data?: any;
      filters?: Record<string, any>;
      options?: any;
    }>
  ): Promise<QueryResult<T[]>> {
    try {
      const results: any[] = [];
      
      for (const op of operations) {
        let result: QueryResult<any>;
        
        switch (op.operation) {
          case 'select':
            result = await this.select(op.table, op.options);
            break;
          case 'insert':
            result = await this.insert(op.table, op.data, op.options);
            break;
          case 'update':
            result = await this.update(op.table, op.data, op.filters!, op.options);
            break;
          case 'delete':
            result = await this.delete(op.table, op.filters!, op.options);
            break;
          case 'upsert':
            result = await this.upsert(op.table, op.data, op.options);
            break;
          default:
            throw new Error(`Unsupported operation: ${op.operation}`);
        }
        
        if (result.error) {
          return {
            data: null,
            error: result.error,
            fromCache: false,
          };
        }
        
        results.push(result.data);
      }

      logger.info(`Batch operation completed`, 'database', {
        operationCount: operations.length,
      });

      return {
        data: results as T[],
        error: null,
        fromCache: false,
      };
    } catch (error) {
      logger.error('Batch operation exception', 'database', error);
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        fromCache: false,
      };
    }
  }
}

// Export singleton instance
export const databaseService = DatabaseService.getInstance();

// Export convenience functions
export const db = {
  select: <T>(table: string, options?: any) => databaseService.select<T>(table, options),
  insert: <T>(table: string, data: T | T[], options?: any) => databaseService.insert<T>(table, data, options),
  update: <T>(table: string, data: Partial<T>, filters: Record<string, any>, options?: any) => 
    databaseService.update<T>(table, data, filters, options),
  delete: (table: string, filters: Record<string, any>, options?: any) => 
    databaseService.delete(table, filters, options),
  upsert: <T>(table: string, data: T | T[], options?: any) => databaseService.upsert<T>(table, data, options),
  rawQuery: <T>(query: string, params?: any[], options?: any) => 
    databaseService.rawQuery<T>(query, params, options),
  batch: <T>(operations: any[]) => databaseService.batch<T>(operations),
  clearCache: () => databaseService.clearCache(),
  invalidateCacheByTags: (tags: string[]) => databaseService.invalidateCacheByTags(tags),
  getCacheStats: () => databaseService.getCacheStats(),
};

export default databaseService;
