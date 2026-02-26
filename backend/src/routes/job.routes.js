// src/routes/job.routes.js
import express from "express"
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  updateJobStatus,
} from "../controllers/job.controller.js"
import { authenticate, authorize } from "../middleware/auth.middleware.js"
import { applyToJob } from "../controllers/jobApplication.controller.js"

const router = express.Router()

router.post("/", authenticate, authorize("ADMIN"), createJob)
router.get("/", getJobs)
router.get("/:id", getJobById)
router.put("/:id", authenticate, authorize("ADMIN"), updateJob)
router.patch("/:id/status", authenticate, authorize("ADMIN"), updateJobStatus)
router.delete("/:id", authenticate, authorize("ADMIN"), deleteJob)
// Postuler
router.post("/:id/apply", applyToJob)

export default router
