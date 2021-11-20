import {config} from 'dotenv'
import path from 'path';
config({ path: path.join(__dirname, "../.env") });


const env = {
  DB_NAME: process.env.DB_NAME as string,
  DB_USER: process.env.DB_USER as string,
  DB_PASSWORD: process.env.DB_PASSWORD as string
}

export default env