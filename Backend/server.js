
import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/db/db.js";

const port = Number(process.env.PORT) || 3000;

if (!process.env.JWT_SECRET) {
    console.error("Backend startup failed: JWT_SECRET is not configured");
    process.exit(1);
}

try {
    await connectDB();
} catch (error) {
    console.error("Backend startup failed:", error.message);
    process.exit(1);
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});