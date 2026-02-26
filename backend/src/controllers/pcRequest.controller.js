import prisma from "../prisma/client.js";

//
// 👤 CANDIDAT
//

export const createPcRequest = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { justificationText, pcType, futureProject } = req.body;

    if (!["BASIC", "STANDARD", "PREMIUM"].includes(pcType)) {
      return res.status(400).json({
        message: "Invalid PC type"
      });
    }

    if (!futureProject || futureProject.length < 20) {
      return res.status(400).json({
        message: "Future project description is too short"
      });
    }

    // Vérifier si une demande existe déjà
    const existingRequest = await prisma.pCRequest.findUnique({
      where: { userId }
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "You already submitted a request"
      });
    }

    const request = await prisma.pCRequest.create({
      data: {
        userId,
        justificationText,
        pcType,
        futureProject
      }
    });

    res.status(201).json(request);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyPcRequest = async (req, res) => {
  try {
    const userId = req.user.userId;

    const request = await prisma.pCRequest.findUnique({
      where: { userId },
      include: {
        assignedPc: true
      }
    });

    res.json(request);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


//
// 🛠 ADMIN
//

export const getAllPcRequests = async (req, res) => {
  try {
    const requests = await prisma.pCRequest.findMany({
        include: {
            user: {
            select: {
                id: true,
                email: true,
                profile: {
                select: {
                    firstName: true,
                    lastName: true
                }
                }
            }
            },
            assignedPc: true
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    res.json(requests);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updatePcRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // APPROVED ou REJECTED

    if (!["ACCEPTED", "REJECTED"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status"
      });
    }

    const request = await prisma.pCRequest.findUnique({
      where: { id: parseInt(id) }
    });

    if (!request) {
      return res.status(404).json({
        message: "Request not found"
      });
    }

    if (request.confirmationStatus !== "PENDING") {
      return res.status(400).json({
        message: "Request already processed"
      });
    }

    const updated = await prisma.pCRequest.update({
      where: { id: parseInt(id) },
      data: {
        confirmationStatus: status
      }
    });

    res.json(updated);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPcRequestById = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid request id" });
    }

    const request = await prisma.pCRequest.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
                phone: true,
              },
            },
          },
        },
        assignedPc: true,
      },
    });

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    return res.json(request);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
