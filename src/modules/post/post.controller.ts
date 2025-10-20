import { Router } from "express";
import postService from "./post.service.js"
import { isAuthenticate } from '../../middleware';
import commentRouter from '../comment/comment.controller.js'

const router = Router();
router.use("/:postId/comment/",commentRouter)
router.post("/",isAuthenticate(),postService.create)
router.patch("/:id",isAuthenticate(),postService.addReaction)
router.get("/:id",isAuthenticate(),postService.getSpecific)
router.delete("/:id",isAuthenticate(),postService.deletePost)
router.post("/update/:id",isAuthenticate(),postService.update)
router.post("/freeze/:id",isAuthenticate(),postService.freeze)

export default router