// src/routes/job.routes.js
import express from "express"
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob
} from "../controllers/job.controller.js"
import { authenticate, authorize } from "../middleware/auth.middleware.js"

const router = express.Router()

router.post("/", authenticate, authorize("ADMIN"), createJob)
router.get("/", getJobs)
router.get("/:id", getJobById)
router.put("/:id", authenticate, authorize("ADMIN"), updateJob)
router.delete("/:id", authenticate, authorize("ADMIN"), deleteJob)

export default router