import { Router } from "express";
import postService from "./post.service.js";
import { isAuthenticate, isValid } from "../../middleware";
import commentRouter from "../comment/comment.controller.js";
import * as postValidation from "./post.validation.js";

const router = Router();
router.use("/:postId/comment/", commentRouter);
router.post(
  "/",
  isAuthenticate(),
  isValid(postValidation.createPostSchema),
  postService.create
);
router.patch(
  "/:id",
  isAuthenticate(),
  isValid(postValidation.addReactionSchema),
  postService.addReaction
);
router.get(
  "/:id",
  isAuthenticate(),
  isValid(postValidation.getPostSchema),
  postService.getSpecific
);
router.delete(
  "/:id",
  isAuthenticate(),
  isValid(postValidation.getPostSchema),
  postService.deletePost
);
router.post(
  "/update/:id",
  isAuthenticate(),
  isValid(postValidation.updateInfoSchema),
  postService.update
);
router.post(
  "/freeze/:id",
  isAuthenticate(),
  isValid(postValidation.getPostSchema),
  postService.freeze
);

export default router;
