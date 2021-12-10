import http from 'http';
import socket, { Socket } from 'socket.io';
import { ServerEvent } from '../v1/constants/ServerEvent';
import { createAdapter, RedisAdapter } from '@socket.io/redis-adapter';
import v1Events from '../v1/events/events';
import {redisClient} from './redis'

let io:socket.Server | null;

export function configureIoServer(server: http.Server) {
  io = new socket.Server(server, {
    transports: ["websocket"],
    cors: {
      origin: '*'
    }
  });
  io.adapter(createAdapter(redisClient(), redisClient()?.duplicate()))


  io.on('connection', socket => {
    registerEvents(socket, v1Events)
  })
}

function adapter() {
  return io?.of('/').adapter as RedisAdapter;
}

function registerEvents(socket: Socket, events: {[key: string]: (data: any, socket: Socket) => void}) {
  const eventNames = socket.eventNames();
  for (const eventName in events) {
    if (eventNames.includes(eventName)) continue;
    const event = events[eventName];
    socket.on(eventName, (data) => event(data, socket)) 
  }
}

// type RoomKey<Str extends string> = `id-${Lowercase<Str>}`
type attrs = "user" | "server";
export type RoomKey = `${attrs}-${string}`;


// join room
export function joinRoom(socketId: string, name: RoomKey) {
  return adapter().remoteJoin(socketId, name)
}

export function emitToRoom(name: RoomKey, event: ServerEvent, data: any) {
  return io?.in(name).emit(event, data);
}
export function emitToRooms(names: RoomKey[], event: ServerEvent, data: any) {
  return io?.in(names).emit(event, data);
}
export function emitToUser(id: string, event: ServerEvent, data: any) {
  return io?.in(id).emit(event, data);
}
export function emitToUsers(ids: string[], event: ServerEvent, data: any) {
  return io?.in(ids).emit(event, data);
}