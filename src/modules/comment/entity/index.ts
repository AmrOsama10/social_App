import { ObjectId } from "mongoose";
import { IAttachment, IReaction } from "../../../utils";

export class CommentEntity {
  userId: ObjectId;
  postId: ObjectId;
  parentId: ObjectId | null;
  content: string;
  reactions: IReaction[];
  attachment?: IAttachment[];
  mentions?: ObjectId[];
}
