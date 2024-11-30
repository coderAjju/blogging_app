import multer from "multer";
// Configure Multer with memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

export default upload;
