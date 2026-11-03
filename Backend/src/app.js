import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import { passport } from "./config/passport.js";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js"
import cartRoutes from "./routes/cart.routes.js"

const app = express();

const allowedOrigins = new Set(
    (process.env.FRONTEND_ORIGINS || "http://localhost:5173,http://localhost:5174")
        .split(",")
        .map(origin => origin.trim())
        .filter(Boolean)
);

app.use((req, res, next) => {
    const origin = req.headers.origin;
    const isGoogleOAuthCallback = req.path === "/api/auth/google/callback";
    if (origin && !allowedOrigins.has(origin) && !isGoogleOAuthCallback) {
        return res.status(403).json({ message: "Origin not allowed" });
    }

    if (origin) {
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Vary", "Origin");
    }

    if (req.method === "OPTIONS") {
        res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        return res.sendStatus(204);
    }

    next();
});

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use("/api/products", productRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/auth", authRoutes);

app.use("/api", (req, res) => {
    res.status(404).json({ message: "API endpoint not found" })
})

app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(error)
    }

    const status = error.status
        || error.statusCode
        || (error.code === "LIMIT_FILE_SIZE" ? 413 : error.name === "MulterError" ? 400 : 500);
    console.error("API ERROR:", error.message);
    return res.status(status).json({
        message: status < 500 ? error.message : "Internal server error"
    })
})

export default app;
