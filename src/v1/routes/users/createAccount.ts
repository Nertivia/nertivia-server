import { Request, Response } from "express"


export const createAccount = async (req: Request, res: Response) => {
  res.json({status: "done"})
}