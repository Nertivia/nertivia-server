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

export const removeFriend = async (req: Request, res: Response) => {
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

  Friend
    .removeFriend(req.cache.user.id, body.id)
    .then((recipient) => {
      const removerRoom = req.cache.user.id;
      const recipientRoom = body.id as string;
      emitToRoom(removerRoom, ServerEvent.FRIEND_REMOVED, {id: body.id})
      emitToRoom(recipientRoom, ServerEvent.FRIEND_REMOVED, {id: req.cache.user.id})
      res.json(recipient)
    })
    .catch((err) => res.status(err.statusCode).json({ message: err.message }));
};
