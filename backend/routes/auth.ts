import express, { Router } from "express";
import * as controllers from "../controllers/auth.ts";

const router: Router = express.Router();

router.post("/register", constrollers.register);

router.post("/email-verification-resend", controllers.resendEmailVerification);

router.post("/login", controllers.login);

router.get("/verify/:token", controllers.verifyToken);

router.post("/request/pwd-reset", controllers.requestPwdReset);

router.get("/verify/pwd-reset-token/:token", controllers.verifyPwdResetToken);

router.post("/reset-pwd", controllers.resetPassword);

export default router;