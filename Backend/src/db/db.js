import dns from "node:dns/promises";
import mongoose from "mongoose";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

async function connectDB() {
    const connectionString = "mongodb+srv://muskaankamran494_db_user:Muskankamran2010@cluster0.yscqp1j.mongodb.net/products"
    if (!connectionString) {
        throw new Error("MONGODB_URI is not configured");
    }

    try {
        await mongoose.connect(connectionString);
        console.log("Connected to DB");
    } catch (error) {
        console.error("Error connecting to DB:", error.message);
        throw error;
    }
}

export default connectDB;