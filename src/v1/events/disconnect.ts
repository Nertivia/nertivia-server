import { Socket } from "socket.io";
import { getCachedUser, getUserIdBySocketId, removeConnectedUser } from "../cache/userCache";


export default async function authenticateEvent(data: any, socket: Socket) {
  const userId = await getUserIdBySocketId(socket.id);
  if (!userId) return;
  const connectedCount = await removeConnectedUser(userId, socket.id);
  if (connectedCount === 0) {
    // TODO: emit event to everyone to indicate user event offline.
  }

}