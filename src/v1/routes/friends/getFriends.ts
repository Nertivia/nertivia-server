import { Request, Response } from "express";
import * as Friend from "../../database/friendDao";
import { getUserByTag } from "../../database/userDao";

interface ResponseBody {
  id?: string;
  username?: string;
  discriminator?: string;
}

export const getFriends = async (req: Request, res: Response) => {
  const body = req.body as ResponseBody;

  if (!body.id) {
    body.id = req.user.id; // Get user's own friends
  }
  
  Friend
    .getFriends(body.id)
    .then((friends) => res.json(friends))
    .catch((err) => res.status(err.statusCode).json({ message: err.message }));
};
