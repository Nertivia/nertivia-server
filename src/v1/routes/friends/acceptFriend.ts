import { Request, Response } from "express";
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
  if (body.id === req.user.id) {
    res.status(400).json({ message: "Cannot friend yourself." });
    return;
  }
  Friend
    .acceptFriend(req.user.id, body.id)
    .then((recipient) => res.json({ recipient }))
    .catch((err) => res.status(err.statusCode).json({ message: err.message }));
};
