import { NextFunction, Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { UserRepository } from "../../DB";
import {
  BadRequestException,
  compareHash,
  ConflictException,
  ForbiddenException,
  generateHash,
  generateOtp, generateOtpExpire,
  generateToken,
  sendEmail,
} from "../../utils";
import {
  ForgetPasswordDTO,
  GoogleDTO,
  GooglePayloadDTO,
  LoginDTO,
  RegisterDTO,
  SendOtpDTO,
  VerifyAccountDTO,
} from "./auth.dto";
import { authProvider } from "./auth.provider.js";
import { AuthFactoryService } from "./factory";

class AuthServices {
  private userRepository = new UserRepository();
  private authFactoryService = new AuthFactoryService();
  constructor() {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    const registerDto: RegisterDTO = req.body;
    const userExist = await this.userRepository.exist({
      email: registerDto.email,
    });
    if (userExist) {
      throw new ConflictException("user already exist");
    }
    const user = this.authFactoryService.register(registerDto);
    const createdUser = await this.userRepository.create(user);
    return res.status(200).json({
      message: "user created successful",
      success: true,
      data: createdUser,
    });
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    const loginDTO: LoginDTO = req.body;
    const userExist = await this.userRepository.exist({
      email: loginDTO.email,
    });
    if (!userExist) {
      throw new ForbiddenException("invalid credentials");
    }
    if (userExist.userAgent === 1) {
      throw new BadRequestException("This account uses Google login only");
    }
    const isValidPassword = compareHash(loginDTO.password, userExist.password);
    if (!isValidPassword) {
      throw new ForbiddenException("invalid credentials");
    }

    const accessToken = generateToken({
      payload: { _id: userExist._id },
      options: { expiresIn: "15m" },
    });

    return res.status(200).json({
      message: "done",
      success: true,
      data: { accessToken },
    });
  };

  googleLogin = async (req: Request, res: Response, next: NextFunction) => {
    const googleDTO: GoogleDTO = req.body;
    const clint = new OAuth2Client(process.env.GOOGLE_CLINT_ID);
    const ticket = await clint.verifyIdToken({ idToken: googleDTO.idToken });
    const payload = ticket.getPayload();
    if (!payload) {
      throw new BadRequestException("Invalid Google token");
    }
    const userExist = await this.userRepository.exist({ email: payload.email });
    if (!userExist) {
      const user = this.authFactoryService.googleLogin(
        payload as GooglePayloadDTO
      );
      await this.userRepository.create(user);
    }
    return res.sendStatus(204);
  };

  verifyAccount = async (req: Request, res: Response) => {
    const verifyAccountDTO: VerifyAccountDTO = req.body;
    await authProvider.checkOtp(verifyAccountDTO);
    await this.userRepository.update(
      { email: verifyAccountDTO.email },
      { isVerify: true, $unset: { otp: "", otpExpire: "" } }
    );
    return res.sendStatus(204);
  };

  sendOtp = async (req:Request,res:Response)=>{
    const sendOtpDTO:SendOtpDTO = req.body;
    const userExist = await this.userRepository.exist({email:sendOtpDTO.email});
    if (!userExist) {
      throw new ForbiddenException("invalid credential")
    }
    userExist.otp = generateOtp()
    userExist.otpExpire = generateOtpExpire(5 * 60 * 60 * 1000);
    await userExist.save()
    
    sendEmail({
      to: sendOtpDTO.email,
      html: `<h1>Your new OTP is ${userExist.otp}</h1>`,
      subject: "Verify your email",
    });
    return res.sendStatus(204)
  }

  forgetPassword = async (req: Request, res: Response) => {
    const forgetPasswordDTO: ForgetPasswordDTO = req.body;
    await authProvider.checkOtp(forgetPasswordDTO);
    this.userRepository.update(
      { password: generateHash(forgetPasswordDTO.newPassword) },
      { $unset: { otp: "", otpExpire: "" } }
    );
    return res.sendStatus(204)
  };
}

export default new AuthServices();
