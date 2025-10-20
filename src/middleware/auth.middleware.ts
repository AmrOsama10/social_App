import { NextFunction, Request, Response } from "express";
import { UserRepository } from "../DB";
import { BadRequestException, NotFoundException, verifyToken } from "../utils";

export const isAuthenticate = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization as string;
    const payload = verifyToken(token);
    const userRepository = new UserRepository();
    const user = await userRepository.exist({ _id: payload._id },{},{
      populate:{path:"friends",select:"fullName firstName lastName"}
    });
    if (!user) {
      throw new NotFoundException("user not found");
    }
    if (user.credentialUpdatedAt > new Date(payload.iat * 1000)) {
      throw new BadRequestException("token expired");
    }
    req.user = user;
    next();
  };
};
