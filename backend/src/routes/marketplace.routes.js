import express from "express"
import {
  createMarketplaceItem,
  getMarketplaceItems,
  getMarketplaceItemById,
  updateMarketplaceItemStatus,
  purchaseMarketplaceItem,
} from "../controllers/marketplace.controller.js"
import { authenticate, authorize } from "../middleware/auth.middleware.js"

const router = express.Router()

router.get("/items", getMarketplaceItems)
router.get("/items/:id", getMarketplaceItemById)
router.post("/items", authenticate, createMarketplaceItem)
router.patch("/items/:id/status", authenticate, authorize("ADMIN"), updateMarketplaceItemStatus)
router.post("/items/:id/purchase", purchaseMarketplaceItem)

export default router
