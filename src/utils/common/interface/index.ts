import { ObjectId } from "mongoose";
import {
  USER_RELATION,
  GENDER,
  REACTION,
  STATUS,
  SYS_ROLE,
  USER_AGENT,
} from "../enum";

export interface IUser {
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  password: string;
  phoneNumber?: string;
  credentialUpdatedAt: Date;
  role: SYS_ROLE;
  gender: GENDER;
  userAgent: USER_AGENT;
  otp?: string;
  otpExpire?: Date;
  isVerify: boolean;
  pendingEmail: string;
  twoStepEnabled: boolean;
  userRelation: USER_RELATION;
  friends: ObjectId[];
  friendRequests: ObjectId[];
  userBlock:ObjectId[]
}

export interface IUser {
  _id: ObjectId;
}

declare module "jsonwebtoken" {
  interface JwtPayload {
    _id: string;
    role: string;
  }
}

declare module "express" {
  interface Request {
    user: IUser;
  }
}
export interface IReaction {
  userId: ObjectId;
  reaction: REACTION;
}
export interface IPost {
  _id: ObjectId;
  userId: ObjectId;
  content: string;
  reactions: IReaction[];
  attachment?: IAttachment[];
  status:STATUS
}

export interface IAttachment {
  url: string;
  id: string;
}

export interface IComment {
  _id: ObjectId;
  userId: ObjectId;
  postId: ObjectId;
  parentId: ObjectId | null;
  content: string;
  reactions: IReaction[];
  attachment?: IAttachment[];
  mentions?: ObjectId[];
  status: STATUS;
}

export interface IMessage {
  content:string;
  sender:ObjectId;
}

export interface IChat {
  messages:ObjectId[];
  users:ObjectId[];
}