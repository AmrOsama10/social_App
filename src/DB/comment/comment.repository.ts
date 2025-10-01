import { IComment } from "../../utils";
import { AbstractRepository } from "../abstract.repository.js";
import { Comment } from "./comment.model.js";

export class CommentRepository extends AbstractRepository<IComment> {
    constructor(){
        super(Comment)
    }
}