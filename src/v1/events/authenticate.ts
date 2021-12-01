import { Socket } from "socket.io";
import { ServerEvent } from "../constants/ServerEvent";
import { getUser } from "../database/userDao";
import {authenticate} from '../utils/authenticate';
interface Data {
  token: string;
}
export default async function authenticateEvent(data: Data, socket: Socket) {
  if (!data.token) {
    socket.emit(ServerEvent.AUTHENTICATE_ERROR, {message: "Token not provided."})
    socket.disconnect(true);
    return;
  }
  const user = await authenticate(data.token).catch(err => {
    socket.emit(ServerEvent.AUTHENTICATE_ERROR,{message: err.message});
    socket.disconnect(true);
  })
  if (!user) return;
  const me = await getUser(user.id);

  socket.emit(ServerEvent.AUTHORIZED, {
    me
  })
}