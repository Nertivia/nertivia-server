import { Router } from "express";
import { createAccount } from "./createAccount"; 
import { login } from "./login"; 

const router = Router();


router.post("/create", createAccount);
router.post("/login", login);


export default router;