import { Request, Response, NextFunction } from "express"

import * as userCache from '../cache/userCache'
import { decodeToken } from "../utils/token"
import * as UserDao from "../database/userDao";
import { User } from "../interface/User";

interface Options {
  allowBots?: boolean
}
type DecodeToken = {id: string, passwordVersion: number}

const defaultOptions = {
  allowBots: false,
}

export default function authenticate (options?: Options) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  options = {...defaultOptions, ...options}
  return async (req: Request, res: Response, next: NextFunction) => {
    // check token
    const token = req.header('Authorization');

    if (!token) {
      // Token does not exist
      return res.status(403).json({message: "Token not provided in the header."})
    }

    const decodedToken = decodeToken(token);
    if (!decodedToken) {
      // Token is invalid
      return res.status(403).json({message: "Token is invalid."})
    }

    const isInCache = await checkUserInCache(res, req, decodedToken);
    if (isInCache) return next();
    if (isInCache === undefined) return;
    const isInDatabase = await checkUserInDatabase(res, req, decodedToken)
    if (isInDatabase) return next();
    
    
  }
} 

async function checkUserInCache(res: Response, req: Request, decodedToken: DecodeToken) {
  const cachedUser = await userCache.getUser(decodedToken.id);
  if (!cachedUser) return false;
  const checkUser = checkValidUser(decodedToken, cachedUser);
  if (checkUser !== true) { // When the user is not valid by password version
    res.status(checkUser.statusCode).json({message: checkUser.message})
    return;
  }
  req.user = cachedUser;
  return true;
}


async function checkUserInDatabase(res: Response, req: Request, decodedToken: DecodeToken) {

  // check if user exists in database
  const dbUser = await UserDao.getUserAll(decodedToken.id)
  if (!dbUser) {
    res.status(403).json({message: "User id in the token is invalid"})
    return;
  }
  
  const checkUser = checkValidUser(decodedToken, dbUser);
  if (checkUser !== true) {
    res.status(checkUser.statusCode).json({message: checkUser.message})
    return; 
  }
  req.user = dbUser;
  await userCache.addUser(dbUser);
  return true;
}


function checkValidUser(decodedToken: DecodeToken, user: User) {
  if (decodedToken.passwordVersion !== user.password_version) {
    return {
      message: "Invalid password version!",
      statusCode: 403
    };
  }
  // do more checks in the future.
  return true;
}