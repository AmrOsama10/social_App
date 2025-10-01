import { IComment, IPost, IUser } from "../../../utils/index.js";
import { CommentEntity } from "../entity/index.js";
import { CreateCommentDTO } from './../comment.dto';

export class CommentFactory {
    createComment (createCommentDTO:CreateCommentDTO,post:IPost,user:IUser,comment?:IComment) {
        const newComment = new CommentEntity()
        newComment.userId=user._id;
        newComment.postId=post._id||comment.postId;
        newComment.parentId= comment?._id;
        newComment.content=createCommentDTO.content;
        // newComment.attachment=createCommentDTO.attachment;
        newComment.reactions=[]

        return newComment
    }

}