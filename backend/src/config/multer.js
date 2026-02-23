// src/config/multer.js
import multer from "multer";
import path from "path";

// Définir le stockage local
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/cvs"); // dossier pour stocker les CV
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `user-${req.user.userId}-${Date.now()}${ext}`);
  },
});

// Filtre les fichiers PDF uniquement
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Seuls les fichiers PDF sont autorisés"), false);
  }
};

// Créer l'upload Multer
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max
});

// Export par défaut pour ES Modules
export default upload;