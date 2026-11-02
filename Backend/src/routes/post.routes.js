import express from "express";
import jwt from "jsonwebtoken";
import userModel from "../models/users.model.js";
const router = express.Router();

router.post("/create", async(req, res) => {
   const token = req.cookies.token;

   if(!token) {
      return res.status(401).json({ message: "Unauthorized" });
   }
   try {
   const decoded=  jwt.verify(token,process.env.JWT_SECRET);
   console.log(decoded);
   const user = await userModel.findOne({ _id: decoded.id });
   console.log(user);
   } catch (error) {
    return res.status(401).json({ message: "Invalid Token" });
   }
    res.send("post created");
}
);
export default router;