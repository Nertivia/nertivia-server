import { Router } from "express";
import { createAccount } from "./createAccount"; 

const router = Router();


router.post("/create", createAccount);


export default router;