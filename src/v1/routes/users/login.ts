import { Request, Response } from "express";
import { generateToken } from "../../utils/token";
import * as User from "../../database/userDao";
import { ValidateData } from "../../utils/ValidateData";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const errors = new ValidateData(req.body)
  .string("email", {min: 3, max: 100, required: true})
  .string("password", {min: 3, max: 100, required: true})
  .done(res)

  if (errors) return;

  // TODO: Check user IP against stored user IPs. If the IP is different or the ip was last used 15+ days ago then send a verification email(make the user provide a code).
  // Alternative use a 2fa code or send text message code
  
  User.authenticateUser(email, password)
  .then(user => {
    // Generate a jwt then return to client for login
    const token = generateToken(user.id, user.passwordVersion) // Pass the user id and the password version 
    return res.json({ token });
  })
  .catch((err: User.ReturnError) => {
    return res.status(err.statusCode).json({ error: err.message });
  })
};