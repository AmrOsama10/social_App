import { Router } from "express";
import authService from "./auth.service.js";
import { isValid } from "../../middleware";
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
router.patch(
  "/forget-password",
  isValid(authValidation.forgetPasswordSchema),
  authService.forgetPassword
);
router.post(
  "/send-otp",
  isValid(authValidation.sendOtpSchema),
  authService.sendOtp
);
export default router;
