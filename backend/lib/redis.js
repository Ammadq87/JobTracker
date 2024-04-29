require('dotenv').config();
const Redis = require('ioredis');

const getRedisUrl = () => {
    if (process.env.REDIS_URL) return process.env.REDIS_URL;
    throw new Error('REDIS_URL is not defined');
};

// Create Redis client instance
const redisClient = new Redis(getRedisUrl());

// Error handling for Redis client
redisClient.on('error', function (err) {
    console.error('Redis client error:', err);
});

// Export the Redis client instance
module.exports = redisClient;
