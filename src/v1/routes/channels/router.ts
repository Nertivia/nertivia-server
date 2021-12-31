import { Router } from "express";
import authenticate from "../../middlewares/authenticate";
import { getMessages } from "./getMessages"; 
import { sendMessage } from "./sendMessage"; 

const router = Router();


// TODO: create a verifyChannel util and middleware.

router.get("/:channelId/messages", authenticate(), getMessages);

router.post("/:channelId/messages", authenticate(), sendMessage);


export default router;