import { Router } from "express";
import { createAccount } from "./createAccount"; 
import { login } from "./login"; 
import { createDMChannel } from "./createDMChannel"; 
import authenticate from "../../middlewares/authenticate";

const router = Router();


router.post("/create", createAccount);
router.post("/login", login);
router.post("/:userId/channels",  authenticate(), createDMChannel);


export default router;