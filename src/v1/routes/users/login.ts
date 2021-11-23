import { Request, Response } from "express";
import { generateToken } from "../../utils/token";
import * as userDao from "../../database/userDao";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  userDao.authenticateUser(email, password)
  .then(user => {
    // Generate a jwt then return to client for login
    const token = generateToken(user.id, user.password_version) // Pass the user id and the password version 
    return res.json({ token });
  })
  .catch((err: userDao.ReturnError) => {
    return res.status(err.statusCode).json({ error: err.message });
  })
};