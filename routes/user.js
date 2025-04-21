import express from "express";
import {
  login,
  logout,
  register,
  changePassword,
} from "../controllers/user.js";
import isAuthenticate from "../middlewares/auth-middleware.js";
import slidingWindowRateLimiter from "../middlewares/slidingWindowratlimiter.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", slidingWindowRateLimiter, login);
router.get("/logout", isAuthenticate, logout);
router.post("/change", isAuthenticate, changePassword);

export default router;
