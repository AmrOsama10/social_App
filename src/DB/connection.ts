import { log } from "console";
import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect(process.env.DB_URL as string)
    .then(() => {
      log("db connected successful");
    })
    .catch((err) => {
      log("fail to connect to Db", err);
    });
};
