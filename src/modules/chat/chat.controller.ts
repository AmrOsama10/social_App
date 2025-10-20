import { Router } from "express";
import { isAuthenticate } from "../../middleware/auth.middleware.js";
import chatService from "./chat.service.js";
const router = Router()

router.get("/:userId",isAuthenticate(),chatService.getChat)

export default router