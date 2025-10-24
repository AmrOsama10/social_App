import { Router } from "express";
import userService from "./user.service.js";
import { isAuthenticate } from "../../middleware/auth.middleware.js";
import { isValid } from "../../middleware/validation.middleware.js";
import * as userValidation from "./user.validation.js";

const router = Router();

router.get("/profile", isAuthenticate(), userService.getProfile);
router.get(
  "/:id",
  isAuthenticate(),
  isValid(userValidation.validateIdSchema),
  userService.getSpecificProfile
);
router.post(
  "/:receiverId/friend-request",
  isValid(userValidation.requestFriendSchema),
  isAuthenticate(),
  userService.friendRequest
);
router.post(
  "/:senderId/friend-request-accept",
  isAuthenticate(),
  isValid(userValidation.requestFriendSchema),
  userService.acceptFriendRequest
);
router.delete(
  "/:senderId/friend-request-delete",
  isAuthenticate(),
  isValid(userValidation.requestFriendSchema),
  userService.deleteFriendRequest
);
router.delete(
  "/:friendId/friend-delete",
  isAuthenticate(),
  isValid(userValidation.requestFriendSchema),
  userService.unFriend
);
router.post(
  "/:Id/block",
  isAuthenticate(),
  isValid(userValidation.validateIdSchema),
  userService.blockUser
);

export default router;
