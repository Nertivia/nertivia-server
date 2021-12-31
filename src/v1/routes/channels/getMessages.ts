import { Request, Response } from "express";
import { ValidateData } from "../../utils/ValidateData";
export const getMessages = async (req: Request, res: Response) => {
  const { channelId } = req.params;
  const { content } = req.body;

  const errors = new ValidateData(req.body)
    .string("content", {min: 0, max: 5000, required: true})
    .done(res)

  if (errors) return;
};