import { Request, Response } from "express";
import { emitToRoom, emitToRooms, emitToUser, RoomKey } from "../../../socket";
import { ServerEvent } from "../../constants/ServerEvent";
import * as Friend from "../../database/friendDao";
import { getUserByTag } from "../../database/userDao";

interface ResponseBody {
  id?: string;
  username?: string;
  discriminator?: string;
}

export const acceptFriend = async (req: Request, res: Response) => {
  const body = req.body as ResponseBody;

  if (body.username && body.discriminator) {
    const user = await getUserByTag(body.username, body.discriminator);
    if (user) body.id = user.id;
  }
  if (!body.id) {
    res.status(404).json({ message: "User not found." });
    return;
  }
  if (body.id === req.cache.user.id) {
    res.status(400).json({ message: "Cannot friend yourself." });
    return;
  }
  Friend
    .acceptFriend(req.cache.user.id, body.id)
    .then((recipient) => {
      const accepterRoom: RoomKey = `user-${req.cache.user.id}`;
      const recipientRoom: RoomKey = `user-${body.id}`;
      emitToRoom(accepterRoom, ServerEvent.FRIEND_ACCEPTED, {id: body.id})
      emitToRoom(recipientRoom, ServerEvent.FRIEND_ACCEPTED, {id: req.cache.user.id})
      res.json(recipient)
    })
    .catch((err) => res.status(err.statusCode).json({ message: err.message }));
};
