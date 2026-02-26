import { CarouselImage, Job, JobApplication, UserRole } from '@/utils/types';
import { MOCK_CAROUSEL_IMAGES } from '@/utils/constants';

export type Language = 'fr' | 'en';
export type DecisionStatus = 'pending' | 'accepted' | 'rejected';

export interface CandidateSession {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
}

export interface AdminSession {
  isLoggedIn: boolean;
  email: string;
}

export interface PcRequestRecord {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  category: 'basic' | 'standard' | 'premium';
  reason: string;
  professionalGoal: string;
  motivation: string;
  createdAt: string;
  decision: DecisionStatus;
}

export interface JobRecord extends Job {
  recruiterEmail: string;
}

export interface FrontendStore {
  language: Language;
  admin: AdminSession;
  candidateSession: CandidateSession | null;
  carouselImages: CarouselImage[];
  pcRequests: PcRequestRecord[];
  jobs: JobRecord[];
  applications: JobApplication[];
}

const STORE_KEY = 'starterkit_frontend_store_v2';
const STORE_EVENT = 'starterkit-store-updated';

const defaultState: FrontendStore = {
  language: 'fr',
  admin: { isLoggedIn: false, email: '' },
  candidateSession: null,
  carouselImages: MOCK_CAROUSEL_IMAGES,
  pcRequests: [
    {
      id: 'pc-1',
      candidateId: 'cand-1',
      candidateName: 'Kossi Ahouandjinou',
      candidateEmail: 'kossi@example.com',
      candidatePhone: '+229 01 90 22 33',
      category: 'standard',
      reason: 'Je n ai pas de machine personnelle pour coder.',
      professionalGoal: 'Devenir developpeur full stack.',
      motivation: 'Un PC me permettra de suivre les offres et de postuler.',
      createdAt: '2026-01-10T08:00:00.000Z',
      decision: 'pending',
    },
    {
      id: 'pc-2',
      candidateId: 'cand-2',
      candidateName: 'Aicha Sanni',
      candidateEmail: 'aicha@example.com',
      candidatePhone: '+229 01 73 45 88',
      category: 'basic',
      reason: 'Je partage actuellement un ordinateur en cyber cafe.',
      professionalGoal: 'Obtenir un stage en support IT.',
      motivation: 'Je veux postuler rapidement et produire mon portfolio.',
      createdAt: '2026-01-15T10:30:00.000Z',
      decision: 'pending',
    },
  ],
  jobs: [
    {
      id: 'job-1',
      title: 'Stagiaire Developpeur Frontend React',
      company: 'Job Booster',
      description: 'Participation au developpement de plateformes web.',
      requirements: ['React', 'TypeScript', 'Git'],
      tags: ['Developpement Web', 'React', 'TypeScript'],
      location: 'Cotonou',
      contractType: 'internship',
      deadline: new Date('2026-04-20').toISOString(),
      status: 'active',
      createdAt: '2026-01-08T09:00:00.000Z',
      recruiterEmail: 'recrutement@jobbooster.bj',
      salary: '120 000 FCFA/mois',
    },
    {
      id: 'job-2',
      title: 'Stagiaire Community Manager',
      company: 'Agence Impact',
      description: 'Gestion de contenus sociaux et campagnes digitales.',
      requirements: ['Canva', 'Copywriting', 'Organisation'],
      tags: ['Marketing Digital', 'Community Management'],
      location: 'Porto-Novo',
      contractType: 'internship',
      deadline: new Date('2026-05-10').toISOString(),
      status: 'active',
      createdAt: '2026-01-12T11:15:00.000Z',
      recruiterEmail: 'hr@agenceimpact.bj',
      salary: '90 000 FCFA/mois',
    },
  ],
  applications: [],
};

function cloneStore(store: FrontendStore): FrontendStore {
  return {
    ...store,
    admin: { ...store.admin },
    candidateSession: store.candidateSession ? { ...store.candidateSession } : null,
    carouselImages: store.carouselImages.map((image) => ({ ...image })),
    pcRequests: store.pcRequests.map((request) => ({ ...request })),
    jobs: store.jobs.map((job) => ({
      ...job,
      requirements: [...job.requirements],
      tags: [...job.tags],
    })),
    applications: store.applications.map((application) => ({ ...application })),
  };
}

export function getDefaultFrontendStore(): FrontendStore {
  return cloneStore(defaultState);
}

function isBrowser() {
  return typeof window !== 'undefined';
}

