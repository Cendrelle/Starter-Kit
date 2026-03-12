import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const CATEGORY_VALUES = new Set([
  "CV_TEMPLATE",
  "PORTFOLIO",
  "EBOOK",
  "FICHE_REVISION",
  "NOTION_TEMPLATE",
  "EXCEL_TEMPLATE",
  "UI_KIT",
])

const parseNumber = (value) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

export const createMarketplaceItem = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      price,
      currency,
      previewImageUrl,
      fileUrl,
    } = req.body

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" })
    }
    if (!CATEGORY_VALUES.has(category)) {
      return res.status(400).json({ message: "Invalid category" })
    }
    const priceValue = parseNumber(price)
    if (priceValue === null || priceValue < 0) {
      return res.status(400).json({ message: "Invalid price" })
    }

    const item = await prisma.marketplaceItem.create({
      data: {
        title,
        description,
        category,
        price: priceValue,
        currency: currency || "XOF",
        previewImageUrl: previewImageUrl || null,
        fileUrl: fileUrl || null,
        sellerId: req.user?.userId || null,
      },
    })

    res.status(201).json(item)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getMarketplaceItems = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, includeInactive } = req.query

    const where = {}
    const isAdmin = req.user?.role === "ADMIN"

    if (!(includeInactive === "1" && isAdmin)) {
      where.isActive = true
    }

    if (category && CATEGORY_VALUES.has(category)) {
      where.category = category
    }

    const minValue = parseNumber(minPrice)
    const maxValue = parseNumber(maxPrice)

    if (minValue !== null || maxValue !== null) {
      where.price = {}
      if (minValue !== null) where.price.gte = minValue
      if (maxValue !== null) where.price.lte = maxValue
    }

    if (search) {
      where.OR = [
        { title: { contains: String(search), mode: "insensitive" } },
        { description: { contains: String(search), mode: "insensitive" } },
      ]
    }

    const items = await prisma.marketplaceItem.findMany({
      where,
      orderBy: { createdAt: "desc" },
    })

    res.json(items)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getMarketplaceItemById = async (req, res) => {
  try {
    const { id } = req.params
    const item = await prisma.marketplaceItem.findUnique({
      where: { id: Number(id) },
    })

    if (!item) {
      return res.status(404).json({ message: "Item not found" })
    }

    if (!item.isActive && req.user?.role !== "ADMIN") {
      return res.status(404).json({ message: "Item not found" })
    }

    res.json(item)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const updateMarketplaceItemStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { isActive } = req.body

    if (typeof isActive !== "boolean") {
      return res.status(400).json({ message: "isActive must be a boolean" })
    }

    const item = await prisma.marketplaceItem.update({
      where: { id: Number(id) },
      data: { isActive },
    })

    res.json(item)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const purchaseMarketplaceItem = async (req, res) => {
  try {
    const { id } = req.params
    const item = await prisma.marketplaceItem.findUnique({
      where: { id: Number(id) },
    })

    if (!item || !item.isActive) {
      return res.status(404).json({ message: "Item not available" })
    }

    let buyerEmail = String(req.body?.buyerEmail || "").trim().toLowerCase()
    let buyerId = null

    if (req.user?.userId) {
      const user = await prisma.user.findUnique({
        where: { id: req.user.userId },
        select: { id: true, email: true },
      })
      if (user) {
        buyerId = user.id
        buyerEmail = user.email
      }
    }

    if (!buyerEmail) {
      return res.status(400).json({ message: "buyerEmail is required" })
    }

    const order = await prisma.marketplaceOrder.create({
      data: {
        itemId: item.id,
        buyerId,
        buyerEmail,
        price: item.price,
        currency: item.currency,
        status: "PENDING",
      },
    })

    res.status(201).json({ order, item })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
