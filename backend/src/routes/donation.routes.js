import express from "express";
import {
  createPcDonation,
  createCommonDonation,
  getDonationStats,
} from "../controllers/donation.controller.js";

const router = express.Router();

router.post("/pc", createPcDonation);
router.post("/common", createCommonDonation);
router.get("/stats", getDonationStats);

export default router;