import express from "express";
import { router as routerV1 } from "./v1/app";

import "./env";
import { connectRedis } from "./redis";

const server = express();

server.use(express.urlencoded({ extended: true }));
server.use(express.json());

server.use("/api/v1", routerV1);
server.use("/api", routerV1); // Use the latest api version as the default

server.all("*", (req, res) => {
  res.status(404).send({
    error: "Not found",
  });
});

async function startServer() {
  await connectRedis();
  server.listen(80, () => {
    console.log("Listening on port *:80");
  });
}
startServer();

module.exports = server;
