import express from "express"
import {
  getAllJobApplications,
  updateJobApplicationStatus,
  getMyJobApplications
} from "../controllers/jobApplication.controller.js"

import {authenticate} from "../middleware/auth.middleware.js";
import adminMiddleware from "../middleware/admin.middleware.js";

const router = express.Router()

router.get("/me", authenticate, getMyJobApplications)

// Admin
router.get("/admin", authenticate, adminMiddleware, getAllJobApplications)
router.patch("/admin/:id/status", authenticate, adminMiddleware, updateJobApplicationStatus)

export default router
