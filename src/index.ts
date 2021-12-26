import env from "./env";
import express from "express";
import { router as routerV1 } from "./v1/app";
import http from 'http';
import { connectRedis } from "./common/redis";
import { configureIoServer } from "./common/socket";
import { connect as connectMongoDB } from 'mongoose';

const app = express();

const server = http.createServer(app);


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/v1", routerV1);
app.use("/api", routerV1); // Use the latest api version as the default

app.all("*", (req, res) => {
  res.status(404).send({
    error: "Not found",
  });
});

async function startServer() {
  await connectRedis();
  await connectMongoDB(env.MONGODB_URL).then(() => {
    console.log("Connected to MongoDB.")
  })
  configureIoServer(server);
  server.listen(env.PORT, () => {
    console.log(`Listening on port *:${env.PORT}`);
  });
}
startServer();

module.exports = app;
