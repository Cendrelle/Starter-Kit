import { PC_Category } from './types';
import { eurosToFCFA, formatFCFA } from './currency';

// Conversion des prix en FCFA
const PC_PRICES_FCFA = {
  basic: eurosToFCFA(250),
  standard: eurosToFCFA(450),
  premium: eurosToFCFA(650)
};

const STUDENT_SHARES_FCFA = {
  basic: eurosToFCFA(100),
  standard: eurosToFCFA(180),
  premium: eurosToFCFA(260)
};

export const PC_CATEGORIES: Record<PC_Category, {
  name: string;
  description: string;
  specs: string[];
  price: number;
  priceFormatted: string;
  studentShare: number;
  studentShareFormatted: string;
  image: string;
  color: string;
}> = {
  basic: {
    name: 'PC Basic',
    description: 'Idéal pour les tâches essentielles : navigation, traitement de texte, recherches',
    specs: [
      'Processeur Intel Celeron / AMD equivalent',
      '4GB RAM',
      '128GB SSD',
      'Écran 14" HD',
      'Batterie 6h',
      'Windows 11 / Linux'
    ],
    price: PC_PRICES_FCFA.basic,
    priceFormatted: formatFCFA(PC_PRICES_FCFA.basic),
    studentShare: STUDENT_SHARES_FCFA.basic,
    studentShareFormatted: formatFCFA(STUDENT_SHARES_FCFA.basic),
    image: '/images/pc-basic.jpg',
    color: 'blue'
  },
  standard: {
    name: 'PC Standard',
    description: 'Parfait pour le développement web, les projets universitaires et la multitâche',
    specs: [
      'Processeur Intel i3 / Ryzen 3',
      '8GB RAM',
      '256GB SSD',
      'Écran 15.6" Full HD',
      'Batterie 8h',
      'Windows 11 Pro'
    ],
    price: PC_PRICES_FCFA.standard,
    priceFormatted: formatFCFA(PC_PRICES_FCFA.standard),
    studentShare: STUDENT_SHARES_FCFA.standard,
    studentShareFormatted: formatFCFA(STUDENT_SHARES_FCFA.standard),
    image: '/images/pc-standard.jpg',
    color: 'green'
  },
  premium: {
    name: 'PC Premium',
    description: 'Pour les développeurs, designers et projets exigeants',
    specs: [
      'Processeur Intel i5 / Ryzen 5',
      '16GB RAM',
      '512GB SSD NVMe',
      'Écran 15.6" Full HD IPS',
      'Batterie 10h',
      'Windows 11 Pro + Office'
    ],
    price: PC_PRICES_FCFA.premium,
    priceFormatted: formatFCFA(PC_PRICES_FCFA.premium),
    studentShare: STUDENT_SHARES_FCFA.premium,
    studentShareFormatted: formatFCFA(STUDENT_SHARES_FCFA.premium),
    image: '/images/pc-premium.jpg',
    color: 'purple'
  }
};

export const DONATION_AMOUNTS_FCFA = [5000, 10000, 25000, 50000, 100000, 250000]; // Équivalents FCFA

export const JOB_TAGS = [
  'Développement Web',
  'Marketing Digital',
  'Design Graphique',
  'Community Management',
  'Data Analysis',
  'Gestion de Projet',
  'Rédaction Web',
  'Support Technique',
  'Vente',
  'Comptabilité',
  'Ressources Humaines',
  'Logistique'
];

export const LOCATIONS_BENIN = [
  'Cotonou',
  'Porto-Novo',
  'Parakou',
  'Abomey-Calavi',
  'Bohicon',
  'Lokossa',
  'Ouidah',
  'Natitingou'
];

export const CONTRACT_TYPES = [
  { value: 'internship', label: 'Stage' },
  { value: 'full-time', label: 'CDI' },
  { value: 'part-time', label: 'Temps partiel' },
  { value: 'freelance', label: 'Freelance' }
];

// Données simulées pour le frontend (en FCFA)
export const MOCK_STATS = {
  totalPCs: 347,
  totalDonations: eurosToFCFA(156780), // Conversion en FCFA
  totalJobs: 89,
  totalCandidates: 523,
  pcsDistributed: 347,
  targetPCs: 1000
};

export const MOCK_DONORS = [
  { id: '1', name: 'Jean Dupont', amount: eurosToFCFA(150), isAnonymous: false, createdAt: new Date().toISOString() },
  { id: '2', name: 'Anonyme', amount: eurosToFCFA(50), isAnonymous: true, createdAt: new Date().toISOString() },
  { id: '3', name: 'Tech Corp', amount: eurosToFCFA(1000), isAnonymous: false, createdAt: new Date().toISOString() },
  { id: '4', name: 'Marie Claire', amount: eurosToFCFA(75), isAnonymous: false, createdAt: new Date().toISOString() },
  { id: '5', name: 'Anonyme', amount: eurosToFCFA(25), isAnonymous: true, createdAt: new Date().toISOString() },
  { id: '6', name: 'Benin Telecom', amount: eurosToFCFA(500), isAnonymous: false, createdAt: new Date().toISOString() },
];

export const MOCK_CAROUSEL_IMAGES = [
  {
    id: '1',
    url: '/images/carousel/hero-1.jpg',
    title: 'Autonomisons 1000 diplômés',
    description: 'Chaque don finance un ordinateur pour un jeune méritant',
    link: '/donation',
    order: 1,
    active: true
  },
  {
    id: '2',
    url: '/images/carousel/hero-2.jpg',
    title: 'Trouvez votre stage idéal',
    description: 'Des centaines d\'offres de stages disponibles',
    link: '/jobs',
    order: 2,
    active: true
  },
  {
    id: '3',
    url: '/images/carousel/hero-3.jpg',
    title: 'Ils ont réussi grâce à vous',
    description: 'Découvrez les histoires de nos bénéficiaires',
    link: '/impact',
    order: 3,
    active: true
  }
];

export const MOCK_PARTNERS = [
  { id: '1', name: 'TechStart Benin', logo: '/images/partners/partner-1.png', website: 'https://techstart.bj' },
  { id: '2', name: 'Digital Agency', logo: '/images/partners/partner-2.png', website: 'https://digitalagency.bj' },
  { id: '3', name: 'E-commerce Benin', logo: '/images/partners/partner-3.png', website: 'https://ecommerce.bj' },
  { id: '4', name: 'Benin Telecom', logo: '/images/partners/partner-4.png', website: 'https://benintelecom.bj' },
  { id: '5', name: 'MTN Benin', logo: '/images/partners/partner-5.png', website: 'https://mtn.bj' },
  { id: '6', name: 'Moov Africa', logo: '/images/partners/partner-6.png', website: 'https://moov.bj' },
];