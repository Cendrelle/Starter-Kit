import express from "express";
import {
  createPcRequest,
  getMyPcRequest,
  getAllPcRequests,
  getPcRequestById,
  updatePcRequestStatus
} from "../controllers/pcRequest.controller.js";

import {authenticate} from "../middleware/auth.middleware.js";
import adminMiddleware from "../middleware/admin.middleware.js";

const router = express.Router();

// 👤 CANDIDAT
router.post("/", authenticate, createPcRequest);
router.get("/me", authenticate, getMyPcRequest);

// 🛠 ADMIN
router.get("/", authenticate, adminMiddleware, getAllPcRequests);
router.get("/:id", authenticate, adminMiddleware, getPcRequestById);
router.patch("/:id/status", authenticate, adminMiddleware, updatePcRequestStatus);

export default router;
