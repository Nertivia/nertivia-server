import prisma from "../../common/database";
import {getUser} from "./User";
import { checkBlocked } from "./BlockedUser";

export enum Status {
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

export async function removeFriend(requesterId: string, recipientId: string) {
  // check if friends
  const existingFriend = await prisma.friend.findFirst({
    where: {requesterId, recipientId},
    select: {status: true}
  })

  if (!existingFriend) {
    throw { statusCode: 404, message: "You are not friends with the recipient."}
  }
  await prisma.friend.deleteMany({where: {AND: [{recipientId, requesterId}, {recipientId: requesterId, requesterId: recipientId}]}})

  return true;

}

export async function blockUser(requesterId: string, recipientId: string) {
  // check if recipient exists
  const recipientUser = await getUser(recipientId);
  if (!recipientUser) {
    throw { statusCode: 404, message: "Invalid recipient id."}
  }
  
  const isAlreadyBlocked = await prisma.blockedUser.findFirst({where: {blockerId: requesterId}})
  if (isAlreadyBlocked) {
    throw {statusCode: 400, message: "Already blocked."}
  }

  const isFriends = await prisma.friend.findFirst({
    where: {requesterId, recipientId},
    select: {status: true}
  })

  await prisma.$transaction([
    prisma.friend.deleteMany({where: {AND: [{recipientId, requesterId}, {recipientId: requesterId, requesterId: recipientId}]}}),
    prisma.blockedUser.create({
      data: {
        blockerId: requesterId,
        blockedId: recipientId
      }
    })
  ])

  return {wereFriends: isFriends ? true : false};


}

function handleError(status: Status) {
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
