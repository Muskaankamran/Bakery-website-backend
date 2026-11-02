import multer from "multer";

const storage = multer.memoryStorage()

const upload = multer({
    storage,
    fileFilter(req, file, callback) {
        if (!file.mimetype.startsWith("image/")) {
            const error = new Error("Only image files are allowed");
            error.status = 400;
            return callback(error);
        }
        return callback(null, true);
    },
    limits: {
        fileSize: 5 * 1024 * 1024
    }
})
export default upload 