import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/Token/index.js";
import { UserRepository } from "../DB/user/user.repository.js";
import { NotFoundException } from "../utils/error/index.js";

export const isAuthenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization as string;
  const payload = verifyToken(token);
  const userRepository = new UserRepository();
  const user = await userRepository.exist({ id: payload._id });
  if (!user) {
    throw new NotFoundException("user not found");
  }
  req.user = user;
  next();
};
