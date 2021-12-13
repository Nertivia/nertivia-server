import { emitToRooms } from "../../common/socket";
import { updateCachePresence } from "../cache/userCache";
import { ServerEvent } from "../constants/ServerEvent";
import { getFriendAndGuildIds, Presence, updatePresence } from "../database/User";
import { getUserFromDbOrCache } from "./authenticate";

interface Options {
  userId: string, 
  presence: number, 
  updateDatabase?: boolean
}

export default async function emitUserPresence(opts: Options) {
  const friendAndGuildIds = await getFriendAndGuildIds(opts.userId)
  const cache = await getUserFromDbOrCache(opts.userId);
  if (!cache) return;

  if (opts.updateDatabase) {
    await updatePresence(opts.userId, opts.presence)
    await updateCachePresence(opts.userId, opts.presence)
  }


  if (cache.presence === Presence.OFFLINE && opts.presence === Presence.OFFLINE) return;
  
  emitToRooms(friendAndGuildIds, ServerEvent.PRESENCE_CHANGED, {userId: opts.userId, presence: opts.presence})
  

}