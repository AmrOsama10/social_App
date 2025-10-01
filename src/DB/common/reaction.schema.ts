import { Schema } from "mongoose";
import { REACTION, IReaction } from "../../utils";

export const reactionSchema = new Schema<IReaction>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reaction: { type: Number, enum: REACTION, default: REACTION.like },
  },
  { timestamps: true }
);
