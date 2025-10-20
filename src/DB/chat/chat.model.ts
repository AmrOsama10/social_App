import { model } from "mongoose";
import { IChat } from "../../utils/index.js";
import { chatSchema } from "./chat.schema.js";

export const Chat = model<IChat>("Chat",chatSchema)