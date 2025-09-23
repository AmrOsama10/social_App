import { NextFunction, Request, Response } from "express";
import {
  GoogleDTO,
  GooglePayloadDTO,
  LoginDTO,
  RegisterDTO,
  VerifyAccountDTO,
} from "./auth.dto";
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotAuthorizedException,
  NotFoundException,
} from "../../utils/error/index.js";
import { UserRepository } from "../../DB/user/user.repository.js";
import { AuthFactoryService } from "./factory/index";
import { compareHash } from "../../utils/hash/index.js";
import { generateToken } from "../../utils/Token/index.js";
import { OAuth2Client } from "google-auth-library";
import { authProvider } from "./auth.provider.js";

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
    if (userExist.userAgent === "google") {
      throw new BadRequestException("This account uses Google login only");
    }
    const isValidPassword = compareHash(loginDTO.password, userExist.password);
    if (!isValidPassword) {
      throw new ForbiddenException("invalid credentials");
    }

    const accessToken = generateToken({
      payload: { id: userExist._id },
      options: { expiresIn: "1m" },
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
    return res.sendStatus(204)
  };
}

export default new AuthServices();
