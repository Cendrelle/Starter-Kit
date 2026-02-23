import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Récupérer le profil du candidat connecté
export const getProfile = async (req, res) => {
  try {
    console.log("req.user:", req.user);
    const profile = await prisma.application.findUnique({
      where: { userId: req.user.userId},
    });
    res.json(profile);
  } catch (err) {
    console.log("User ID:", req.user.userId);
    res.status(500).json({ error: err.message });
  }
};

// Mettre à jour le profil
export const updateProfile = async (req, res) => {
  try {
    const { fullName, phone, competences } = req.body;
    const cv = req.file ? req.file.path : undefined; 

    const updatedProfile = await prisma.application.upsert({
      where: { userId: req.user.userId },
      update: { fullName, phone, competences, ...(cv && { cv }) },
      create: { userId: req.user.userId, fullName, phone, competences, cv },
    });

    res.json(updatedProfile);
  } catch (err) {
    console.log("User ID:", req.user.userId);
    console.error("Error updating profile:", err);
    res.status(500).json({ error: err.message });
  }
};