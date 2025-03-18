import multer from "multer";

// Use memory storage to store the file in memory rather than on the local filesystem
const storage = multer.memoryStorage();

// Initialize multer with the memory storage configuration
export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Optional: Set file type filter, e.g., only accept images
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
});

//returns localpath which can be used by cloudinary utility