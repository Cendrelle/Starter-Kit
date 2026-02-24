import prisma from "../prisma/client.js";
import { PC_PRICES } from "../config/pcPrices.js";

export const createPcDonation = async (req, res) => {
  try {
    const {
      fullName,
      email,
      pcType,
      percentage,
      transactionId,
      paymentMethod,
      currency,
    } = req.body;

    if (!pcType || !percentage || !transactionId) {
      return res.status(400).json({
        error: "pcType, percentage et transactionId sont requis",
      });
    }

    if (![60, 100].includes(percentage)) {
      return res.status(400).json({
        error: "Le pourcentage doit être 60 ou 100",
      });
    }

    const basePrice = PC_PRICES[pcType];

    if (!basePrice) {
      return res.status(400).json({
        error: "Type de PC invalide",
      });
    }

    // 🔥 Calcul automatique du montant
    const amount = (basePrice * percentage) / 100;

    const donation = await prisma.donation.create({
      data: {
        fullName,
        email,
        amount,
        currency: currency || "XOF",
        type: percentage === 100 ? "FULL_PC" : "PARTIAL_PC",
        pcType,
        percentage,
        transactionId,
        paymentMethod,
        status: "SUCCESS",
      },
    });

    res.status(201).json(donation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur donation PC" });
  }
};

export const createCommonDonation = async (req, res) => {
  try {
    const {
      fullName,
      email,
      amount,
      transactionId,
      paymentMethod,
      currency,
    } = req.body;

    if (!amount || !transactionId) {
      return res.status(400).json({
        error: "amount et transactionId sont requis",
      });
    }

    const donation = await prisma.donation.create({
      data: {
        fullName,
        email,
        amount,
        currency: currency || "XOF",
        type: "COMMON_POOL",
        pcType: null,
        percentage: null,
        transactionId,
        paymentMethod,
        status: "SUCCESS",
      },
    });

    res.status(201).json(donation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur donation commune" });
  }
};

export const getDonationStats = async (req, res) => {
  try {
    const yearlyTarget = 1000;

    // 1️⃣ Récupérer toutes les donations PC
    const pcDonations = await prisma.donation.findMany({
      where: {
        type: {
          in: ["FULL_PC", "PARTIAL_PC"],
        },
      },
      select: {
        type: true,
        percentage: true,
      },
    });

    // 2️⃣ Calculer PC financés
    let pcCount = 0;

    pcDonations.forEach((donation) => {
      if (donation.type === "FULL_PC") {
        pcCount += 1;
      } else if (donation.type === "PARTIAL_PC") {
        pcCount += 0.6;
      }
    });

    // 3️⃣ Ajouter cagnotte commune
    const totalCommon = await prisma.donation.aggregate({
      where: { type: "COMMON_POOL" },
      _sum: { amount: true },
    });

    const commonAmount = totalCommon._sum.amount || 0;

    const basicPrice = 150000;

    const pcFromCommon = Math.floor(commonAmount / basicPrice);

    const totalPcFinanced = pcCount + pcFromCommon;

    const progressPercentage =
      (totalPcFinanced / yearlyTarget) * 100;

    // 4️⃣ Total levé
    const totalRaised = await prisma.donation.aggregate({
      _sum: { amount: true },
    });

    res.json({
      totalRaised: totalRaised._sum.amount || 0,
      totalPcFinanced,
      yearlyTarget,
      progressPercentage: Number(progressPercentage.toFixed(2)),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur récupération stats" });
  }
};