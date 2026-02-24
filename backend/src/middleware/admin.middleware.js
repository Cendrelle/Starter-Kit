const adminMiddleware = (req, res, next) => {
  try {
    // Vérifier si user existe (authMiddleware doit passer avant)
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    // Vérifier le rôle
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        message: "Access denied. Admin only."
      });
    }

    next();

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error"
    });
  }
};

export default adminMiddleware;