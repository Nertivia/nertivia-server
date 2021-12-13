import { Socket } from "socket.io";
import { emitToUser, joinRoom } from "../../common/socket";
import { addConnectedUser } from "../cache/userCache";
import { ServerEvent } from "../constants/ServerEvent";
import { getFriends } from "../database/Friend";
import { getUser } from "../database/User";
import {authenticate} from '../utils/authenticate';
import emitUserPresence from "../utils/emitUserPresence";
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
  socket.auth = true;
  const user = await getUser(cache.user.id);

  const friends = await getFriends(cache.user.id);


  await joinRoom(socket.id, cache.user.id)
  
  const connectedCount = await addConnectedUser(cache.user.id, socket.id, cache.presence);
  if (connectedCount === 1) {
    await emitUserPresence({
      presence: cache.presence,
      userId: cache.user.id,
    })
  }




  emitToUser(socket.id, ServerEvent.AUTHORIZED, {
    user,
    friends
  })

}