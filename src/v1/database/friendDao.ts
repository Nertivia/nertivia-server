import prisma from "../../database";
import {getUser} from "../database/userDao";

export enum Status {
  Incoming = 0,
  Outgoing = 1,
  Friends = 2,
  Blocked = 3,
}



export async function addFriend(requesterId: string, recipientId: string) {
  // check if recipient exists
  const recipientUser = await getUser(recipientId);
  if (!recipientUser) {
    throw { statusCode: 404, message:"Invalid recipient id."}
  }
  
  
  // check if already exists.
  const existingFriend = await prisma.friend.findFirst({
    where: {requesterId, recipientId},
    select: {status: true}
  })
  if (existingFriend) {
    throw handleError(existingFriend.status)
  }

  // insert 
  const insertRequester = {
    requesterId,
    recipientId,
    status: Status.Outgoing
  }
  const insertRecipient = {
    recipientId: requesterId,
    requesterId: recipientId,
    status: Status.Incoming
  }



  await prisma.friend.createMany({
    data: [insertRequester, insertRecipient]
  })
  return recipientUser
}

export async function acceptFriend(acceptedId: string, recipientId: string) {
  // check if recipient exists
  const recipientUser = await getUser(recipientId);
  if (!recipientUser) {
    throw { statusCode: 404, message:"Invalid recipient id."}
  }

  const friendRequest = await prisma.friend.findFirst({
    where: {requesterId: acceptedId, recipientId},
    select: {status: true}
  })
  if (!friendRequest) {
    throw { statusCode: 404, message:"Friend request does not exist."}
  }
  if (friendRequest.status !== Status.Incoming) {
    throw { statusCode: 404, message:"Friend did not send a friend request."}
  }


  await prisma.friend.updateMany({
    where: {
      OR: [
        {recipientId, requesterId: acceptedId},
        {recipientId: acceptedId, requesterId: recipientId},
      ]
    },
    data: {
      status: Status.Friends
    }
  })
  return recipientUser;

}

function handleError(status: Status) {
  if (status === Status.Blocked) return {statusCode: 400, message: "User is blocked."}
  if (status === Status.Incoming) return {statusCode: 400, message: "Accept the friend request."}
  if (status === Status.Outgoing) return {statusCode: 400, message: "Request already sent."}
  if (status === Status.Friends) return {statusCode: 400, message: "Already friends."}
}

export async function getFriends(userId: string) {

  return prisma.friend.findMany({where: {requesterId: userId}, select: {
    recipient: {select: {id: true, username: true, discriminator: true} },
    status: true,
  }})
}
