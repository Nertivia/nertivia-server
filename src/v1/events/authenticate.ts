import { Socket } from "socket.io";
import {authenticate} from '../utils/authenticate';
interface Data {
  token: string;
}
export default function authenticateEvent(data: Data, socket: Socket) {
  if (!data.token) {
    socket.emit("authenticate_error", {message: "Token not provided in the header."})
    socket.disconnect(true);
    return;
  }
  authenticate(data.token).then(user => {
    // TODO: save socket id with value of user id.
  }).catch(err => {
    socket.emit("authenticate_error",{message: err.message});
    socket.disconnect(true);
  })
}