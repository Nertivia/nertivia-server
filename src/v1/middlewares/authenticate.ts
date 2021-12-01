import { Request, Response, NextFunction } from "express"
import {authenticate} from "../utils/authenticate";

interface Options {
  allowBots?: boolean
}

const defaultOptions = {
  allowBots: false,
}

export default function authenticateMiddleware(options?: Options) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  options = {...defaultOptions, ...options}
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization');

    if (!token) {
      return res.status(401).json({message: "Token not provided in the header."})
    }
    authenticate(token).then(user => {
      res.req.user = user;
      next()
    }).catch(err => 
      res.status(err.statusCode).json({message: err.message})
    )
  }
} 
