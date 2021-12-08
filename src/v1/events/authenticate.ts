import { Socket } from "socket.io";
import { emitToUser, joinRoom } from "../../socket";
import { ServerEvent } from "../constants/ServerEvent";
import { getFriends } from "../database/friendDao";
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
  const cache = await authenticate(data.token).catch(err => {
    socket.emit(ServerEvent.AUTHENTICATE_ERROR, {message: err.message});
    socket.disconnect(true);
  })
  if (!cache) return;
  const me = await getUser(cache.user.id);

  const friends = await getFriends(cache.user.id);


  await joinRoom(socket.id, `user-${cache.user.id}`)


  emitToUser(socket.id, ServerEvent.AUTHORIZED, {
    me,
    friends
  })

}