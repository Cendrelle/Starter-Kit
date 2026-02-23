import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization

    if (!authHeader) {
    return res.status(401).json({ message: "No token provided" })
  }
    const token = authHeader.split(" ")[1]
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        console.log("Decoded token:", decoded);
        req.user = decoded
        next()
      } catch {
    res.status(401).json({ message: "Invalid token" })
  }
}

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" })
    }
    next()
  }
}

