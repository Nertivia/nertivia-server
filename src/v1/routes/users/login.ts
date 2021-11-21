import { Request, Response } from "express";
import user from "../../database/user";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const [id, error, statusCode] = await user.authenticateUser(email, password);

  if (error) {
    return res.status(statusCode || 403).json({ error });
  }

  return res.json({ id });
};
