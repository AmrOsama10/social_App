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
router.post("/send-otp",isAuthenticate(), authService.sendOtp);

router.patch("/update-password", isAuthenticate(), authService.updatePassword);

router.patch("/update-info", isAuthenticate(), authService.updateInfo);

router.patch("/update-email", isAuthenticate(), authService.updateEmail);

router.post(
  "/verify-new-email",
  isAuthenticate(),
  authService.verifyUpdateEmail
);
router.post(
  "/tow-step-verification",
  isAuthenticate(),
  authService.towStepVerification
);
router.post("/login-confirm", authService.loginConfirm);

export default router;
