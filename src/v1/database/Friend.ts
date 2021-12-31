import {getUser} from "./User";
import { checkBlocked } from "./BlockedUser";
import FriendModel from "../../models/FriendModel";
import UserModel from "../../models/UserModel";
import BlockedUserModel from "../../models/BlockedUserModel";

export enum FriendshipStatus {
  Incoming = 0,
  Outgoing = 1,
  Friends = 2
}


export async function addFriend(requesterId: string, recipientId: string) {
  // check if recipient exists
  const recipientUser = await getUser(recipientId);
  if (!recipientUser) {
    throw { statusCode: 404, message:"Invalid recipient id."}
  }
  
  const isBlocked = await checkBlocked(requesterId, recipientId);

  if (isBlocked) {
    throw {statusCode: 400, message: "User is blocked."};
  }
  
  // check if already exists.
  const existingFriend = await FriendModel.findOne({requester: requesterId, recipient: recipientId}).select("status")
  if (existingFriend) {
    throw handleError(existingFriend.status)
  }

  // insert 
  const insertRequester = {
    requester: requesterId,
    recipient: recipientId,
    status: FriendshipStatus.Outgoing
  }
  const insertRecipient = {
    recipient: requesterId,
    requester: recipientId,
    status: FriendshipStatus.Incoming
  }




  await FriendModel.insertMany([insertRequester, insertRecipient])

  return recipientUser
}

export async function acceptFriend(acceptedId: string, recipientId: string) {
  // check if recipient exists
  const recipientUser = await getUser(recipientId);
  if (!recipientUser) {
    throw { statusCode: 404, message:"Invalid recipient id."}
  }



  const friendRequest = await FriendModel.findOne({requesterId: acceptedId, recipient: recipientId}).select("status")
  if (!friendRequest) {
    throw { statusCode: 404, message:"Friend request does not exist."}
  }
  if (friendRequest.status !== FriendshipStatus.Incoming) {
    throw { statusCode: 404, message:"Friend did not send a friend request."}
  }

  
  
  await FriendModel.updateMany({$or:[
    {recipient: recipientId, requester: acceptedId},
    {recipient: acceptedId, requester: recipientId},
  ]}, {status: FriendshipStatus.Friends})
  

  return recipientUser;

}

export async function removeFriend(requesterId: string, recipientId: string) {
  // check if friends
  const existingFriend = await FriendModel.findOne({requester: requesterId, recipient: recipientId}).select("status")

  if (!existingFriend) {
    throw { statusCode: 404, message: "You are not friends with the recipient."}
  }

  await FriendModel.deleteMany({$and: [{recipient: recipientId, requester: requesterId}, {recipient: requesterId, requester: recipientId}]})

  return true;

}

export async function blockUser(requesterId: string, recipientId: string) {
  // check if recipient exists
  const recipientUser = await getUser(recipientId);
  if (!recipientUser) {
    throw { statusCode: 404, message: "Invalid recipient id."}
  }
  
  const isAlreadyBlocked = await BlockedUserModel.exists({blocker: requesterId})

  if (isAlreadyBlocked) {
    throw {statusCode: 400, message: "Already blocked."}
  }

  const isFriends = await FriendModel.exists({requester: requesterId, recipient: recipientId})


  await FriendModel.deleteMany({$and: [{recipient: recipientId, requester: requesterId}, {recipient: requesterId, requester: recipientId}]})

  await BlockedUserModel.create({
    blocker: requesterId,
    blocked: recipientId
  })



  return {wereFriends: isFriends ? true : false};


}

function handleError(status: FriendshipStatus) {
  if (status === FriendshipStatus.Incoming) return {statusCode: 400, message: "Accept the friend request."}
  if (status === FriendshipStatus.Outgoing) return {statusCode: 400, message: "Request already sent."}
  if (status === FriendshipStatus.Friends) return {statusCode: 400, message: "Already friends."}
}

export async function getFriends(userId: string) {
  return await FriendModel.find({requester: userId}, {_id: 0, status: 1}).populate("recipient", " -_id id username tag")
}