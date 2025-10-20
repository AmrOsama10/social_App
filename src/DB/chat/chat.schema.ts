import { Schema } from "mongoose";
import { IChat } from "../../utils/index.js";

export const chatSchema = new Schema<IChat>({
  messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  users: [{ type: Schema.Types.ObjectId, ref: "User" }],
});
