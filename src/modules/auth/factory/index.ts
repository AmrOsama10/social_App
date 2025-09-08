
import { SYS_ROLE, USER_AGENT } from "../../../utils/common/enum/index.js";
import {  generateHash } from "../../../utils/hash/index.js";
import { generateOtp, generateOtpExpire } from "../../../utils/OTP/index.js";
import { sendEmail } from "../../../utils/sendEmail/indec.js";
import { LoginDTO, RegisterDTO } from "../auth.dto.js";
import { UserEntity } from "../entity/index.js";

export class AuthFactoryService {
  register(registerDTO: RegisterDTO) {
    const user = new UserEntity();
    user.fullName = registerDTO.fullName as string;
    user.email = registerDTO.email;
    user.password = generateHash(registerDTO.password);
    user.phoneNumber = registerDTO.phoneNumber as string;
    user.gender = registerDTO.gender;
    user.otp = generateOtp();
    user.otpExpire = generateOtpExpire(5 * 60 * 60 * 1000) as unknown as Date
    user.credentialUpdatedAt = Date.now() as unknown as Date ;
    user.role = SYS_ROLE.user;
    user.userAgent = USER_AGENT.local;
    sendEmail({
      to: user.email,
      subject: "Verify your email",
      html: `<h1>your otp is ${user.otp}</h1>`,
    });
    return user
  }

  // login(loginDTO:LoginDTO){
  //   const user = new User();
  //   user.password= generateHash(loginDTO.password)
  // }
}
