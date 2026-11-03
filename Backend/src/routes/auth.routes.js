import express from "express";
import {
    registerUser,
    loginUser,
    getCurrentUser,
    googleAuthCallback
} from "../controllers/auth.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { googleAuthEnabled, passport } from "../config/passport.js";

const router = express.Router();
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

function requireGoogleAuth(req, res, next) {
    if (!googleAuthEnabled) {
        return res.status(503).json({
            message: "Google authentication is not configured on the backend"
        });
    }
    return next();
}

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get(
    "/google",
    requireGoogleAuth,
    passport.authenticate("google", { scope: ["profile", "email"], session: false })
);
router.get(
    "/google/callback",
    requireGoogleAuth,
    passport.authenticate("google", {
        session: false,
        failureRedirect: `${frontendUrl}/login?google=failed`
    }),
    googleAuthCallback
);
router.get("/me", authenticateToken, getCurrentUser);

export default router;
