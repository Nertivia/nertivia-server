import { generateToken } from '../../utils/token';
import { Request, Response } from "express";
import * as userDao from "../../database/userDao";

export const createAccount = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  userDao.createUser({
    email,
    username,
    password,
  })
  .then(id => {
    const token = generateToken(id, 0)
    return res.json({ token });
  }).catch((err: userDao.ReturnError) => {
    res.status(err.statusCode).json({message: err.message})
  })


};
