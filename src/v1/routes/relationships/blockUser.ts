import { Request, Response } from "express";
import { emitToRoom, RoomKey } from "../../../common/socket";
import { ServerEvent } from "../../constants/ServerEvent";
import * as Friend from "../../database/Friend";
import { getUserByTag } from "../../database/User";
import { ValidateData } from "../../utils/ValidateData";

interface ResponseBody {
  id?: string;
  username?: string;
  discriminator?: string;
}

export const blockUser = async (req: Request, res: Response) => {
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

  Friend
    .blockUser(req.cache.user.id, body.id)
    .then(({wereFriends}) => {
      const removerRoom: RoomKey = `user-${req.cache.user.id}`;
      const recipientRoom: RoomKey = `user-${body.id}`;
      emitToRoom(removerRoom, ServerEvent.USER_BLOCKED, {id: body.id})
      if (wereFriends) {
        emitToRoom(recipientRoom, ServerEvent.FRIEND_REMOVED, {id: req.cache.user.id})
      }
      res.json(body.id)
    })
    .catch((err) => res.status(err.statusCode).json({ message: err.message }));
};
