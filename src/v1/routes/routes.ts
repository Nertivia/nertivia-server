import { Router } from "express";

import usersRouter from './users/router'
import friendsRouter from './relationships/router'
import presencesRouter from './presences/router'

const router = Router();

router.use("/users", usersRouter)
router.use("/relationships", friendsRouter)
router.use("/presences", presencesRouter)
export {router};