import { Request, Response } from "express";
import { getOrCreateDMChannel, openDMChannel } from "../../database/Channel";

// Creates an DM channel. //
// If the DM channel is already created, return the existing channel. //
export const openOrCreateDMChannel = async (req: Request, res: Response) => {
  const { userId } = req.params;

  const channel = await getOrCreateDMChannel(req.cache.user.id, userId)
  .catch((err) => {
    res.status(err.statusCode).json({message: err.message})
  })
  if (!channel) return;
  
  
  
  // opens dm channel after creating it //
  // This is done like this so the user can close the dm channel. //
  openDMChannel(req.cache.user.id, channel.id)
  .then(channel => res.json(channel))
  .catch((err) => 
    res.status(err.statusCode).json({message: err.message})
  )

};