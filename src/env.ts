import {config} from 'dotenv'
import path from 'path';
config({ path: path.join(__dirname, "../.env") });


const env = {
  POSTGRES_NAME: process.env.POSTGRES_NAME as string,
  POSTGRES_USER: process.env.POSTGRES_USER as string,
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD as string
}

export default env