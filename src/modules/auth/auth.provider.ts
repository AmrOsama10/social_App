import {
  BadRequestException,
  ForbiddenException,
  generateOtp,
  generateOtpExpire,
  IUser,
  sendEmail,
} from "../../utils";
import { UserRepository } from "./../../DB";
export const authProvider = {
  checkOtp(otp:string,user?:IUser) {
    
    if (!user.otp || !user.otpExpire) {
      throw new BadRequestException("otp not found");
    }
    if (user.otp != otp)
      throw new BadRequestException("invalid otp");
    if (user.otpExpire < new Date())
      throw new BadRequestException("expire otp");
  },

  async sendOtp(email:string,user:IUser) {
    const userRepository = new UserRepository();
    const userExist = await userRepository.exist({
      email
    });
    if (!userExist) {
      throw new ForbiddenException(
        "If this email is eligible, you will receive a verification code shortly"
      );
    }
    user.otp = generateOtp();
    user.otpExpire = generateOtpExpire(3 * 60 * 1000);
    sendEmail({
      to: email,
      html: `<h1>Your new OTP is ${user.otp}</h1>`,
      subject: "Verify your email",
    });
  },
};
