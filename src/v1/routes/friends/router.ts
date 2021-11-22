import { addFriend } from './addFriend';
import { Router } from "express";
import authenticate from '../../middlewares/authenticate';

const router = Router();


router.post('/add', authenticate(), addFriend)

export default router;