// controllers/jobApplication.controller.js

import prisma from "../prisma/client.js"

export const applyToJob = async (req, res) => {
  try {
    const jobId = parseInt(req.params.id)
    const { fullName, email, phone, message } = req.body

    const job = await prisma.job.findUnique({
      where: { id: jobId }
    })

    if (!job || !job.isActive) {
      return res.status(404).json({ message: "Offre non disponible" })
    }
    const existingApplication = await prisma.jobApplication.findUnique({
        where: {
            jobId_email: {
            jobId,
            email
            }
        }
    })

    if (existingApplication) {
        return res.status(400).json({
            message: "Vous avez déjà postulé à cette offre"
        })
    }

    const application = await prisma.jobApplication.create({
      data: {
        jobId,
        fullName,
        email,
        phone,
        message
      }
    })

    return res.status(201).json({
      message: "Candidature envoyée avec succès",
      application
    })

  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur" })
  }
}

export const getAllJobApplications = async (req, res) => {
  try {
    const applications = await prisma.jobApplication.findMany({
      include: {
        job: {
          select: {
            id: true,
            title: true,
            companyName: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return res.status(200).json(applications)

  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur" })
  }
}

import { JobApplicationStatus } from "@prisma/client"

export const updateJobApplicationStatus = async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const { status } = req.body

    if (!["ACCEPTED", "REJECTED"].includes(status)) {
      return res.status(400).json({ message: "Statut invalide" })
    }

    const updated = await prisma.jobApplication.update({
      where: { id },
      data: {
        status: JobApplicationStatus[status]
      }
    })

    return res.status(200).json({
      message: "Statut mis à jour",
      updated
    })

  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur" })
  }
}