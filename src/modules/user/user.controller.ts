import  { Router } from 'express';
import userService from "./user.service.js"
import { isAuthenticate } from '../../middleware/auth.middleware.js';

const router = Router();

router.get("/profile", isAuthenticate(), userService.getProfile);
router.get("/:id", isAuthenticate(), userService.getSpecificProfile);
router.post("/:receiverId/friend-request", isAuthenticate(), userService.friendRequest);
router.post("/:senderId/friend-request-accept", isAuthenticate(), userService.acceptFriendRequest);
router.delete("/:senderId/friend-request-delete", isAuthenticate(), userService.deleteFriendRequest);
router.delete("/:friendId/friend-delete", isAuthenticate(), userService.unFriend);
router.post("/:Id/block", isAuthenticate(), userService.blockUser);

export default router
