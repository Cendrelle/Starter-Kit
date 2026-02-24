export type UserRole = 'candidate' | 'donor' | 'admin' | 'recruiter';

export type PC_Category = 'basic' | 'standard' | 'premium';

export type ApplicationStatus = 'pending' | 'reviewed' | 'accepted' | 'rejected';
export type PCRequestStatus = 'pending' | 'approved' | 'partially_funded' | 'fully_funded' | 'delivered';
export type JobStatus = 'active' | 'expired' | 'draft';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  createdAt: Date | string;
}

export interface Candidate extends User {
  role: 'candidate';
  diploma?: string;
  specialization?: string;
  graduationYear?: number;
  cvUrl?: string;
  motivation?: string;
  isEmployed: boolean;
  age?: number;
  location?: string;
  pcRequest?: PCRequest;
  applications?: JobApplication[];
}

export interface Donor extends User {
  role: 'donor';
  isAnonymous: boolean;
  organization?: string;
  totalDonated: number;
  donations?: Donation[];
}

export interface PCRequest {
  id: string;
  userId: string;
  category: PC_Category;
  reason: string;
  professionalGoal: string;
  status: PCRequestStatus;
  fundedAmount: number;
  totalAmount: number;
  documents: string[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Donation {
  id: string;
  donorId: string;
  donorName?: string;
  isAnonymous: boolean;
  amount: number;
  pcCategory?: PC_Category;
  pcQuantity?: number;
  isFullPayment: boolean;
  transactionId: string;
  createdAt: Date | string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  description: string;
  requirements: string[];
  tags: string[];
  location: string;
  contractType: 'full-time' | 'part-time' | 'internship' | 'freelance';
  salary?: string;
  deadline: Date | string;
  status: JobStatus;
  createdAt: Date | string;
  applications?: JobApplication[];
}

export interface JobApplication {
  id: string;
  jobId: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  cvUrl: string;
  coverLetter?: string;
  status: ApplicationStatus;
  appliedAt: Date | string;
}

export interface CarouselImage {
  id: string;
  url: string;
  title: string;
  description: string;
  link?: string;
  order: number;
  active: boolean;
}

export interface Partner {
  id: string;
  name: string;
  logo: string;
  website?: string;
}

export interface Stats {
  totalPCs: number;
  totalDonations: number;
  totalJobs: number;
  totalCandidates: number;
  pcsDistributed: number;
  targetPCs: number;
}