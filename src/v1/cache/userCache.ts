import { redisClient } from "../../redis";
import { User } from "../interface/User";

export function addCachedUser(user: Partial<User> ) {
  return new Promise((resolve, reject) => {
    const key = `users:${user.id}`;
    const value = JSON.stringify(user);
    redisClient().set(key, value, (err, reply) => {
      if (err) return reject(err);
      resolve(reply);
    });
  })
}
export function getCachedUser(id: string): Promise<null | (Partial<User> & {id: string})> {
  return new Promise((resolve, reject) => {
    const key = `users:${id}`;
    redisClient().get(key, (err, reply) => {
      if (err) return reject(err);
      if (!reply) return resolve(null);
      resolve(JSON.parse(reply));
    });
  })
}
