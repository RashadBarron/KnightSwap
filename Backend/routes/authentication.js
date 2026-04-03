import express from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/authController.js";
import { requireToken } from "../config/auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", requireToken, logoutUser);

export default router;