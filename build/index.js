"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app_1 = require("./v1/app");
const server = (0, express_1.default)();
server.use("/api/v1", app_1.router);
server.listen(80, () => {
    console.log("Listening on port *:80");
});
