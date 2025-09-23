
import { GENDER } from "../../utils/common/enum/index.js";

export interface RegisterDTO {
  fullName?: string;
  email: string;
  password: string;
  phoneNumber?: string;
  gender: GENDER;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface GoogleDTO {
  idToken: string;
}
export interface GooglePayloadDTO {
  name: string;
  email: string;
  picture?: string;
}

export interface VerifyAccountDTO {
  email: string;
  otp:string
}