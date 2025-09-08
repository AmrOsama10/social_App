import { GENDER, SYS_ROLE, USER_AGENT } from "../../../utils/common/enum/index.js";

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
}