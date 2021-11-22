import { Request, Response } from "express";


interface ResponseBody {
  id?: string
  username?: string
  discriminator?: string
}

export const addFriend = async (req: Request, res: Response) => {
  const body = req.body as ResponseBody;

};