import {createClient} from 'redis';
import env from '../env';



export const redisClient = createClient({
  socket: {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT
  },
  password: env.REDIS_PASSWORD,
});


export function connectRedis() {
  return new Promise(resolve  => {
    redisClient.connect()

    redisClient.on('connect', async () => {
      await redisClient.flushAll()
      console.log("Connected to Redis.")
      resolve(redisClient);
    })
    
  })
}

