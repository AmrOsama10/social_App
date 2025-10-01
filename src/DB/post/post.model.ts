import { model } from "mongoose";
import { postSChema } from "./post.schema.js";
import { IPost } from "../../utils";

export const Post = model<IPost>("Post",postSChema)