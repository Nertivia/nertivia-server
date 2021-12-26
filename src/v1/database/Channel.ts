import FlakeId from "@brecert/flakeid";
import ChannelModel from "../../models/ChannelModel";
import UserModel from "../../models/UserModel";



const flake = new FlakeId({
  mid: 42,
  timeOffset: (2013 - 1970) * 31536000 * 1000,
});

export async function getOrCreateDMChannel(requesterId: string, recipientId: string) {

  const existingChannel = await ChannelModel.findOne({$or: [
    {participants: [requesterId, recipientId]},
    {participants: [recipientId, requesterId]}
  ]})

  // TODO: filter out fields //
  if (existingChannel) return existingChannel;

  // check if the recipient id is valid //
  const isRecipientValid = await UserModel.exists({id: recipientId});
  if (!isRecipientValid) {
    throw { statusCode: 404, message: "Invalid User Id." };
  }


  const channelObj = {
    id: flake.gen().toString(),
    participants: [requesterId, recipientId]
  }

  return ChannelModel.create(channelObj).then(() => channelObj)
}