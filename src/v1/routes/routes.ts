import { Router } from "express";

import usersRouter from './users/router'
import friendsRouter from './relationships/router'

const router = Router();

router.use("/users", usersRouter)
router.use("/relationships", friendsRouter)
export {router};