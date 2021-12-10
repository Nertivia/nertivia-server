import { generateToken } from '../../utils/token';
import { Request, Response } from "express";
import { isEmailValid } from "../../utils/email";
import { createUser } from '../../database/User';
import * as User from '../../database/User';
import { ValidateData } from '../../utils/ValidateData';

export const createAccount = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;


  const errors = new ValidateData(req.body)
    .string("email", {min: 3, max: 100, required: true})
    .string("username", {min: 3, max: 30, required: true})
    .string("password", {min: 3, max: 100, required: true})
    .done(res)
    
  if (errors) return;


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
  }).catch((err: User.ReturnError) => 
    res.status(err.statusCode).json({message: err.message})
  )
};


