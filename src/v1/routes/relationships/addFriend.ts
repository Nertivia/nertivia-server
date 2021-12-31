import { Request, Response } from "express";
import { emitToRoom } from "../../../common/socket";
import { ServerEvent } from "../../constants/ServerEvent";
import * as Friend from "../../database/Friend";
import { getUserByTag } from "../../database/User";
import { ValidateData } from "../../utils/ValidateData";

interface ResponseBody {
  id?: string;
  username?: string;
  tag?: string;
}

export const addFriend = async (req: Request, res: Response) => {
  const body = req.body as ResponseBody;

  const errors = new ValidateData(req.body)
  .string("id", {min: 3, max: 100})
  .string("username", {min: 3, max: 100})
  .string("tag", {min: 4, max: 4})
  .done(res)

  if (errors) return;


  if (body.username && body.tag) {
    const user = await getUserByTag(body.username, body.tag);
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
      const requesterId = req.cache.user.id;
      const recipientRoom = body.id as string;
      emitToRoom(requesterId, ServerEvent.FRIEND_REQUEST_CREATED, {recipient, status: Friend.FriendshipStatus.Outgoing})
      emitToRoom(recipientRoom, ServerEvent.FRIEND_REQUEST_CREATED, {recipient: req.cache.user, status: Friend.FriendshipStatus.Incoming})
      res.json({ recipient })
    })
    .catch((err) => res.status(err.statusCode).json({ message: err.message }));
};
