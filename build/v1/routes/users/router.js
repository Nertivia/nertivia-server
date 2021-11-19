"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const createAccount_1 = require("./createAccount");
const router = (0, express_1.Router)();
router.get("/create", createAccount_1.createAccount);
exports.default = router;
