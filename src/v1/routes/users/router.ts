import { Router } from "express";
import { createAccount } from "./createAccount"; 

const router = Router();


router.get("/create", createAccount);


export default router;