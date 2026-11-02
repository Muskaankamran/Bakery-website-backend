import express from "express";
import {
    createProduct,
    getProducts,
    updateProduct,
    deleteProduct
} from "../controllers/product.controller.js";
import { authenticateToken, requireAdmin } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

router.get("/", getProducts);

router.post(
    "/create",
    authenticateToken,
    requireAdmin,
    upload.single("image"),
    createProduct
);

router.put(
    "/:productId",
    authenticateToken,
    requireAdmin,
    upload.single("image"),
    updateProduct
);

router.delete(
    "/:productId",
    authenticateToken,
    requireAdmin,
    deleteProduct
);

export default router;
