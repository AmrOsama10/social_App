import { generateHash, generateOtp, generateOtpExpire, sendEmail, SYS_ROLE, USER_AGENT } from "../../../utils";
import { GooglePayloadDTO, RegisterDTO } from "../auth.dto.js";
import { UserEntity } from "../entity";

export class AuthFactoryService {
  register(registerDTO: RegisterDTO) {
    const user = new UserEntity();
    user.fullName = registerDTO.fullName as string;
    user.email = registerDTO.email;
    user.password = generateHash(registerDTO.password);
    user.phoneNumber = registerDTO.phoneNumber as string;
    user.gender = registerDTO.gender;
    user.otp = generateOtp();
    user.otpExpire = generateOtpExpire(5 * 60 * 60 * 1000) as unknown as Date;
    user.credentialUpdatedAt = Date.now() as unknown as Date;
    user.role = SYS_ROLE.user;
    user.userAgent = USER_AGENT.local;

    sendEmail({
      to: user.email,
      subject: "Verify your email",
      html: `<h1>your otp is ${user.otp}</h1>`,
    });
    return user;
  }
  googleLogin(googlePayloadDTO: GooglePayloadDTO) {
    const user = new UserEntity();
    user.fullName = googlePayloadDTO.name;
    user.email = googlePayloadDTO.email;
    user.userAgent = USER_AGENT.googl;
    user.isVerify=true
    return user;
  }



}

