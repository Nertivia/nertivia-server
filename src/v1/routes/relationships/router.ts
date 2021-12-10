import { addFriend } from './addFriend';
import { acceptFriend } from './acceptFriend';
import { removeFriend } from './removeFriend';
import { blockUser } from './blockUser';
import { Router } from "express";
import authenticate from '../../middlewares/authenticate';

const router = Router();


router.post('/friends/add', authenticate(), addFriend)
router.post('/friends/accept', authenticate(), acceptFriend)
router.delete('/friends/remove', authenticate(), removeFriend)
router.patch('/users/block', authenticate(), blockUser)

export default router;