import database from "../../database/database";
import * as userDao from './userDao';
interface Friend {
  requester_id: string;
  recipient_id: string;
  status: Status;
}
enum Status {
  Incoming = 0,
  Outgoing = 1,
  Friends = 2,
  Blocked = 3,
}
export async function addFriend(requesterId: string, recipientId: string) {
  // check if recipient exists
  const recipientUser = await userDao.getUser(recipientId);
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
    requester_id: requesterId,
    recipient_id: recipientId,
    status: Status.Incoming
  }
  await database<Friend>("friends").insert([insertRequester, insertRecipient])
  return recipientUser
}
function handleError(status: Status) {
  if (status === Status.Blocked) return {statusCode: 403, message: "User is blocked."}
  if (status === Status.Incoming) return {statusCode: 403, message: "Accept the friend request."}
  if (status === Status.Outgoing) return {statusCode: 403, message: "Request already sent."}
  if (status === Status.Friends) return {statusCode: 403, message: "Already friends."}
}
