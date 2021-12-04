import { addFriend } from './addFriend';
import { getFriends } from './getFriends';
import { Router } from "express";
import authenticate from '../../middlewares/authenticate';

const router = Router();


router.post('/add', authenticate(), addFriend)
router.get('/get', authenticate(), getFriends)

export default router;