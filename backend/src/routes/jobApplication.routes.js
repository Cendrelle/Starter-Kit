import express from "express"
import {
  getAllJobApplications,
  updateJobApplicationStatus
} from "../controllers/jobApplication.controller.js"

import {authenticate} from "../middleware/auth.middleware.js";

const router = express.Router()

// Admin
router.get("/admin", authenticate, getAllJobApplications)
router.patch("/admin/:id/status", authenticate, updateJobApplicationStatus)

export default router