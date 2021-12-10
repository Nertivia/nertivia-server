import { redisClient } from "../../common/redis";
import { User } from "../interface/User";


export interface CacheUser {
  // user should contain public information, root should contain private information.
  user: Partial<User> & {id: string}
  passwordVersion: number
}

export function constructCachedUser(user: Partial<User>) : CacheUser {
  return {
    user: {
      id: user.id,
      discriminator: user.discriminator,
      username: user.username,
    },
    passwordVersion: user.passwordVersion
  } as CacheUser
}


export function addCachedUser(user: User ): Promise<CacheUser> {
  return new Promise((resolve, reject) => {
    const key = `users:${user.id}`;
    const cachedUser = constructCachedUser(user);
    const value = JSON.stringify(cachedUser);
    redisClient().set(key, value, (err, reply) => {
      if (err) return reject(err);
      resolve(cachedUser);
    });
  })
}
export function getCachedUser(id: string): Promise<null | CacheUser> {
  return new Promise((resolve, reject) => {
    const key = `users:${id}`;
    redisClient().get(key, (err, reply) => {
      if (err) return reject(err);
      if (!reply) return resolve(null);
      resolve(JSON.parse(reply));
    });
  })
}
