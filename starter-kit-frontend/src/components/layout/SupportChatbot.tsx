import React, { useMemo, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

type Sender = 'bot' | 'user';

interface ChatMessage {
  id: number;
  sender: Sender;
  text: string;
}

interface FaqEntry {
  id: number;
  labelFr: string;
  labelEn: string;
  sampleQuestionsFr: string[];
  sampleQuestionsEn: string[];
  keywords: string[];
  answerFr: string;
  answerEn: string;
}

const DIRECTION_PHONE = '+229 01 23 45 67';
const FEATURED_QUESTION_IDS = [1, 3, 5, 9];
const MIN_MATCH_SCORE = 3;

const COMPLEXITY_HINTS = [
  'juridique',
  'legal',
  'avocat',
  'tribunal',
  'urgent',
  'plainte',
  'complexe',
  'remboursement',
  'refund',
  'litige',
  'technical issue',
];

const FAQ_ENTRIES: FaqEntry[] = [
  {
    id: 1,
    labelFr: 'Comment faire un don ?',
    labelEn: 'How can I donate?',
    sampleQuestionsFr: [
      'je veux faire un don',
      'comment contribuer',
      'ou payer pour aider',
    ],
    sampleQuestionsEn: ['i want to donate', 'how can i contribute', 'where can i pay'],
    keywords: ['don', 'donner', 'faire un don', 'payer', 'contribution', 'donate'],
    answerFr:
      'Pour faire un don, allez sur la page "Faire un don", choisissez la categorie de PC puis confirmez votre contribution.',
    answerEn:
      'To donate, open the "Donate" page, choose a PC category, then confirm your contribution.',
  },
  {
    id: 2,
    labelFr: 'Puis-je faire un don anonyme ?',
    labelEn: 'Can I donate anonymously?',
    sampleQuestionsFr: [
      'don anonyme possible',
      'je ne veux pas afficher mon nom',
      'puis je donner sans identite publique',
    ],
    sampleQuestionsEn: ['anonymous donation', 'hide my donor name', 'donate privately'],
    keywords: ['anonyme', 'anonymat', 'nom', 'confidentiel', 'anonymous', 'private'],
    answerFr:
      'Oui, vous pouvez faire un don discret. Selon le formulaire, vous pouvez eviter la publication de votre nom sur le mur des donateurs.',
    answerEn:
      'Yes, you can donate privately. Depending on the form options, you can avoid public name display on the donor wall.',
  },
  {
    id: 3,
    labelFr: 'Comment faire une demande de PC ?',
    labelEn: 'How do I request a PC?',
    sampleQuestionsFr: [
      'comment demander un ordinateur',
      'je veux faire une demande pc',
      'ou deposer mon dossier candidat',
    ],
    sampleQuestionsEn: ['how to request a laptop', 'how to submit my pc request', 'candidate file submission'],
    keywords: ['demande', 'pc', 'ordinateur', 'dossier', 'request'],
    answerFr:
      'Pour une demande de PC, connectez-vous comme candidat, ouvrez "Demander un PC" puis soumettez votre dossier complet.',
    answerEn:
      'To request a PC, sign in as a candidate, open "Request a PC", then submit your complete application.',
  },
  {
    id: 4,
    labelFr: 'Quels documents preparer pour une demande ?',
    labelEn: 'Which documents are needed for a request?',
    sampleQuestionsFr: [
      'documents pour dossier',
      'pieces a fournir',
      'quels justificatifs envoyer',
    ],
    sampleQuestionsEn: ['required documents', 'what files should i upload', 'application documents'],
    keywords: ['document', 'piece', 'justificatif', 'fichier', 'upload', 'cv'],
    answerFr:
      'Preparez un dossier complet et coherent (identite, profil et informations demandees dans le formulaire) pour accelerer la validation.',
    answerEn:
      'Prepare a complete and consistent file (identity, profile, and requested form information) to speed up validation.',
  },
  {
    id: 5,
    labelFr: 'Comment postuler a une offre ?',
    labelEn: 'How do I apply to an offer?',
    sampleQuestionsFr: [
      'comment candidater a un stage',
      'je veux postuler a une offre',
      'ou envoyer ma candidature',
    ],
    sampleQuestionsEn: ['how to apply for internship', 'submit application for a job', 'where to apply'],
    keywords: ['candidature', 'postuler', 'stage', 'offre', 'apply', 'job'],
    answerFr:
      'Pour candidater, allez dans "Offres de stage", choisissez une offre active puis soumettez votre candidature depuis votre espace candidat.',
    answerEn:
      'To apply, go to "Internship Offers", pick an active offer, then submit your application from your candidate space.',
  },
  {
    id: 6,
    labelFr: 'Puis-je postuler sans compte ?',
    labelEn: 'Can I apply without an account?',
    sampleQuestionsFr: [
      'postuler sans creer de compte',
      'candidature sans inscription',
      'pas de compte candidat',
    ],
    sampleQuestionsEn: ['apply without account', 'application without sign up', 'no candidate account'],
    keywords: ['sans compte', 'sans inscription', 'directement', 'apply directly'],
    answerFr:
      'Oui, certaines offres permettent de postuler directement sans creer de compte, puis votre dossier est traite dans le backoffice.',
    answerEn:
      'Yes, some offers allow direct applications without account creation, then your file is handled in backoffice.',
  },
  {
    id: 7,
    labelFr: 'Comment suivre le statut de ma demande ou candidature ?',
    labelEn: 'How can I track my request or application status?',
    sampleQuestionsFr: [
      'ou voir mon statut',
      'suivi de dossier',
      'demande en attente ou acceptee',
    ],
    sampleQuestionsEn: ['track my status', 'application progress', 'pending or accepted'],
    keywords: ['statut', 'suivi', 'en attente', 'accepte', 'refuse', 'status', 'pending'],
    answerFr:
      'Consultez votre espace candidat pour voir les statuts de vos demandes et candidatures: En attente, Accepte ou Refuse.',
    answerEn:
      'Check your candidate space to track statuses: Pending, Accepted, or Rejected.',
  },
  {
    id: 8,
    labelFr: 'Combien de temps prend la validation ?',
    labelEn: 'How long does validation take?',
    sampleQuestionsFr: [
      'delai de validation',
      'combien de jours pour reponse',
      'temps de traitement dossier',
    ],
    sampleQuestionsEn: ['validation delay', 'how long for review', 'processing time'],
    keywords: ['validation', 'statut', 'delai', 'attente', 'review'],
    answerFr:
      'La validation depend du volume de dossiers. Surveillez votre statut dans votre espace: En attente, Accepte ou Refuse.',
    answerEn:
      'Validation depends on current workload. Track your status in your account: Pending, Accepted, or Rejected.',
  },
  {
    id: 9,
    labelFr: 'Ou trouver la cagnotte commune ?',
    labelEn: 'Where is the common fund page?',
    sampleQuestionsFr: [
      'cagnotte commune',
      'ou est la page fund',
      'participer a la collecte globale',
    ],
    sampleQuestionsEn: ['common fund page', 'global campaign donation', 'where is fundraiser'],
    keywords: ['cagnotte', 'commune', 'fund', 'collecte', 'campagne'],
    answerFr:
      'La page "Cagnotte commune" est accessible depuis le menu principal pour contribuer a la collecte globale.',
    answerEn:
      'The "Common Fund" page is available from the main menu for global campaign contributions.',
  },
  {
    id: 10,
    labelFr: 'Ou voir l impact du programme ?',
    labelEn: 'Where can I view program impact?',
    sampleQuestionsFr: [
      'je veux voir les resultats',
      'stats impact',
      'transparence des dons',
    ],
    sampleQuestionsEn: ['impact stats', 'program results', 'donation transparency'],
    keywords: ['impact', 'resultats', 'transparence', 'stats', 'stories'],
    answerFr:
      'Consultez la page "Impact" pour voir les indicateurs, la transparence et les histoires de reussite.',
    answerEn:
      'Check the "Impact" page for metrics, transparency, and success stories.',
  },
  {
    id: 11,
    labelFr: 'Comment changer la langue du site ?',
    labelEn: 'How can I change the site language?',
    sampleQuestionsFr: [
      'mettre en anglais',
      'switch en francais',
      'changer langue interface',
    ],
    sampleQuestionsEn: ['switch language', 'change to french', 'change to english'],
    keywords: ['langue', 'language', 'fr', 'en', 'anglais', 'francais'],
    answerFr:
      'Utilisez le selecteur FR/EN dans l interface pour basculer instantanement entre les langues.',
    answerEn:
      'Use the FR/EN language switcher in the interface to change language instantly.',
  },
  {
    id: 12,
    labelFr: 'J ai un probleme de connexion, que faire ?',
    labelEn: 'I have a login issue, what should I do?',
    sampleQuestionsFr: [
      'impossible de me connecter',
      'probleme login candidat',
      'acces compte bloque',
    ],
    sampleQuestionsEn: ['cannot sign in', 'login issue', 'account access problem'],
    keywords: ['connexion', 'login', 'compte', 'mot de passe', 'acces', 'sign in'],
    answerFr:
      'Verifiez vos identifiants puis reessayez. Si le probleme persiste, contactez la direction pour verification de votre compte.',
    answerEn:
      'Check your credentials and retry. If the issue persists, contact management for account verification.',
  },
];

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function isComplexQuestion(normalizedQuestion: string, wordCount: number): boolean {
  if (wordCount >= 22) return true;
  return COMPLEXITY_HINTS.some((hint) => normalizedQuestion.includes(hint));
}

function toTokenSet(text: string): Set<string> {
  return new Set(
    normalizeText(text)
      .split(/\s+/)
      .filter((token) => token.length >= 3)
  );
}

function countCommonTokens(first: Set<string>, second: Set<string>): number {
  let count = 0;
  first.forEach((token) => {
    if (second.has(token)) count += 1;
  });
  return count;
}

function scoreEntry(question: string, normalizedQuestion: string, questionTokens: Set<string>, entry: FaqEntry): number {
  let score = 0;

  entry.keywords.forEach((keyword) => {
    const normalizedKeyword = normalizeText(keyword);
    const keywordTokens = toTokenSet(normalizedKeyword);

    if (normalizedQuestion.includes(normalizedKeyword)) {
      score += 3;
      return;
    }

    const overlap = countCommonTokens(questionTokens, keywordTokens);
    if (overlap > 0) score += overlap;
  });

  const sampleQuestions = [...entry.sampleQuestionsFr, ...entry.sampleQuestionsEn];
  sampleQuestions.forEach((sample) => {
    const sampleTokens = toTokenSet(sample);
    const overlap = countCommonTokens(questionTokens, sampleTokens);
    if (overlap > 1) score += overlap;
  });

  const labelTokens = toTokenSet(`${entry.labelFr} ${entry.labelEn}`);
  score += countCommonTokens(questionTokens, labelTokens);

  if (normalizeText(question) === normalizeText(entry.labelFr) || normalizeText(question) === normalizeText(entry.labelEn)) {
    score += 4;
  }

  return score;
}

function findBestFaqMatch(question: string): FaqEntry | undefined {
  const normalizedQuestion = normalizeText(question);
  const questionTokens = toTokenSet(question);
  const matches = FAQ_ENTRIES.map((entry) => ({
    entry,
    score: scoreEntry(question, normalizedQuestion, questionTokens, entry),
  })).filter((item) => item.score >= MIN_MATCH_SCORE);

  matches.sort((a, b) => b.score - a.score);
  return matches[0]?.entry;
}

export const SupportChatbot: React.FC = () => {
  const { tr } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: 'bot',
      text: tr(
        'Bonjour, je peux vous aider sur les dons, les demandes de PC et les candidatures.',
        'Hello, I can help with donations, PC requests, and applications.'
      ),
    },
  ]);

  const quickQuestions = useMemo(
    () =>
      FAQ_ENTRIES.filter((entry) => FEATURED_QUESTION_IDS.includes(entry.id)).map((entry) => ({
        id: entry.id,
        label: tr(entry.labelFr, entry.labelEn),
      })),
    [tr]
  );

  const adminFallbackMessage = tr(
    `Merci de contacter la direction pour un traitement precis. ${DIRECTION_PHONE}`,
    `Please contact management for accurate support. ${DIRECTION_PHONE}`
  );

  const handleAsk = (question: string) => {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) return;

    const normalizedQuestion = normalizeText(trimmedQuestion);
    const wordCount = normalizedQuestion.split(/\s+/).filter(Boolean).length;

    const userMessage: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      text: trimmedQuestion,
    };

    let answer = adminFallbackMessage;
    if (!isComplexQuestion(normalizedQuestion, wordCount)) {
      const match = findBestFaqMatch(trimmedQuestion);
      if (match) {
        answer = tr(match.answerFr, match.answerEn);
      }
    }

    const botMessage: ChatMessage = {
      id: Date.now() + 1,
      sender: 'bot',
      text: answer,
    };

    setMessages((prev) => [...prev, userMessage, botMessage]);
    setInputValue('');
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      {isOpen && (
        <div className="mb-3 w-[calc(100vw-2rem)] max-w-sm rounded-2xl border border-gray-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between rounded-t-2xl bg-[#0f172a] px-4 py-3 text-white">
            <p className="text-sm font-semibold">
              {tr('Assistant StarterKit', 'StarterKit Assistant')}
            </p>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full px-2 py-1 text-xs hover:bg-white/20"
              aria-label={tr('Fermer le chatbot', 'Close chatbot')}
            >
              ✕
            </button>
          </div>

          <div className="max-h-72 space-y-2 overflow-y-auto px-3 py-3 sm:px-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[90%] rounded-xl px-3 py-2 text-sm ${
                  message.sender === 'user'
                    ? 'ml-auto bg-[#0f172a] text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 px-3 py-3 sm:px-4">
            <div className="mb-2 flex flex-wrap gap-2">
              {quickQuestions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleAsk(item.label)}
                  className="rounded-full border border-gray-300 px-3 py-1 text-xs text-gray-700 hover:bg-gray-100"
                >
                  {item.label}
                </button>
              ))}
            </div>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                handleAsk(inputValue);
              }}
              className="flex gap-2"
            >
              <input
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                placeholder={tr('Posez votre question...', 'Ask your question...')}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#0f172a] focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-lg bg-[#0f172a] px-3 py-2 text-sm font-medium text-white hover:bg-[#1e293b]"
              >
                {tr('Envoyer', 'Send')}
              </button>
            </form>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0f172a] text-2xl text-white shadow-xl transition hover:scale-105"
        aria-label={isOpen ? tr('Fermer le chatbot', 'Close chatbot') : tr('Ouvrir le chatbot', 'Open chatbot')}
      >
        {isOpen ? '✕' : '💬'}
      </button>
    </div>
  );
};
