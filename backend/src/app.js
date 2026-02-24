import express from "express"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.routes.js"
import jobRoutes from "./routes/job.routes.js"
import profileRoutes from "./routes/profile.routes.js"
import donationRoutes from "./routes/donation.routes.js"

dotenv.config()

const app = express()
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/jobs", jobRoutes)
app.use("/api/profile", profileRoutes)
app.use("/api/donations", donationRoutes)

app.listen(3000, () => {
  console.log("Server running on port 3000")
})