import { redisClient } from "../../common/redis";


interface Channel {
  id: string;
  participants?: string[]
}
export interface CacheChannel {
  // channel should contain public information, root should contain private information.
  channel: Partial<Channel> & {id: string}
}

export function constructCachedChannel(channel: Partial<Channel>) {
  const cachedChannel: CacheChannel =  {
    channel: {
      id: channel.id as string,
    },
  }
  if (channel.participants) {
    cachedChannel.channel.participants = channel.participants
  }
  return cachedChannel;
}

export async function addChannelCache(channel: Channel ){
  const key = `channel:${channel.id}`;
  const cachedChannel = constructCachedChannel(channel);
  const value = JSON.stringify(cachedChannel);
  await redisClient.set(key, value);
  return cachedChannel;
}

export async function getCachedChannel(id: string): Promise<null | CacheChannel> {
  const key = `channel:${id}`;
  const cacheChannelStr = await redisClient.get(key);
  if (!cacheChannelStr) return null;
  return JSON.parse(cacheChannelStr)
}