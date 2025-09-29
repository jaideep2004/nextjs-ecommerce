// Simple in-memory cache utility
class SimpleCache {
  constructor() {
    this.cache = new Map();
  }

  // Get cached data if it exists and hasn't expired
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }

  // Set data in cache with expiry time (in milliseconds)
  set(key, value, ttl = 300000) { // Default 5 minutes
    this.cache.set(key, {
      value,
      expiry: Date.now() + ttl
    });
  }

  // Delete specific key
  delete(key) {
    this.cache.delete(key);
  }

  // Clear all cache
  clear() {
    this.cache.clear();
  }

  // Get cache size
  size() {
    return this.cache.size;
  }
}

// Create a global instance
const cache = new SimpleCache();

export default cache;