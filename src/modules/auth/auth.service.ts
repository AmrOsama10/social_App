import { NextFunction, Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { UserRepository } from "../../DB";
import {
  BadRequestException,
  compareHash,
  ConflictException,
  ForbiddenException,
  generateHash,
  generateOtp,
  generateOtpExpire,
  generateToken,
  NotFoundException,
  sendEmail,
} from "../../utils";
import {
  ForgetPasswordDTO,
  GoogleDTO,
  GooglePayloadDTO,
  LoginDTO,
  RegisterDTO,
  UpdateEmailDTO,
  UpdateInfoDTO,
  UpdatePasswordDTO,
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

    if (userExist.twoStepEnabled) {
      await authProvider.sendOtp(loginDTO.email, userExist);
      await userExist.save()
      return res.status(200).json({
        message: "require two step true",
        success: true,
      });
    } else {
      const accessToken = generateToken({
        payload: { _id: userExist._id },
        options: { expiresIn: "15m" },
      });

      return res.status(200).json({
        message: "Done",
        success: true,
        data: { accessToken },
      });
    }
  };

  loginConfirm = async (req: Request, res: Response) => {
    const verifyAccountDTO:VerifyAccountDTO = req.body;
    const user = await this.userRepository.getOne({
      email:verifyAccountDTO.email,
    });
    if (!user) {
      throw new NotFoundException("user not found");
    }
    authProvider.checkOtp(verifyAccountDTO.otp, user);
    const accessToken = generateToken({
      payload: { _id: user._id },
      options: { expiresIn: "15m" },
    });

    await this.userRepository.update(
      { _id: user._id },
      {
        $unset: { otp: "", otpExpire: "" },
      }
    );
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
    const userExist = await this.userRepository.exist({
      email: verifyAccountDTO.email,
    });
    if (!userExist) {
      throw new NotFoundException("user not found");
    }
    authProvider.checkOtp(verifyAccountDTO.otp, userExist);
    await this.userRepository.update(
      { email: verifyAccountDTO.email },
      { isVerify: true, $unset: { otp: "", otpExpire: "" } }
    );

    return res.sendStatus(204);
  };

  forgetPassword = async (req: Request, res: Response) => {
    const forgetPasswordDTO: ForgetPasswordDTO = req.body;
    authProvider.checkOtp(forgetPasswordDTO.otp);
    this.userRepository.update(
      {
        password: generateHash(forgetPasswordDTO.newPassword),
        credentialUpdatedAt: Date.now(),
      },
      { $unset: { otp: "", otpExpire: "" } }
    );
    return res.sendStatus(204);
  };

  updatePassword = async (req: Request, res: Response) => {
    const updatePasswordDTO: UpdatePasswordDTO = req.body;
    const user = await this.userRepository.getOne({ _id: req.user._id });
    if (!user) throw new ForbiddenException("invalid credentials");
    const isMatch = compareHash(updatePasswordDTO.oldPassword, user.password);
    if (!isMatch) throw new ForbiddenException("invalid credentials");

    await this.userRepository.update(
      { _id: req.user._id },
      {
        password: generateHash(updatePasswordDTO.newPassword),
        credentialUpdatedAt: Date.now(),
      }
    );
    return res.sendStatus(204);
  };

  updateInfo = async (req: Request, res: Response) => {
    const updateInfoDTO: UpdateInfoDTO = req.body;
    const newUser = await this.userRepository.update(
      { _id: req.user._id },
      {
        firstName: updateInfoDTO.firstName,
        lastName: updateInfoDTO.lastName,
        gender: updateInfoDTO.gender,
        phoneNumber: updateInfoDTO.phoneNumber,
      }
    );

    return res
      .status(200)
      .json({ message: "user updated successfully", success: true });
  };

  updateEmail = async (req: Request, res: Response) => {
    const updateEmailDTO: UpdateEmailDTO = req.body;
    const user = await this.userRepository.getOne({ _id: req.user._id });
    const isMatch = compareHash(updateEmailDTO.password, user.password);
    if (!isMatch) throw new ForbiddenException("invalid credentials");
    await authProvider.sendOtp(updateEmailDTO.newEmail, user);
    user.pendingEmail = updateEmailDTO.newEmail;

    await user.save();

    return res.sendStatus(204);
  };

  verifyUpdateEmail = async (req: Request, res: Response) => {
    const verifyAccountDTO: VerifyAccountDTO = req.body;
    const user = await this.userRepository.getOne({
      _id: req.user._id,
    });
    if (!user) {
      throw new NotFoundException("user not found");
    }
    authProvider.checkOtp(verifyAccountDTO.otp, user);
    await this.userRepository.update(
      { _id: user._id },
      {
        email: user.pendingEmail,
        credentialUpdatedAt: Date.now(),
        $unset: { otp: "", otpExpire: "", pendingEmail: "" },
      }
    );

    return res.sendStatus(204);
  };

  sendOtp = async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = await this.userRepository.exist({
      email,
    });
    if (!user) {
      throw new ForbiddenException("invalid credential");
    }
    user.otp = generateOtp();
    user.otpExpire = generateOtpExpire(3 * 60 * 1000);
    await user.save();

    sendEmail({
      to: user.email,
      html: `<h1>Your new OTP is ${user.otp}</h1>`,
      subject: "Verify your email",
    });
    return res.sendStatus(204);
  };

  towStepVerification = async (req: Request, res: Response) => {
    const { otp } = req.body;
    const user = await this.userRepository.getOne({
      _id: req.user._id,
    });
    if (!user) {
      throw new NotFoundException("user not found");
    }
    authProvider.checkOtp(otp, user);
    await this.userRepository.update(
      { _id: user._id },
      {
        twoStepEnabled: true,
        credentialUpdatedAt: Date.now(),
        $unset:{otp:"",otpExpire:""}
      }
    );
    return res.sendStatus(204);
  };
}
export default new AuthServices();
