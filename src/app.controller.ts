import { NextFunction, Request, Response, type Express } from "express";
import { connectDB } from "./DB/connection.js";
import authRouter from "./modules/auth/auth.controller.js";
import postRouter from "./modules/post/post.controller.js";
import commentRouter from "./modules/comment/comment.controller.js";
import { AppError } from "./utils/error/index.js";
import cors from "cors"

export function bootstrap(app: Express, express: any) {
  app.use(
    cors({
      origin: "*", 
      credentials: true,
    })
  );
  app.use(express.json());

  connectDB();
  // auth
  app.use("/auth", authRouter);
  //post 
  app.use('/post',postRouter)
  // comment 
  app.use("/comment",commentRouter)

  app.use("/{*dummy}", (req, res, next) => {
    return res.status(200).json({ message: "invalid router", success: false });
  });
  app.use(
    (error: AppError, req: Request, res: Response, next: NextFunction) => {
      return res.status(error.statusCode || 400).json({
        message: error.message,
        status: false,
        errorDetails: error.errorDetails,
      });
    }
  );
}
