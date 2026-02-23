import express from "express"
import { authenticate, authorize } from "../middleware/auth.middleware.js"
import { createJob } from "../controllers/job.controller.js"

const router = express.Router()

router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  createJob
)

export default router