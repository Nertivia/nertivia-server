import { Request, Response } from "express";
import { emitToRoom, RoomKey } from "../../../socket";
import { ServerEvent } from "../../constants/ServerEvent";
import * as Friend from "../../database/friendDao";
import { getUserByTag } from "../../database/userDao";
import { ValidateData } from "../../utils/ValidateData";

interface ResponseBody {
  id?: string;
  username?: string;
  discriminator?: string;
}

export const addFriend = async (req: Request, res: Response) => {
  const body = req.body as ResponseBody;

  const errors = new ValidateData(req.body)
  .string("id", {min: 3, max: 100})
  .string("username", {min: 3, max: 100})
  .string("discriminator", {min: 4, max: 4})
  .done(res)

  if (errors) return;


  if (body.username && body.discriminator) {
    const user = await getUserByTag(body.username, body.discriminator);
    if (user) body.id = user.id;
  }

  if (!body.id) {
    res.status(404).json({ message: "User not found." });
    return;
  }
  
  if (body.id === req.cache.user.id) {
    res.status(400).json({ message: "Cannot add yourself." });
    return;
  }
  Friend
    .addFriend(req.cache.user.id, body.id)
    .then((recipient) => {
      const requesterId: RoomKey = `user-${req.cache.user.id}`;
      const recipientRoom: RoomKey = `user-${body.id}`;
      emitToRoom(requesterId, ServerEvent.FRIEND_REQUEST_CREATED, {recipient, status: Friend.Status.Outgoing})
      emitToRoom(recipientRoom, ServerEvent.FRIEND_REQUEST_CREATED, {recipient: req.cache.user, status: Friend.Status.Incoming})
      res.json({ recipient })
    })
    .catch((err) => res.status(err.statusCode).json({ message: err.message }));
};
