import jwt from "jsonwebtoken";
import userModel from "../models/users.model.js";

export function authenticateToken(req, res, next) {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET,
        )
        next()
    } catch (err) {
        return res.status(401).json({
            message: "Invalid Token",
        })
    }

}
export async function requireAdmin(req, res, next) {
    try {
        const user = await userModel.findById(req.user.id).select("role")
        if (!user) {
            return res.status(401).json({ message: "User not found" })
        }
        if (user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" })
        }
        req.user.role = user.role
        next()
    } catch (error) {
        console.error("ADMIN AUTHORIZATION ERROR:", error.message);
        return res.status(500).json({ message: "Failed to verify admin permissions" });
    }
}