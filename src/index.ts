import express from 'express';
import { router as routerV1 } from "./v1/app";



const server = express();

server.use("/api/v1", routerV1)
server.use("/api", routerV1) // Use the latest api version as the default

server.all("*", (req, res) => {
    res.status(404).send({
        error: "Not found"
    });
});

server.listen(80, () => {
  console.log("Listening on port *:80")
})

module.exports = server;