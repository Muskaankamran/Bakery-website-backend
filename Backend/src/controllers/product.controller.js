import mongoose from "mongoose";
import productModel from "../models/products.model.js";
import userModel from "../models/users.model.js";
import uploadFile from "../../services/storage.service.js";

function getValidatedProductFields(body = {}) {
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const desc = typeof body.desc === "string" ? body.desc.trim() : "";
    const rawPrice = body.price;
    const price = typeof rawPrice === "number"
        ? rawPrice
        : typeof rawPrice === "string" && rawPrice.trim() !== ""
            ? Number(rawPrice)
            : Number.NaN;

    if (!name || !desc || !Number.isFinite(price) || price < 0) {
        return null;
    }

    return { name, desc, price };
}

async function createProduct(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Product image is required" })
        }

        const fields = getValidatedProductFields(req.body);
        if (!fields) {
            return res.status(400).json({ message: "Name, description, and a nonnegative price are required" })
        }

        const uploadImage = await uploadFile(req.file.buffer, req.file.originalname)
        const product = await productModel.create({
            image: uploadImage.url,
            ...fields,
            admin: req.user.id
        })
        const populatedProduct = await productModel.findById(product._id).populate("admin", "username email")

        return res.status(201).json({ message: "Product added", product: populatedProduct })
    } catch (error) {
        console.error("CREATE PRODUCT ERROR:", error.message);
        return res.status(500).json({ message: "Failed to create product" })
    }
}

async function getProducts(req, res) {
    try {

        const products = await productModel.find().populate("admin", "username email")
        res.status(200).json({
            message: "Products fetched successfully",
            products: products.map(product => {
                const data = product.toObject();
                return {
                    ...data,
                    image: data.image || null,
                    price: Number.isFinite(data.price) ? data.price : null
                };
            })
        })

    } catch (error) {
        console.error("GET PRODUCTS ERROR:", error.message);
        res.status(500).json({
            message: "Failed to fetch Products",
        })
    }
}

async function updateProduct(req, res) {
    try {
        const { productId } = req.params
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid Product Id" })
        }

        const product = await productModel.findById(productId)
        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }
        const fields = getValidatedProductFields(req.body);
        if (!fields) {
            return res.status(400).json({ message: "Name, description, and a nonnegative price are required" })
        }

        product.name = fields.name
        product.desc = fields.desc
        product.price = fields.price
        if (req.file) {
            const uploadImage = await uploadFile(req.file.buffer, req.file.originalname)
            product.image = uploadImage.url
        }
        await product.save()

        const updatedProduct = await productModel.findById(product._id).populate("admin", "username email")
        return res.status(200).json({ message: "Product updated", product: updatedProduct })
    } catch (error) {
        console.error("UPDATE PRODUCT ERROR:", error.message);
        return res.status(500).json({ message: "Failed to update product" })
    }
}

async function deleteProduct(req, res) {
    try {
        const { productId } = req.params
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid Product Id" })
        }

        const product = await productModel.findById(productId)
        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }
        await userModel.updateMany(
            { "cart.product": productId },
            { $pull: { cart: { product: productId } } },
        )
        await product.deleteOne()
        return res.status(200).json({ message: "Product deleted" })
    } catch (error) {
        console.error("DELETE PRODUCT ERROR:", error.message);
        return res.status(500).json({ message: "Failed to delete product" })
    }
}

export { createProduct, getProducts, updateProduct, deleteProduct }