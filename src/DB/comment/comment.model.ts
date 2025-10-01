import { model } from "mongoose";
import { commentSchema } from "./comment.schema.js";

export const Comment = model("Comment",commentSchema)