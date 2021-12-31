import { Request, Response } from "express";
export const sendMessage = async (req: Request, res: Response) => {
  const { channelId } = req.params;

};