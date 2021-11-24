import { Request, Response } from "express";
import { generateToken } from "../../utils/token";
import * as userDao from "../../database/userDao";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: "You must provide an email and password" });
  }

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