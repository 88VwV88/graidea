import { Router } from "express";
import { UserController } from "../controllers";
import {
  validateLogin,
  validateChangePassword,
  validateSignup,
} from "../validation";
import { authenticate, authorize } from "../../../middlewares";
import { createS3UploadMiddleware } from "../../../middlewares/upload.middleware";

const router = Router();
const userController = new UserController();

// Signup route with S3 upload for profile image
router.post(
  "/signup",
  createS3UploadMiddleware({
    singleField: "profileImage",
    folder: "profiles",
  }),
  validateSignup,
  userController.signup
);

// Login route
router.post(
  "/login",
  validateLogin,
  authorize(["admin"]),
  userController.login
);

export default router;
