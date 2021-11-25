import { Request, Response } from "express";
import * as userDao from "../../database/userDao";
import * as friendDao from "../../database/friendDao";

interface ResponseBody {
  id?: string;
  username?: string;
  discriminator?: string;
}

export const addFriend = async (req: Request, res: Response) => {
  const body = req.body as ResponseBody;

  if (body.username && body.discriminator) {
    const user = await userDao.getUserByTag(body.username, body.discriminator);
    if (user) body.id = user.id;
  }
  if (!body.id) {
    res.status(404).json({ message: "User not found." });
    return;
  }
  if (body.id === req.user.id) {
    res.status(400).json({ message: "Cannot add yourself." });
    return;
  }
  friendDao
    .addFriend(req.user.id, body.id)
    .then((recipient) => res.json({ recipient }))
    .catch((err) => res.status(err.statusCode).json({ message: err.message }));
};
