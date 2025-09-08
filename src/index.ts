import { log } from "console";
import express from "express";
import { bootstrap } from "./app.controller";
import dotenv from "dotenv";
dotenv.config({ path: "config/dev.env" });

const app = express();
const port = process.env.PORT as string;

bootstrap(app, express);

app.listen(port, () => {
  log("server running on port" + port);
});
