import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/Button';
import { PC_CATEGORIES } from '@/utils/constants';
import { PC_Category } from '@/utils/types';
import { useFrontendStore } from '@/hooks/useFrontendStore';
import { useLanguage } from '@/context/LanguageContext';

export default function PCRequestPage() {
  const router = useRouter();
  const { store, patchStore } = useFrontendStore();
  const { tr } = useLanguage();
  const descriptions: Record<string, { fr: string; en: string }> = {
    basic: {
      fr: 'Ideal pour les taches essentielles: navigation, bureautique et recherche.',
      en: 'Ideal for essentials: browsing, office work and research.',
    },
    standard: {
      fr: 'Parfait pour developpement web, projets universitaires et multitache.',
      en: 'Great for web development, university projects and multitasking.',
    },
    premium: {
      fr: 'Concu pour les besoins avances: design, data, developpement intensif.',
      en: 'Built for advanced needs: design, data, and intensive development.',
    },
  };
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    category: '' as PC_Category | '',
    reason: '',
    professionalGoal: '',
    motivation: '',
  });

  if (!store.candidateSession) {
    if (typeof window !== 'undefined') router.replace('/candidate/login');
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    patchStore((prev) => ({
      ...prev,
      pcRequests: [
        {
          id: `pc-${Date.now()}`,
          candidateId: store.candidateSession!.id,
          candidateName: store.candidateSession!.fullName,
          candidateEmail: store.candidateSession!.email,
          candidatePhone: store.candidateSession!.phone,
          category: formData.category as PC_Category,
          reason: formData.reason,
          professionalGoal: formData.professionalGoal,
          motivation: formData.motivation,
          createdAt: new Date().toISOString(),
          decision: 'pending',
        },
        ...prev.pcRequests,
      ],
    }));
    router.push('/candidate/profile');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{tr('Demander un ordinateur', 'Request a laptop')}</h1>
            <p className="text-gray-600">
              {tr('Demande en 3 etapes. Votre dossier sera visible dans l espace admin.', '3-step flow. Your file will be visible in admin space.')}
            </p>
          </div>

          <div className="flex justify-between items-center mb-8">
            {[1, 2, 3].map((index) => (
              <div key={index} className="flex-1 text-center">
                <div
                  className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center font-semibold mb-2 ${
                    step >= index ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {index}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8">
            {step === 1 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">{tr('Choisir la categorie de PC', 'Choose PC category')}</h2>
                <div className="space-y-4 mb-8">
                  {Object.entries(PC_CATEGORIES).map(([key, category]) => (
                    <button
                      key={key}
                      type="button"
                      className={`w-full text-left border-2 rounded-xl p-5 transition-all ${
                        formData.category === key ? 'border-primary-600 bg-primary-50' : 'border-gray-200'
                      }`}
                      onClick={() => setFormData((prev) => ({ ...prev, category: key as PC_Category }))}
                    >
                      <p className="font-semibold text-gray-900">{category.name}</p>
                      <p className="text-sm text-gray-600">{tr(descriptions[key]?.fr || category.description, descriptions[key]?.en || category.description)}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {tr('Etudiant', 'Student')}: 40% ({category.studentShareFormatted}) | {tr('Donateur', 'Donor')}: 60% {tr('ou total', 'or full')}
                      </p>
                    </button>
                  ))}
                </div>
                <div className="flex justify-end">
                  <Button type="button" onClick={() => setStep(2)} disabled={!formData.category}>
                    {tr('Continuer', 'Continue')}
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">{tr('Projet professionnel', 'Career project')}</h2>
                <div className="space-y-5">
                  <textarea
                    value={formData.reason}
                    onChange={(e) => setFormData((prev) => ({ ...prev, reason: e.target.value }))}
                    rows={4}
                    className="input-field"
                    placeholder={tr('Pourquoi avez-vous besoin d un PC ?', 'Why do you need a laptop?')}
                    required
                  />
                  <textarea
                    value={formData.professionalGoal}
                    onChange={(e) => setFormData((prev) => ({ ...prev, professionalGoal: e.target.value }))}
                    rows={4}
                    className="input-field"
                    placeholder={tr('Quel stage cherchez-vous ?', 'Which internship are you looking for?')}
                    required
                  />
                  <textarea
                    value={formData.motivation}
                    onChange={(e) => setFormData((prev) => ({ ...prev, motivation: e.target.value }))}
                    rows={4}
                    className="input-field"
                    placeholder={tr('En quoi ce soutien va changer votre parcours ?', 'How will this support change your path?')}
                    required
                  />
                </div>
                <div className="flex justify-between mt-8">
                  <Button type="button" variant="outline" onClick={() => setStep(1)}>
                    {tr('Retour', 'Back')}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setStep(3)}
                    disabled={!formData.reason || !formData.professionalGoal || !formData.motivation}
                  >
                    {tr('Continuer', 'Continue')}
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">{tr('Validation', 'Review')}</h2>
                <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-700">
                  <p>
                    {tr(
                      'Je confirme que les informations soumises sont exactes. J accepte la charte de bon usage et l interdiction de revente pendant 24 mois.',
                      'I confirm that all submitted information is accurate. I accept the usage charter and the 24-month no-resale rule.'
                    )}
                  </p>
                </div>
                <div className="flex justify-between mt-8">
                  <Button type="button" variant="outline" onClick={() => setStep(2)}>
                    {tr('Retour', 'Back')}
                  </Button>
                  <Button type="submit">{tr('Soumettre ma demande', 'Submit my request')}</Button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
