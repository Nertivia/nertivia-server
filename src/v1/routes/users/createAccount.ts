import { generateToken } from '../../utils/token';
import { Request, Response } from "express";
import * as userDao from "../../database/userDao";

export const createAccount = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;
  if (!email || !username || !password) {
    return res.status(400).send({ message: "You must provide an email, username, and password" });
  }
  userDao.createUser({
    email,
    username,
    password,
  })
  .then(id => {
    const token = generateToken(id, 0) // User id, password version = 0
    return res.json({ token }); // Return the created jwt to the client
  }).catch((err: userDao.ReturnError) => {
    res.status(err.statusCode).json({message: err.message})
  })


};
