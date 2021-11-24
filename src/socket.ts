import http from 'http';
import socket from 'socket.io';

let io:socket.Server | null;

export function configureIoServer(server: http.Server) {
  io = new socket.Server(server);

}

export function getIo () {
  return io as socket.Server;
}

