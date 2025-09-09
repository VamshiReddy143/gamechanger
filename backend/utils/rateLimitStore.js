// backend/utils/rateLimitStore.js
const redis = require('./redis');

module.exports = {
  async increment(key) {
    try {
      // For Upstash Redis (which uses REST API)
      const result = await redis.upstash.incr(key);
      
      // Set expiration if this is the first increment
      if (result === 1) {
        await redis.upstash.expire(key, 900); // 15 minutes in seconds
      }
      
      return {
        totalHits: result,
        resetTime: new Date(Date.now() + 900 * 1000)
      };
    } catch (err) {
      console.error('Rate limit store error:', err);
      // Fallback to in-memory
      return {
        totalHits: 1,
        resetTime: new Date(Date.now() + 900 * 1000)
      };
    }
  },

  async decrement(key) {
    try {
      await redis.upstash.decr(key);
    } catch (err) {
      console.error('Rate limit decrement error:', err);
    }
  },

  async resetKey(key) {
    try {
      await redis.upstash.del(key);
    } catch (err) {
      console.error('Rate limit reset error:', err);
    }
  }
};