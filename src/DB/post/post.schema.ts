import { Schema } from "mongoose";
import { IPost } from "../../utils";
import { reactionSchema } from "../common";
import { Comment } from "../comment/comment.model.js";


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

postSChema.pre("deleteOne", async function (next) {
  const filter = typeof this.getFilter == "function"? this.getFilter():{}
  await Comment.deleteMany({postId:filter._id})
  next()
})