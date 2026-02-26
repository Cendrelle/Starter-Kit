import prisma from "../prisma/client.js";

export const getOverviewStats = async (req, res) => {
  try {
    const [
      totalRaisedAgg,
      totalUsers,
      totalCandidates,
      jobsTotal,
      jobsActive,
      applicationsTotal,
      applicationsPending,
      applicationsAccepted,
      applicationsRejected,
      pcRequestsTotal,
      pcRequestsPending,
      pcRequestsAccepted,
      pcRequestsRejected,
      inventoryTotal,
      inventoryInStock,
      inventoryDelivered,
      pcDonations,
      commonPoolAgg,
    ] = await Promise.all([
      prisma.donation.aggregate({ _sum: { amount: true } }),
      prisma.user.count(),
      prisma.user.count({ where: { role: "CANDIDATE" } }),
      prisma.job.count(),
      prisma.job.count({ where: { isActive: true } }),
      prisma.jobApplication.count(),
      prisma.jobApplication.count({ where: { status: "PENDING" } }),
      prisma.jobApplication.count({ where: { status: "ACCEPTED" } }),
      prisma.jobApplication.count({ where: { status: "REJECTED" } }),
      prisma.pCRequest.count(),
      prisma.pCRequest.count({ where: { confirmationStatus: "PENDING" } }),
      prisma.pCRequest.count({ where: { confirmationStatus: "ACCEPTED" } }),
      prisma.pCRequest.count({ where: { confirmationStatus: "REJECTED" } }),
      prisma.inventory.count(),
      prisma.inventory.count({ where: { status: "IN_STOCK" } }),
      prisma.inventory.count({ where: { status: "DELIVERED" } }),
      prisma.donation.findMany({
        where: { type: { in: ["FULL_PC", "PARTIAL_PC"] } },
        select: { type: true, percentage: true },
      }),
      prisma.donation.aggregate({
        where: { type: "COMMON_POOL" },
        _sum: { amount: true },
      }),
    ]);

    let pcFromTargetedDonations = 0;
    pcDonations.forEach((donation) => {
      if (donation.type === "FULL_PC") pcFromTargetedDonations += 1;
      if (donation.type === "PARTIAL_PC") pcFromTargetedDonations += 0.6;
    });

    const basicPcPrice = 150000;
    const commonPoolAmount = commonPoolAgg._sum.amount || 0;
    const pcFromCommonPool = Math.floor(commonPoolAmount / basicPcPrice);
    const totalPcFinanced = pcFromTargetedDonations + pcFromCommonPool;

    return res.json({
      donations: {
        totalRaised: totalRaisedAgg._sum.amount || 0,
        currency: "XOF",
      },
      users: {
        total: totalUsers,
        candidates: totalCandidates,
      },
      jobs: {
        total: jobsTotal,
        active: jobsActive,
      },
      applications: {
        total: applicationsTotal,
        pending: applicationsPending,
        accepted: applicationsAccepted,
        rejected: applicationsRejected,
      },
      pcRequests: {
        total: pcRequestsTotal,
        pending: pcRequestsPending,
        accepted: pcRequestsAccepted,
        rejected: pcRequestsRejected,
      },
      inventory: {
        total: inventoryTotal,
        inStock: inventoryInStock,
        delivered: inventoryDelivered,
      },
      impact: {
        totalPcFinanced,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur recuperation statistiques" });
  }
};
