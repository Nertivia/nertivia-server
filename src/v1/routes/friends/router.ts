import { addFriend } from './addFriend';
import { acceptFriend } from './acceptFriend';
import { Router } from "express";
import authenticate from '../../middlewares/authenticate';

const router = Router();


router.post('/add', authenticate(), addFriend)
router.post('/accept', authenticate(), acceptFriend)

export default router;