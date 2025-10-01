import { IUser } from "../../../utils";
import { PostEntity } from "../entity";
import { CreatePostDTO } from "../post.dto.js";

export class PostFactoryService {
  createPost(createPostDTO: CreatePostDTO, user: IUser) {
    const newPost = new PostEntity();
    newPost.content = createPostDTO.content;
    newPost.userId = user._id;
    newPost.reactions = [];
    newPost.attachment = [];

    return newPost
  }
}
