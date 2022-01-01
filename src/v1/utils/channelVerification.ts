import { getCachedChannel } from "../cache/channelCache";
import { CacheUser } from "../cache/userCache";
import { getDMChannelById } from "../database/Channel";
import { getUserFromDbOrCache } from "./authenticate";

export async function channelVerification(userId: string, channelId: string, cachedUser?: CacheUser | null) {
  if (!cachedUser) {
    cachedUser = await getUserFromDbOrCache(userId)
  }
  if (!cachedUser) return;

  const cachedChannel = getChannelFromDbOrCache(channelId)

}

// export async function getChannelFromDbOrCache(id: string) {
//   // Check in cache
//   let cachedUser = await getCachedChannel(id);
//   if (cachedUser) return cachedUser;
  
//   // check in database
//   const dbUser = await getDMChannelById
//   if (!dbUser) return null;
//   cachedUser = await addCachedUser(dbUser);
//   return cachedUser
// }