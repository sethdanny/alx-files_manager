import { promisify } from 'util';
import { createClient } from 'redis';

class RedisClient {
  /* create redis client */
  constructor() {
    this.client = createClient();
    this.isClientConnected = true;
    this.client.on('error', (err) => {
      console.log('Redis Client failed to connect:', err.message);
      this.isClientConnected = false;
    });
    this.client.on('connect', () => {
      this.isClientConnected = true;
    });
  }

  isAlive() {
    return this.isClientConnected;
  }

  async get(key) {
    return promisify(this.client.get).bind(this.client)(key);
  }

  async set(key, value, duration) {
    promisify(this.client.set).bind(this.client)(key, value);
    promisify(this.client.expire).bind(this.client)(key, duration);
  }

  async del(key) {
    await promisify(this.client.del).bind(this.client)(key);
  }
}
export const redisClient = new RedisClient();
export default redisClient;
