import { IMessage } from "../../utils/index.js";
import { AbstractRepository } from "../abstract.repository.js";
import { Message } from "./message.model.js";

export class MessageRepository extends AbstractRepository<IMessage>{
    constructor(){
        super(Message)
    }
}