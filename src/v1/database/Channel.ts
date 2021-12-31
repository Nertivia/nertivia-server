import FlakeId from "@brecert/flakeid";
import ChannelModel from "../../models/ChannelModel";
import OpenedDMModel from "../../models/OpenedDMModel";
import UserModel from "../../models/UserModel";
import {User} from '../../models/UserModel'


const flake = new FlakeId({
  mid: 42,
  timeOffset: (2013 - 1970) * 31536000 * 1000,
});

export async function getOrCreateDMChannel(requesterId: string, recipientId: string) {

  const existingChannel = await ChannelModel.findOne({$or: [
    {participants: [requesterId, recipientId]},
    {participants: [recipientId, requesterId]}
  ]}).select("id");

  if (existingChannel) return getDMChannelById(existingChannel.id, requesterId);

  // check if the recipient id is valid //
  const isRecipientValid = await UserModel.exists({id: recipientId});
  if (!isRecipientValid) {
    throw { statusCode: 404, message: "Invalid User Id." };
  }


  const channelObj = {
    id: flake.gen().toString(),
    participants: [requesterId, recipientId]
  }

  return ChannelModel.create(channelObj).then(() => getDMChannelById(channelObj.id, requesterId))
}

export async function getDMChannelById(channelId: string, requesterId: string) {
  return ChannelModel.findOne({id: channelId, participants: requesterId}).select("-_id id").populate<{participants: User[]}>('participants', '-_id id username tag');
}


export async function openDMChannel(requesterId: string, channelId: string) {
  // Check if dm is already opened //
  const existingOpenedDM = await OpenedDMModel.findOne({openedBy: requesterId, channel: channelId})
  if (existingOpenedDM) {
    throw { statusCode: 403, message: "DM Channel already opened." };
  }

  // check if channel is valid
  const DMChannel = await getDMChannelById(channelId, requesterId);
  if (!DMChannel) {
    throw { statusCode: 403, message: "Invalid Channel Id" };
  }

  return OpenedDMModel.create({openedBy: requesterId, channel: channelId}).then(res => {
    return DMChannel
  })

}