import {createClient, RedisClient} from 'redis';
import env from './env';

let client: RedisClient | null = null;


export function connectRedis() {
  return new Promise(resolve  => {
    client = createClient({
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
      password: env.REDIS_PASSWORD,
    })
    client.on('connect', () => {
      client?.flushall();
      console.log("Connected to Redis.")
      resolve(client);
    })
  })
}

export function redisClient () {
  return client as RedisClient;;
}

