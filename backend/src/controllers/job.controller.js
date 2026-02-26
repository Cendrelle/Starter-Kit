
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Créer une offre
export const createJob = async (req, res) => {
  const { title, companyName, description, location } = req.body
  try {
    const job = await prisma.job.create({
      data: { title, companyName, description, location },
    })
    res.json(job)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Lister toutes les offres
export const getJobs = async (req, res) => {
  const jobs = await prisma.job.findMany()
  res.json(jobs)
}

// Voir une offre par id
export const getJobById = async (req, res) => {
  const { id } = req.params
  const job = await prisma.job.findUnique({ where: { id: Number(id) } })
  if (!job) return res.status(404).json({ message: "Job not found" })
  res.json(job)
}

// Mettre à jour une offre
export const updateJob = async (req, res) => {
  const { id } = req.params
  const { title, companyName, description, location } = req.body
  try {
    const job = await prisma.job.update({
      where: { id: Number(id) },
      data: { title, companyName, description, location },
    })
    res.json(job)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Supprimer une offre
export const deleteJob = async (req, res) => {
  const { id } = req.params
  try {
    await prisma.job.delete({ where: { id: Number(id) } })
    res.json({ message: "Job deleted" })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const updateJobStatus = async (req, res) => {
  const { id } = req.params
  const { isActive } = req.body

  if (typeof isActive !== "boolean") {
    return res.status(400).json({ message: "isActive must be a boolean" })
  }

  try {
    const job = await prisma.job.update({
      where: { id: Number(id) },
      data: { isActive },
    })
    res.json(job)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
