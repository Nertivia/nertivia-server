import { Router } from "express";
import authenticate from "../../middlewares/authenticate";
import { updatePresence } from "./updatePresence"; 

const router = Router();


router.patch("/update", authenticate(), updatePresence);


export default router;