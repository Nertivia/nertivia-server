import database from "../../database/database";
import {getUser} from "../database/userDao";
interface Friend {
  requester_id: string;
  recipient_id: string;
  status: Status;
}

interface User {
  id: string,
  username: string,
  discriminator: string
}

enum Status {
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
  const existingFriend = await database<Friend>("friends")
    .where({ requester_id: requesterId, recipient_id: recipientId })
    .select("status")
    .first();
  if (existingFriend) {
    throw handleError(existingFriend.status)
  }
  // insert 
  const insertRequester = {
    requester_id: requesterId,
    recipient_id: recipientId,
    status: Status.Outgoing
  }
  const insertRecipient = {
    requester_id: recipientId,
    recipient_id: requesterId,
    status: Status.Incoming
  }
  await database<Friend>("friends").insert([insertRequester, insertRecipient])
  return recipientUser
}
function handleError(status: Status) {
  if (status === Status.Blocked) return {statusCode: 400, message: "User is blocked."}
  if (status === Status.Incoming) return {statusCode: 400, message: "Accept the friend request."}
  if (status === Status.Outgoing) return {statusCode: 400, message: "Request already sent."}
  if (status === Status.Friends) return {statusCode: 400, message: "Already friends."}
}

async function returnFriendShipsFromDatabase(userId: string) {
  return await database<Friend>("friends")
  .join('users', 'users.id', 'friends.recipient_id')
  .select("friends.status", "users.username", "users.discriminator", "users.id")
  .where({requester_id: userId})
}

async function returnFriendShipData(data: any){
  let updatedFriends: {user: User, status: Number}[] = [];

  data.forEach((incommingFriend: any) => {
    updatedFriends.push({
      user: {
        username: incommingFriend.username,
        discriminator: incommingFriend.discriminator,
        id: incommingFriend.id,
      },
      status: incommingFriend.status,
   })
  })

  return updatedFriends;
}

export async function getFriends(userId: string) {
  const dbData = await returnFriendShipsFromDatabase(userId);

  // Optional SQL only version: const dbData = await database.raw("SELECT friends.status, json_build_object('id', users.id, 'username', users.username, 'discriminator', users.discriminator) as user from friends INNER JOIN users ON users.id = friends.recipient_id WHERE friends.requester_id = ?;", [userId])
  
  const friends = dbData.filter(friend => friend.status === Status.Incoming);
  return await returnFriendShipData(friends);
}

export async function getOutgoing(userId: string) {
  const dbData = await returnFriendShipsFromDatabase(userId);
  
  const outgoing = dbData.filter(friend => friend.status === Status.Outgoing);
  return await returnFriendShipData(outgoing);
}

export async function getIncoming(userId: string) {
  const dbData = await returnFriendShipsFromDatabase(userId);

  const incomming = dbData.filter(user => user.status === Status.Incoming);
  return await returnFriendShipData(incomming);
}

export async function getBlocked(userId: string) {
  
  const dbData = await returnFriendShipsFromDatabase(userId);
  // Optional SQL only version: const dbData = await database.raw("SELECT friends.status, json_build_object('id', users.id, 'username', users.username, 'discriminator', users.discriminator) as user from friends INNER JOIN users ON users.id = friends.recipient_id WHERE friends.requester_id = ?;", [userId])
  
  const blockedUsers = dbData.filter(user => user.status === Status.Blocked);
  return await returnFriendShipData(blockedUsers);
}
