import express from "express";
import {
  createPcRequest,
  getMyPcRequest,
  getAllPcRequests,
  updatePcRequestStatus
} from "../controllers/pcRequest.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import adminMiddleware from "../middleware/admin.middleware.js";

const router = express.Router();

// 👤 CANDIDAT
router.post("/", authMiddleware, createPcRequest);
router.get("/me", authMiddleware, getMyPcRequest);

// 🛠 ADMIN
router.get("/", authMiddleware, adminMiddleware, getAllPcRequests);
router.patch("/:id", authMiddleware, adminMiddleware, updatePcRequestStatus);

export default router;