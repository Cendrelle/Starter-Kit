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

const STORE_KEY = 'starterkit_frontend_store_v1';
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
      createdAt: new Date().toISOString(),
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
      createdAt: new Date().toISOString(),
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
      createdAt: new Date().toISOString(),
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
      createdAt: new Date().toISOString(),
      recruiterEmail: 'hr@agenceimpact.bj',
      salary: '90 000 FCFA/mois',
    },
  ],
  applications: [],
};

function isBrowser() {
  return typeof window !== 'undefined';
}

export function getFrontendStore(): FrontendStore {
  if (!isBrowser()) return defaultState;

  const raw = window.localStorage.getItem(STORE_KEY);
  if (!raw) return defaultState;

  try {
    const parsed = JSON.parse(raw) as Partial<FrontendStore>;
    return {
      ...defaultState,
      ...parsed,
      admin: { ...defaultState.admin, ...(parsed.admin || {}) },
      candidateSession: parsed.candidateSession || null,
      carouselImages: parsed.carouselImages || defaultState.carouselImages,
      pcRequests: parsed.pcRequests || defaultState.pcRequests,
      jobs: parsed.jobs || defaultState.jobs,
      applications: parsed.applications || defaultState.applications,
      language: parsed.language || 'fr',
    };
  } catch {
    return defaultState;
  }
}

export function setFrontendStore(next: FrontendStore) {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(STORE_EVENT));
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
