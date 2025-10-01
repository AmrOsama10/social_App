import { Schema } from "mongoose";
import { IPost } from "../../utils";
import { reactionSchema } from "../common";


export const postSChema = new Schema<IPost>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: {
      type: String,
      // required() {
      //   if (this.attachment.length) return false;
      //   return true;
      // },
    },
    reactions: [reactionSchema],
  },
  { timestamps: true ,toJSON:{virtuals:true}}
);

postSChema.virtual("comments",{
  ref:"Comment",
  localField:"_id",
  foreignField:"postId"
})
