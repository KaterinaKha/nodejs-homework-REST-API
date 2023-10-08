import { Router } from "express";

import { validateBody } from "../../decorators/index.js";

import userSchemas from "../../Schemas/auth-schemas.js";

import authController from "../../controllers/user-controller.js";

import { authenticate, upload } from "../../middlewares/index.js";

const authRouter = Router();

const userSignupValidate = validateBody(userSchemas.userSignupSchema);
const userSigninValidate = validateBody(userSchemas.userSigninSchema);
const userEmailValidate = validateBody(userSchemas.userEmailSchema);

authRouter.post("/register", userSignupValidate, authController.register);

authRouter.get("/verify/:verificationToken", authController.verify);

authRouter.post("/verify", userEmailValidate, authController.resendVerifyEmail);

authRouter.post("/login", userSigninValidate, authController.login);

authRouter.get("/current", authenticate, authController.getCurrent);

authRouter.post("/logout", authenticate, authController.logout);

authRouter.patch("/avatar", authenticate, upload.single("avatar"), authController.updateAvatar);

export default authRouter;