export function getFrontendStore(): FrontendStore {
  if (!isBrowser()) return getDefaultFrontendStore();

  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    if (!raw) return getDefaultFrontendStore();

    const parsed = JSON.parse(raw) as Partial<FrontendStore>;
    const parsedCarousel = Array.isArray(parsed.carouselImages) ? parsed.carouselImages : [];
    const parsedPcRequests = Array.isArray(parsed.pcRequests) ? parsed.pcRequests : [];
    const parsedJobs = Array.isArray(parsed.jobs) ? parsed.jobs : [];
    const parsedApplications = Array.isArray(parsed.applications) ? parsed.applications : [];

    return {
      ...getDefaultFrontendStore(),
      ...parsed,
      admin: { ...defaultState.admin, ...(parsed.admin || {}) },
      candidateSession: parsed.candidateSession || null,
      carouselImages:
        parsedCarousel.length > 0
          ? parsedCarousel
              .filter((item) => item && typeof item === 'object')
              .map((item, index) => ({
                id: typeof item.id === 'string' ? item.id : `carousel-${index + 1}`,
                url: typeof item.url === 'string' ? item.url : '',
                title: typeof item.title === 'string' ? item.title : '',
                description: typeof item.description === 'string' ? item.description : '',
                link: typeof item.link === 'string' ? item.link : '/donation',
                order: typeof item.order === 'number' ? item.order : index + 1,
                active: typeof item.active === 'boolean' ? item.active : true,
              }))
              .filter((item) => Boolean(item.url))
          : defaultState.carouselImages,
      pcRequests:
        parsedPcRequests.length > 0
          ? parsedPcRequests
              .filter((item) => item && typeof item === 'object')
              .map((item, index) => ({
                id: typeof item.id === 'string' ? item.id : `pc-${index + 1}`,
                candidateId: typeof item.candidateId === 'string' ? item.candidateId : '',
                candidateName: typeof item.candidateName === 'string' ? item.candidateName : '',
                candidateEmail: typeof item.candidateEmail === 'string' ? item.candidateEmail : '',
                candidatePhone: typeof item.candidatePhone === 'string' ? item.candidatePhone : '',
                category: item.category === 'basic' || item.category === 'standard' || item.category === 'premium' ? item.category : 'basic',
                reason: typeof item.reason === 'string' ? item.reason : '',
                professionalGoal: typeof item.professionalGoal === 'string' ? item.professionalGoal : '',
                motivation: typeof item.motivation === 'string' ? item.motivation : '',
                createdAt: typeof item.createdAt === 'string' ? item.createdAt : new Date('2026-01-01').toISOString(),
                decision: item.decision === 'accepted' || item.decision === 'rejected' ? item.decision : 'pending',
              }))
          : defaultState.pcRequests,
      jobs:
        parsedJobs.length > 0
          ? parsedJobs
              .filter((item) => item && typeof item === 'object')
              .map((item, index) => ({
                id: typeof item.id === 'string' ? item.id : `job-${index + 1}`,
                title: typeof item.title === 'string' ? item.title : 'Offre de stage',
                company: typeof item.company === 'string' ? item.company : '',
                description: typeof item.description === 'string' ? item.description : '',
                requirements: Array.isArray(item.requirements) ? item.requirements.filter((v) => typeof v === 'string') : [],
                tags: Array.isArray(item.tags) ? item.tags.filter((v) => typeof v === 'string') : [],
                location: typeof item.location === 'string' ? item.location : '',
                contractType:
                  item.contractType === 'full-time' || item.contractType === 'part-time' || item.contractType === 'internship' || item.contractType === 'freelance'
                    ? item.contractType
                    : 'internship',
                salary: typeof item.salary === 'string' ? item.salary : undefined,
                deadline: typeof item.deadline === 'string' ? item.deadline : new Date('2026-12-31').toISOString(),
                status: item.status === 'active' || item.status === 'expired' || item.status === 'draft' ? item.status : 'active',
                createdAt: typeof item.createdAt === 'string' ? item.createdAt : new Date('2026-01-01').toISOString(),
                recruiterEmail: typeof item.recruiterEmail === 'string' ? item.recruiterEmail : 'admin@starterkit.bj',
              }))
          : defaultState.jobs,
      applications:
        parsedApplications.length > 0
          ? parsedApplications
              .filter((item) => item && typeof item === 'object')
              .map((item, index) => ({
                id: typeof item.id === 'string' ? item.id : `app-${index + 1}`,
                jobId: typeof item.jobId === 'string' ? item.jobId : '',
                userId: typeof item.userId === 'string' ? item.userId : '',
                fullName: typeof item.fullName === 'string' ? item.fullName : '',
                email: typeof item.email === 'string' ? item.email : '',
                phone: typeof item.phone === 'string' ? item.phone : '',
                cvUrl: typeof item.cvUrl === 'string' ? item.cvUrl : '',
                coverLetter: typeof item.coverLetter === 'string' ? item.coverLetter : '',
                status:
                  item.status === 'reviewed' || item.status === 'accepted' || item.status === 'rejected' ? item.status : 'pending',
                appliedAt: typeof item.appliedAt === 'string' ? item.appliedAt : new Date('2026-01-01').toISOString(),
              }))
          : defaultState.applications,
      language: parsed.language === 'en' ? 'en' : 'fr',
    };
  } catch {
    return getDefaultFrontendStore();
  }
}

export function setFrontendStore(next: FrontendStore) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORE_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent(STORE_EVENT));
  } catch {
    // Ignore persistence failures (private mode, blocked storage).
  }
}

export function updateFrontendStore(updater: (prev: FrontendStore) => FrontendStore) {
  const prev = getFrontendStore();
  const next = updater(prev);
  setFrontendStore(next);
}

export function subscribeFrontendStore(onChange: () => void) {
  if (!isBrowser()) return () => {};

  const handleStorage = (event: StorageEvent) => {
    if (!event.key || event.key === STORE_KEY) onChange();
  };
  const handleCustom = () => onChange();

  window.addEventListener('storage', handleStorage);
  window.addEventListener(STORE_EVENT, handleCustom);

  return () => {
    window.removeEventListener('storage', handleStorage);
    window.removeEventListener(STORE_EVENT, handleCustom);
  };
}
