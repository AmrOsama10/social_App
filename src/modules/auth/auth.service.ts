import { NextFunction, Request, Response } from "express";
import { LoginDTO, RegisterDTO } from "./auth.dto";
import {
  ConflictException,
  NotAuthorizedException,
  NotFoundException,
} from "../../utils/error/index.js";
import { UserRepository } from "../../DB/user/user.repository.js";
import { AuthFactoryService } from "./factory/index";
import { compareHash } from "../../utils/hash/index.js";
import { generateToken } from "../../utils/Token/index.js";


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
    // get data from req
    const loginDTO: LoginDTO = req.body;
    // check data
    const userExist = await this.userRepository.exist({
      email: loginDTO.email,
    });
    if (!userExist) {
      throw new NotFoundException("user not found");
    }
    const isValidPassword = compareHash(loginDTO.password, userExist.password);
    if (!isValidPassword) {
      throw new NotAuthorizedException("Not Authorized");
    }

    const accessToken = generateToken({ payload: { id: userExist._id },options:{expiresIn:"1m"} });

    return res.status(200).json({
      message: "done",
      success: true,
      data: { accessToken: accessToken },
    });
  };
}
export default new AuthServices();
