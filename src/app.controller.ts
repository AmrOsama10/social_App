import { NextFunction, Request, Response, type Express } from "express";
import { connectDB } from "./DB/connection.js";
import authRouter from "./modules/auth/auth.controller.js";
import postRouter from "./modules/post/post.controller.js";
import userRouter from "./modules/user/user.controller.js";
import commentRouter from "./modules/comment/comment.controller.js";
import { AppError } from "./utils/error/index.js";
import chatRouter from "./modules/chat/chat.controller.js"
import cors from "cors";

export function bootstrap(app: Express, express: any) {
  app.use(express.json());
  
  connectDB();
  app.use(cors({origin: "*"}));
  // auth
  app.use("/auth", authRouter);
  //user
  app.use("/user", userRouter);
  //post
  app.use("/post", postRouter);
  // comment
  app.use("/comment", commentRouter);
  // chat
  app.use("/chat",chatRouter)

  app.use("/{*dummy}", (req, res, next) => {
    return res.status(200).json({ message: "invalid router", success: false });
  });
  app.use(
    (error: AppError, req: Request, res: Response, next: NextFunction) => {
      return res.status(error.statusCode || 400).json({
        message: error.message,
        status: false,
        stack: error.stack,
        errorDetails: error.errorDetails,
      });
    }
  );
}
