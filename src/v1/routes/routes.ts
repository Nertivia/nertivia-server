import { Router } from "express";

import usersRouter from './users/router'
import friendsRouter from './friends/router'

const router = Router();

router.use("/users", usersRouter)
router.use("/friends", friendsRouter)
export {router};