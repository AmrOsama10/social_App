import { GENDER, SYS_ROLE, USER_AGENT } from "../../../utils";

export class UserEntity {
  firstName!: string;
  lastName!: string;
  fullName!: string;
  email!: string;
  password!: string;
  phoneNumber?: string;
  credentialUpdatedAt!: Date;
  role!: SYS_ROLE;
  gender!: GENDER;
  userAgent!: USER_AGENT;
  otp?: string;
  otpExpire?: Date;
  isVerify!: boolean;
  pendingEmail!: string;
  twoStepEnabled!:boolean;
}