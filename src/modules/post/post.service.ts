import { NextFunction, Request, Response } from "express";
import { CreatePostDTO } from "./post.dto.js";
import { PostFactoryService } from "./factory";
import { PostRepository } from "../../DB";
import { NotFoundException } from "../../utils";

class PostServices {
  private readonly postFactoryService = new PostFactoryService();
  private readonly postRepository = new PostRepository();
  constructor() {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    const createPostDTO: CreatePostDTO = req.body;
    const post = this.postFactoryService.createPost(createPostDTO, req.user);
    const createdPost = await this.postRepository.create(post);
    return res.status(201).json({
      message: "create post successfully",
      success: true,
      data: createdPost,
    });
  };
  addReaction = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { reaction } = req.body;
    const userId = req.user._id;
    const postExist = await this.postRepository.exist({ _id: id });
    if (!postExist) throw new NotFoundException("post not found");
    let postReactedIndex = postExist.reactions.findIndex((reaction) => {
      return reaction.userId.toString() == userId.toString();
    });
    if (postReactedIndex == -1) {
      await this.postRepository.update(
        { _id: id },
        { $push: { reactions: { reaction, userId } } }
      );
    } else if ([undefined, null, ""].includes(reaction)) {
      await this.postRepository.update(
        { _id: id, "reactions.userId": userId },
        {
          $pull: {
            reactions: {
              userId,
              reaction: postExist.reactions[postReactedIndex].reaction,
            },
          },
        }
      );
    } else {
      await this.postRepository.update(
        { _id: id, "reactions.userId": userId },
        {
          "reactions.$.reaction": reaction,
        }
      );
    }

    return res.sendStatus(204);
  };
  getSpecific = async (req: Request, res: Response) => {
    const {id} = req.params;
    const post = await this.postRepository.getOne(
      { _id: id },
      {},
      {
        populate: [
          { path: "userId", select: "fullName firstName lastName " },
          { path: "reactions.userId", select: "fullName firstName lastName" },
          { path: "comments" ,match: { parentId: null } },
        ],
      }
    );
    if (!post) {
      throw new NotFoundException("post not found")
    }
    return res.status(200).json({message:"done",success:true,data:{post}})
  };
}

export default new PostServices();
