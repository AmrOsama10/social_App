import { model } from "mongoose";
import { IMessage } from "../../utils/index.js";
import { messageSchema } from "./message.schema.js";

export const Message = model<IMessage>("Message",messageSchema)