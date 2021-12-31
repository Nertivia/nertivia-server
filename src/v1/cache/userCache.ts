import { redisClient } from "../../common/redis";
import { Presence } from "../database/User";
import { User } from "../interface/User";


export interface CacheUser {
  // user should contain public information, root should contain private information.
  user: Partial<User> & {id: string}
  passwordVersion: number
  presence: number
}

export function constructCachedUser(user: Partial<User>) : CacheUser {
  return {
    user: {
      id: user.id,
      tag: user.tag,
      username: user.username,
    },
    passwordVersion: user.passwordVersion,
    presence: user.presence
  } as CacheUser
}


export async function addCachedUser(user: User ): Promise<CacheUser | null> {
  const key = `user:${user.id}`;
  const cachedUser = constructCachedUser(user);
  const value = JSON.stringify(cachedUser);
  await redisClient.set(key, value);
  return cachedUser;
}
export async function updateCachedUser(id: string, cacheUser: Partial<CacheUser>){
  const key = `user:${id}`;
  let cache = await getCachedUser(id);
  if (!cache) return null;

  cacheUser.user = {...cache.user, ...cacheUser.user}
  cache = {...cache, ...cacheUser}
  
  await redisClient.set(key, JSON.stringify(cache));
}
export async function getCachedUser(id: string): Promise<null | CacheUser> {
  const key = `user:${id}`;
  const cachedUserStr = await redisClient.get(key);
  if (!cachedUserStr) return null;
  return JSON.parse(cachedUserStr)
}
// add the user and return the count
export async function addConnectedUser(userId: string, socketId: string, presence: number) {
  const socketKey = `connectedSocketIds:${userId}`;
  const userKey = `connectedUserId:${socketId}`;
  const userPresence = `userPresence:${userId}`;
  const multi = redisClient
    .multi()
    .sAdd(socketKey, socketId)
    .set(userKey, userId)
  if (presence) {
    multi.set(userPresence, presence.toString())  
  }
  await multi.exec();
  const count = await getConnectedUsersCount(userId);
  return count
}
// remove the user and return count.
export async function removeConnectedUser(userId: string, socketId: string) {
  const socketKey = `connectedSocketIds:${userId}`;
  const userKey = `connectedUserId:${socketId}`;
  const userPresence = `userPresence:${userId}`;
  const count = await getConnectedUsersCount(userId);
  const multi = redisClient
    .multi()
    .sRem(socketKey, socketId)
    .del(userKey)
    .del(userPresence)
    
  if (count <= 1) {
    // TODO: make user go offline.
  }
  await multi.exec();
  
  return count - 1;
}

export async function getConnectedUsersCount(userId: string): Promise<number> {
    const key = `connectedSocketIds:${userId}`;
    const count = await redisClient.sCard(key);
    return count;
}


export async function getUserIdBySocketId(socketId: string): Promise<string | null> {
  const key = `connectedUserId:${socketId}`;
  return redisClient.get(key)
}


export async function updateCachePresence(id: string, presence: Presence) {
  const userPresence = `userPresence:${id}`;
  await redisClient.set(userPresence, presence.toString());
  await updateCachedUser(id, {presence})
}