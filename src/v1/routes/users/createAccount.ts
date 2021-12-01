import { generateToken } from '../../utils/token';
import { Request, Response } from "express";
import { isEmailValid } from "../../utils/email";
import { createUser } from '../../database/userDao';
import * as User from '../../database/userDao';

export const createAccount = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;
  if (!email || !username || !password) {
    return res.status(400).send({ message: "You must provide an email, username, and password" });
  }

  if (!await isEmailValid(email)) {
    return res.status(400).send({ message: "The email you provided is not valid" });
  }

  // TODO: Make sure to verify the user by sending an email to verify

  createUser({
    email,
    username,
    password,
  })
  .then(id => {
    const token = generateToken(id, 0) // User id, password version = 0
    return res.json({ token }); // Return the created jwt to the client
  }).catch((err: User.ReturnError) => {
    res.status(err.statusCode).json({message: err.message})
  })
};
