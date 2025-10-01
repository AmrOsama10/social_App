import { Request, Response } from "express";
import { IComment, NotFoundException } from "../../utils";
import { CommentRepository } from "../../DB/comment/comment.repository.js";
import { CommentFactory } from "./factory";
import { CreateCommentDTO } from "./comment.dto";
import { PostRepository } from "./../../DB/";

class CommentServices {
  constructor() {}
  private readonly commentRepository = new CommentRepository();
  private readonly postRepository = new PostRepository();
  private readonly commentFactory = new CommentFactory();
  create = async (req: Request, res: Response) => {
    const { postId, id } = req.params;
    const createCommentDTO: CreateCommentDTO = req.body;
    const postExist = await this.postRepository.exist({ _id: postId });
    if (!postExist) throw new NotFoundException("post not found");
    let commentExist: IComment | any;
    if (id) {
      commentExist = await this.commentRepository.exist({ _id: id });
      if (!commentExist) throw new NotFoundException("comment not found");
    }
    const comment = this.commentFactory.createComment(
      createCommentDTO,
      postExist,
      req.user,
      commentExist
    );
    const createComment = await this.commentRepository.create(comment);
    return res.status(201).json({
      message: "comment created successfully",
      date: { createComment },
    });
  };
  getSpecific = async (req: Request, res: Response) => {
    const { id } = req.params;
    const comment = await this.commentRepository.getOne(
      { _id: id },
      {},
      {
        populate: [
          {path:"replies"}
        ],
      }
    );
    if(!comment)throw new NotFoundException("comment not found")
      return res.status(200).json({message:"done",success:true,data:{comment}})
  };
}

export default new CommentServices();
