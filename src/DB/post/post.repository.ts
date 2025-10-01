import { IPost } from "../../utils";
import { AbstractRepository } from "../abstract.repository.js";
import { Post } from "./post.model.js";

export class PostRepository extends AbstractRepository<IPost> {
    constructor(){
        super(Post)
    }
}