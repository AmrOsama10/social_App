import { IChat } from "../../utils/index.js";
import { AbstractRepository } from "../abstract.repository.js";
import { Chat } from "./chat.model.js";

export class ChatRepository extends AbstractRepository<IChat>{
    constructor(){
        super(Chat)
    }
}