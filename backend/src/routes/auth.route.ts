/**
 * @dev handles auth routes
 */

import express from "express";
import AuthController from "../controllers/auth.controller";

const router = express.Router();

router.get("/isAuth", AuthController.isAuth);
router.get("/user/:userId", AuthController.getUserId);
router.post("/login", AuthController.login);
router.post("/register", AuthController.register);
router.delete("/logout", AuthController.logout);

export default router;
