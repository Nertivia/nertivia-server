import { Request, Response } from "express";
import { ValidateData } from "../../utils/ValidateData";
import emitUserPresence from "../../utils/emitUserPresence";

export const updatePresence = async (req: Request, res: Response) => {
  const { presence } = req.body;

  const errors = new ValidateData(req.body)
    .number("presence", {min: 0, max: 4, required: true})
    .done(res)

  if (errors) return;

  if (req.cache.presence === presence) {
    res.status(403).json({message: "Status is already " + presence})
    return;
  }

  
  emitUserPresence({
    presence,
    userId: req.cache.user.id,
    updateDatabase: true
  })
  res.json({message: "Presence updated!"})
};