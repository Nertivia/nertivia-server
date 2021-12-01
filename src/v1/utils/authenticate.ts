import { decodeToken } from "./token"
import * as UserCache from "../cache/userCache";
import * as UserDao from "../database/userDao";
import { User } from "../interface/User";


const FAIL_MESSAGE = {
  INVALID_TOKEN: {message: "Invalid token.", statusCode: 401},
  USER_SUSPENDED: {message: "User is suspended.", statusCode: 401}
}


export async function authenticate(token: string) {
  if (!token) throw FAIL_MESSAGE.INVALID_TOKEN;
  const decodedToken = decodeToken(token);
  if (!decodedToken) throw FAIL_MESSAGE.INVALID_TOKEN;
  const user = await getUser(decodedToken.id);
  if (!user) throw FAIL_MESSAGE.INVALID_TOKEN;
  const userValidStatus = checkValidUser(decodedToken, user);
  if (userValidStatus === true) {
    return filterUserValues(user as User);
  }
  throw checkValidUser;

}


async function getUser(id: string) {
  // Check in cache
  const cachedUser = await UserCache.getUser(id);
  if (cachedUser) return cachedUser;
  
  // check in database
  const dbUser = await UserDao.getUserAll(id)
  if (!dbUser) return null;
  return dbUser
}

type DecodeToken = {id: string, passwordVersion: number}

function checkValidUser(decodedToken: DecodeToken, user: Partial<User>) {
  if (decodedToken.passwordVersion !== user.password_version) {
    return FAIL_MESSAGE.INVALID_TOKEN
  }
  // do more checks in the future. eg suspended.
  return true;
}


function filterUserValues(user: User): Partial<User> & {id: string} {
  return {
    id: user.id,
    password_version: user.password_version,
  }
}