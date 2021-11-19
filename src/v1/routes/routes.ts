import { Router } from "express";

import usersRouter from './users/router'

const router = Router();


router.use("/users", usersRouter)

export {router};