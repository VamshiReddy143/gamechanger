// backend/utils/redis.js
const { Redis } = require('@upstash/redis');
const { createClient } = require('redis'); // Add native Redis client

// Upstash Redis client for regular operations
const upstashClient = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Native Redis client for Socket.IO pub/sub
let pubClient, subClient;
if (process.env.REDIS_URL) {
  pubClient = createClient({ url: process.env.REDIS_URL });
  subClient = pubClient.duplicate();
  
  (async () => {
    await Promise.all([pubClient.connect(), subClient.connect()]);
    console.log('✅ Native Redis Pub/Sub clients connected');
  })();
}

// Test Upstash connection
(async () => {
  try {
    await upstashClient.ping();
    console.log('✅ Connected to Upstash Redis');
  } catch (err) {
    console.error('❌ Upstash Redis connection failed:', err);
  }
})();

module.exports = {
  upstash: upstashClient,
  pubClient,
  subClient
};