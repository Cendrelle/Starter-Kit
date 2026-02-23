import express from "express";
import { getProfile, updateProfile } from "../controllers/profile.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

import upload from "../config/multer.js";

const router = express.Router();

// Récupérer le profil
router.get("/", authenticate, getProfile);

// Mettre à jour le profil (avec CV)
router.put("/", authenticate, upload.single("cv"), updateProfile);

export default router;