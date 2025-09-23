import { ObjectId } from "mongoose";
import { GENDER, SYS_ROLE, USER_AGENT } from "../enum/index.js";


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
  isVerify:boolean
}

export interface IUser {
  _id:ObjectId
}

declare module "jsonwebtoken" {
  interface JwtPayload {
    _id:string,
    role:string
  }
}

declare module "express" {
  interface Request {
    user:IUser
  }
}