import { Router } from "express";
import * as authController from "../controllers/authController";
import { signupValidator, loginValidator } from "../validators/authValidator";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();

router.post("/signup", signupValidator, authController.signup);
router.post("/login", loginValidator, authController.login);
router.post("/logout", authController.logout);



export default router;
