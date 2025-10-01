
import { IUser } from "../../utils";
import { AbstractRepository } from "../abstract.repository.js";
import { User } from "./user.model.js";

export class UserRepository extends AbstractRepository<IUser> {
    constructor(){
        super(User)
    }

    async getAllUser(){
        return await this.model.find()
    }

}