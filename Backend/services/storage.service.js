import ImageKit from "@imagekit/nodejs";

async function uploadImage(buffer, fileName = "image.jpg") {
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    if (!privateKey) {
        throw new Error("ImageKit is not configured");
    }

    try {
        const client = new ImageKit({ privateKey });
        const response = await client.files.upload({
            file: buffer.toString("base64"),
            fileName,
        });

        if (typeof response.url !== "string" || !response.url) {
            throw new Error("ImageKit did not return an image URL");
        }

        return response;
    } catch (error) {
        console.error("ImageKit upload failed:", error.name || "Error");
        throw new Error("Image upload failed");
    }
}

export default uploadImage;
