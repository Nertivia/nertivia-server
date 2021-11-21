import { Request, Response } from "express";
import user from "../../database/user";

export const createAccount = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  const [id, error] = await user.createUser({
    email,
    username,
    password,
  });

  if (error) {
    return res.status(403).json({ error });
  }

  return res.json({ id });
};
