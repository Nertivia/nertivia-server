import prisma from "../../database";



export async function checkBlocked(userId1: string, userId2: string) {
  const isBlocked = await prisma.blockedUser.findFirst({
    where: {
      OR: [
        {blockedId: userId1, blockerId: userId2},
        {blockedId: userId2, blockerId: userId1},
      ]
    }
  })
  if (isBlocked) return true;
  return false;
}