import { model } from "mongoose";
import { IUser } from "../../utils/common/interface/index.js";
import { userSchema } from "./user.schema.js";

export const User = model<IUser>("User", userSchema);
