import { decodeToken } from "./token"
import {addCachedUser, getCachedUser} from "../cache/userCache";
import { User } from "../interface/User";
import { getUserAll } from "../database/User";


const FAIL_MESSAGE = {
  INVALID_TOKEN: {message: "Invalid token.", statusCode: 401},
  USER_SUSPENDED: {message: "User is suspended.", statusCode: 401}
}


export async function authenticate(token: string) {
  if (!token) throw FAIL_MESSAGE.INVALID_TOKEN;
  const decodedToken = decodeToken(token);
  if (!decodedToken) throw FAIL_MESSAGE.INVALID_TOKEN;
  const user = await getUserFromDbOrCache(decodedToken.id);
  if (!user) throw FAIL_MESSAGE.INVALID_TOKEN;
  const userValidStatus = checkValidUser(decodedToken, user);
  if (userValidStatus === true) {
    return user
  }
  throw checkValidUser;

}


export async function getUserFromDbOrCache(id: string) {
  // Check in cache
  let cachedUser = await getCachedUser(id);
  if (cachedUser) return cachedUser;
  
  // check in database
  const dbUser = await getUserAll(id)
  if (!dbUser) return null;
  cachedUser = await addCachedUser(dbUser);
  return cachedUser
}

type DecodeToken = {id: string, passwordVersion: number}

function checkValidUser(decodedToken: DecodeToken, user: Partial<User>) {
  if (decodedToken.passwordVersion !== user.passwordVersion) {
    return FAIL_MESSAGE.INVALID_TOKEN
  }
  // do more checks in the future. eg suspended.
  return true;
}

