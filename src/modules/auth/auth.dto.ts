
import { GENDER } from "../../utils";

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

export interface ForgetPasswordDTO {
  email:string;
  otp:string;
  newPassword:string;
}


export interface UpdatePasswordDTO {
  oldPassword:string;
  newPassword:string;
}

export interface UpdateInfoDTO {
  firstName:string;
  lastName:string;
  gender:GENDER;
  phoneNumber:string
}

export interface UpdateEmailDTO {
  password:string;
  newEmail:string
}

