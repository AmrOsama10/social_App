import { Router } from "express";
import authService from "./auth.service.js";
import { isAuthenticate, isValid } from "../../middleware";
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
  isAuthenticate(),
  authService.sendOtp
);

router.patch(
  "/update-password",
  isValid(authValidation.updatePasswordSchema),
  isAuthenticate(),
  authService.updatePassword
);

router.patch(
  "/update-info",
  isValid(authValidation.updateInfoSchema),
  isAuthenticate(),
  authService.updateInfo
);

router.patch(
  "/update-email",
  isValid(authValidation.updateEmailSchema),
  isAuthenticate(),
  authService.updateEmail
);

router.post(
  "/verify-new-email",
  isAuthenticate(),
  isValid(authValidation.verifyAccountSchema),
  authService.verifyUpdateEmail
);
router.post(
  "/tow-step-verification",
  isAuthenticate(),
  authService.towStepVerification
);
router.post(
  "/login-confirm",
  isValid(authValidation.verifyAccountSchema),
  authService.loginConfirm
);

export default router;
