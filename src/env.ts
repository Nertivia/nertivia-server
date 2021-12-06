import {config} from 'dotenv'
import path from 'path';
config({ path: path.join(__dirname, "../.env") });



const env = {
  POSTGRES_URL: process.env.POSTGRES_DB as string,
  JWT_SECRET: process.env.JWT_SECRET as string || "change_me",
  REDIS_HOST: process.env.REDIS_HOST as string,
  REDIS_PORT: parseInt(process.env.REDIS_PORT || "0"),
  REDIS_PASSWORD: process.env.REDIS_PASSWORD as string,
  PORT: process.env.PORT || 80
}

export default env