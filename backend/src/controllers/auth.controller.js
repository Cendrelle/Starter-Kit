import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const register = async (req, res) => {
  try {
    const { email, password } = req.body
    const normalizedEmail = String(email || "").trim().toLowerCase()
        const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    })

    if (existingUser) {
      return res.status(400).json({ message: "Email already used" })
    }
        const hashedPassword = await bcrypt.hash(password, 10)
            const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash: hashedPassword
      }
    })
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    )
        res.status(201).json({ token })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const normalizedEmail = String(email || "").trim().toLowerCase()
        const user = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    })

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" })
    }
        const isMatch = await bcrypt.compare(password, user.passwordHash)

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" })
    }
        const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    )

    res.json({ token })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const me = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        role: true
      }
    })

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json(user)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
