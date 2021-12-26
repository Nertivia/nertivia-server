import BlockedUserModel from '../../models/BlockedUserModel';

export async function checkBlocked(userId1: string, userId2: string) {
  return BlockedUserModel.exists({$or: [
    {blocked: userId1, blocker: userId2},
    {blocked: userId2, blocker: userId1},
  ]})
}