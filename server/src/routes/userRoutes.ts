import { Router } from "express";
import { userController } from "../controllers/userController.js";
import { upload } from "../middlewares/multer.middleware.js";
import { authorizedAdmin, verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Normal User and Admin routes:
router
  .route("/sign-up")
  .post(upload.single("profilePic"), userController.registerUser);

router.route("/login").post(userController.loginUser);

router.route("/logout").post(verifyJWT, userController.logoutUser);

router.route("/profile").get(verifyJWT, userController.getCurrentUser);

router.route("/update-profile").patch(verifyJWT, userController.updateProfile);

router
  .route("/update-profilePic")
  .patch(
    verifyJWT,
    upload.single("profilePic"),
    userController.updateProfilePic
  );

router
  .route("/change-password")
  .patch(verifyJWT, userController.changeCurrentPassword);

router.route("/forget-password").post(userController.getForgetPasswordToken);
router.route("/verify-fp-token").post(userController.verifyForgetPasswordToken);

router.route("/reset-password/:token").post(userController.resetPassword);

// Admin Routes:
router
  .route("/get-all-users")
  .get(verifyJWT, authorizedAdmin, userController.getAllUsers);

router
  .route("/user/:id")
  .get(verifyJWT, authorizedAdmin, userController.getAUserById)
  .patch(
    verifyJWT,
    authorizedAdmin,
    upload.single("profilePic"),
    userController.updateProfileById
  )
  .delete(verifyJWT, authorizedAdmin, userController.deleteAUserById);

export default router;
