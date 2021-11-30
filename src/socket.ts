import http from 'http';
import socket, { Socket } from 'socket.io';
import v1Events from './v1/events/events';

let io:socket.Server | null;

export function configureIoServer(server: http.Server) {
  io = new socket.Server(server, {
    // cors: {
    //   origin: '*'
    // }
  });

  io.on('connection', socket => {
    registerEvents(socket, v1Events)
  })
}

function registerEvents(socket: Socket, events: {[key: string]: (data: any, socket: Socket) => void}) {
  const eventNames = socket.eventNames();
  for (const eventName in events) {
    if (eventNames.includes(eventName)) continue;
    const event = events[eventName];
    socket.on(eventName, (data) => event(data, socket)) 
  }
}



export function getIo () {
  return io as socket.Server;
}

