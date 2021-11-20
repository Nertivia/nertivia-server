import express from 'express';
import { router as routerV1 } from "./v1/app";



const server = express();

server.use("/api/v1", routerV1)

server.listen(80, () => {
  console.log("Listening on port *:80")
})

module.exports = server;