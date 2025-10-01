import { NextFunction, Request, Response } from "express";
import { UserRepository } from "../DB";
import { NotFoundException, verifyToken } from "../utils";

export const isAuthenticate = ()=> {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization as string;
    const payload = verifyToken(token);
    const userRepository = new UserRepository();
    const user = await userRepository.exist({ _id: payload._id });
    if (!user) {
      throw new NotFoundException("user not found");
    }
    req.user = user;
    next();
  };
}
