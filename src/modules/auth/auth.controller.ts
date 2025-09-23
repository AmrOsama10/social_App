import { Router } from "express";
import authService from "./auth.service.js";
import { isValid } from "../../middleware/validation.middleware.js";
import * as authValidation from "./auth.validation.js";
const router = Router();
router.post(
  "/register",
  isValid(authValidation.registerSchema),
  authService.register
);
router.post("/login", isValid(authValidation.loginSchema), authService.login);
router.post("/google-login", authService.googleLogin);
router.post(
  "/verify-account",
  isValid(authValidation.verifyAccountSchema),
  authService.verifyAccount
);
export default router;
