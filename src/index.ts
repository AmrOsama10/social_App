import { log } from "console";
import express from "express";
import { bootstrap } from "./app.controller";
import dotenv from "dotenv";
import { initSocket } from "./socket.io/index.js";
dotenv.config({ path: "config/dev.env" });

const app = express();
const port = process.env.PORT as string;

bootstrap(app, express);

const server = app.listen(port, () => {
  log("server running on port" + port);
});
initSocket(server)