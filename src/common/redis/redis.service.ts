import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  // Redis client used to interact with the database
  private client: Redis;

  constructor() {
    // Initialize Redis connection with host and port
    this.client = new Redis({
      host: '127.0.0.1', // Redis server address
      port: 6379, // Default Redis port
    });
  }

  // Method to get a value from Redis using a key
  async get(key: string) {
    // Retrieve the stored value from Redis
    const data = await this.client.get(key);

    // If data exists, parse it from JSON to object
    // If not, return null
    return data ? JSON.parse(data) : null;
  }

  // Method to store data in Redis
  async set(key: string, value: any, ttl = 60) {
    // Convert value to JSON and store it with a TTL (time to live in seconds)
    await this.client.set(key, JSON.stringify(value), 'EX', ttl);
  }

  // Method to delete a key from Redis
  async del(key: string) {
    // Remove the specified key from Redis
    await this.client.del(key);
  }
}
