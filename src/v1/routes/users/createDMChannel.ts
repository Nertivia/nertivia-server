import { Request, Response } from "express";
import { getOrCreateDMChannel } from "../../database/Channel";

// Creates an DM channel. //
// If the DM channel is already created, return the existing channel. //
export const createDMChannel = async (req: Request, res: Response) => {
  const { userId } = req.params;

  getOrCreateDMChannel(req.cache.user.id, userId) .then(channel => {
    return res.json(channel);
  }).catch((err) => 
    res.status(err.statusCode).json({message: err.message})
  )
};