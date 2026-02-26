import { JobRecord, PcRequestRecord } from "@/utils/frontendStore";
import { JobApplication } from "@/utils/types";

type BackendJob = {
  id: number;
  title: string;
  companyName: string;
  description: string;
  location: string | null;
  isActive: boolean;
  createdAt: string;
};

type BackendJobApplication = {
  id: number;
  jobId: number;
  fullName: string;
  email: string;
  phone?: string | null;
  message?: string | null;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: string;
  job?: {
    id: number;
    title: string;
    companyName: string;
    location?: string | null;
  };
};

type BackendPcRequest = {
  id: number;
  pcType: "BASIC" | "STANDARD" | "PREMIUM";
  justificationText: string;
  futureProject: string;
  confirmationStatus: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: string;
  user?: {
    id: number;
    email: string;
    profile?: {
      firstName?: string;
      lastName?: string;
    } | null;
  };
};

export function mapBackendJobToJobRecord(job: BackendJob): JobRecord {
  return {
    id: String(job.id),
    title: job.title,
    company: job.companyName,
    description: job.description,
    requirements: [],
    tags: [],
    location: job.location || "N/A",
    contractType: "internship",
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
    status: job.isActive ? "active" : "draft",
    createdAt: job.createdAt,
    recruiterEmail: "admin@starterkit.bj",
  };
}

function mapPcTypeToCategory(pcType: BackendPcRequest["pcType"]): PcRequestRecord["category"] {
  if (pcType === "BASIC") return "basic";
  if (pcType === "PREMIUM") return "premium";
  return "standard";
}

function mapConfirmationStatusToDecision(
  status: BackendPcRequest["confirmationStatus"]
): PcRequestRecord["decision"] {
  if (status === "ACCEPTED") return "accepted";
  if (status === "REJECTED") return "rejected";
  return "pending";
}

export function mapBackendPcRequestToRecord(request: BackendPcRequest): PcRequestRecord {
  const firstName = request.user?.profile?.firstName || "";
  const lastName = request.user?.profile?.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim();

  return {
    id: String(request.id),
    candidateId: request.user ? String(request.user.id) : "",
    candidateName: fullName || "Candidate",
    candidateEmail: request.user?.email || "",
    candidatePhone: "",
    category: mapPcTypeToCategory(request.pcType),
    reason: request.justificationText,
    professionalGoal: request.futureProject,
    motivation: request.futureProject,
    createdAt: request.createdAt,
    decision: mapConfirmationStatusToDecision(request.confirmationStatus),
  };
}

export function mapBackendJobApplicationToRecord(application: BackendJobApplication): JobApplication {
  return {
    id: String(application.id),
    jobId: String(application.jobId),
    userId: application.email,
    fullName: application.fullName,
    email: application.email,
    phone: application.phone || "",
    cvUrl: "",
    coverLetter: application.message || "",
    status: application.status === "ACCEPTED" ? "accepted" : application.status === "REJECTED" ? "rejected" : "pending",
    appliedAt: application.createdAt,
  };
}
