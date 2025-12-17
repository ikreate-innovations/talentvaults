// lib/persistent-cache.ts
// Stub implementation - Upstash Redis not configured
// Remove this file or install @upstash/redis if you need persistent cache

export class PersistentCache {
  static async get(key: string): Promise<any> {
    console.warn('⚠️ PersistentCache.get() called but Upstash Redis is not configured');
    return null;
  }
  
  static async set(key: string, value: any): Promise<void> {
    console.warn('⚠️ PersistentCache.set() called but Upstash Redis is not configured');
  }
  
  static async invalidate(pattern: string): Promise<void> {
    console.warn('⚠️ PersistentCache.invalidate() called but Upstash Redis is not configured');
  }
}