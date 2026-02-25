import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PC_CATEGORIES, DONATION_AMOUNTS_FCFA } from '@/utils/constants';
import { PC_Category } from '@/utils/types';
import { formatFCFA } from '@/utils/currency';
import { toast } from 'react-toastify';
import { useLanguage } from '@/context/LanguageContext';
import { HeartIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';

export default function DonationPage() {
  const router = useRouter();
  const { category } = router.query;
  const { tr } = useLanguage();

  const [selectedCategory, setSelectedCategory] = useState<PC_Category | 'common'>(category as PC_Category || 'common');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [fullPayment, setFullPayment] = useState(false);
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const pcColorClass: Record<string, string> = {
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    purple: 'bg-purple-100',
  };

  const getAmount = () => {
    if (selectedAmount) return selectedAmount;
    if (customAmount) return parseFloat(customAmount);
    return 0;
  };

  const getTotalAmount = () => {
    const baseAmount = getAmount();
    if (selectedCategory !== 'common' && !fullPayment) {
      // 60% du prix du PC si ce n'est pas un paiement complet
      const pcPrice = PC_CATEGORIES[selectedCategory as PC_Category].price;
      return Math.round(pcPrice * 0.6 * quantity);
    }
    if (selectedCategory !== 'common' && fullPayment) {
      return PC_CATEGORIES[selectedCategory as PC_Category].price * quantity;
    }
    return baseAmount;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simuler un paiement PayPal
    setTimeout(() => {
      toast.success('Don effectue avec succes ! Merci pour votre generosite.');
      setIsProcessing(false);
      router.push('/');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {tr('Faire un don', 'Donate')}
          </h1>
          <p className="text-xl text-gray-600">
            {tr(
              'Votre contribution finance des ordinateurs pour des jeunes diplomes meritants et leur ouvre des portes vers l emploi.',
              'Your contribution funds laptops for deserving graduates and opens career opportunities.'
            )}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex justify-between items-center">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-1 text-center">
                <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center font-semibold mb-2
                  ${step >= i
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {i}
                </div>
                <div className="text-sm text-gray-600">
                  {i === 1 && tr('Type de don', 'Donation type')}
                  {i === 2 && tr('Montant', 'Amount')}
                  {i === 3 && tr('Paiement', 'Payment')}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8">
            {/* Step 1: Category Selection */}
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {tr('Choisissez comment vous souhaitez aider', 'Choose how you want to help')}
                </h2>

                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  {/* Cagnotte commune */}
                  <div
                    className={`border-2 rounded-xl p-6 cursor-pointer transition-all
                      ${selectedCategory === 'common'
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                      }`}
                    onClick={() => setSelectedCategory('common')}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                        <HeartIcon className="h-7 w-7 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">
                          {tr('Cagnotte commune', 'Shared fund')}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {tr(
                            'Votre don sera utilise la ou le besoin est le plus urgent',
                            'Your donation will be used where the need is most urgent'
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* PC Categories */}
                  {Object.entries(PC_CATEGORIES).map(([key, category]) => (
                    <div
                      key={key}
                      className={`border-2 rounded-xl p-6 cursor-pointer transition-all
                        ${selectedCategory === key
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-200 hover:border-primary-300'
                        }`}
                      onClick={() => setSelectedCategory(key as PC_Category)}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 ${pcColorClass[category.color] || 'bg-gray-100'} rounded-lg flex items-center justify-center`}>
                          <ComputerDesktopIcon className="h-7 w-7 text-slate-700" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-1">
                            {category.name}
                          </h3>
                          <p className="text-gray-600 text-sm mb-2">
                            {formatFCFA(category.price)} ({tr('l etudiant paie', 'student pays')} {formatFCFA(category.studentShare)})
                          </p>
                          {selectedCategory === key && (
                            <div className="mt-2">
                              <label className="block text-sm text-gray-600 mb-1">
                                {tr('Nombre de PC a financer', 'Number of laptops to fund')}
                              </label>
                              <select
                                value={quantity}
                                onChange={(e) => setQuantity(parseInt(e.target.value))}
                                className="input-field w-24"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {[1, 2, 3, 4, 5].map(n => (
                                  <option key={n} value={n}>{n}</option>
                                ))}
                              </select>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end">
                  <Button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={!selectedCategory}
                  >
                    {tr('Continuer', 'Continue')}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Amount Selection */}
            {step === 2 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {tr('Choisissez le montant', 'Choose amount')}
                </h2>

                {selectedCategory !== 'common' && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={fullPayment}
                        onChange={(e) => setFullPayment(e.target.checked)}
                        className="w-5 h-5 text-primary-600"
                      />
                      <span>
                        {tr('Je souhaite prendre en charge la totalite du PC', 'I want to fully fund this laptop')} (
                        {formatFCFA(PC_CATEGORIES[selectedCategory as PC_Category].price * quantity)})
                      </span>
                    </label>
                  </div>
                )}

                {selectedCategory === 'common' && (
                  <div>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {DONATION_AMOUNTS_FCFA.map(amount => (
                        <button
                          key={amount}
                          type="button"
                          className={`p-4 border-2 rounded-lg font-semibold transition-all
                            ${selectedAmount === amount
                              ? 'border-primary-600 bg-primary-50 text-primary-600'
                              : 'border-gray-200 hover:border-primary-300'
                            }`}
                          onClick={() => {
                            setSelectedAmount(amount);
                            setCustomAmount('');
                          }}
                        >
                          {formatFCFA(amount)}
                        </button>
                      ))}
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {tr('Ou montant personnalise', 'Or custom amount')}
                      </label>
                      <Input
                        type="number"
                        placeholder={tr('Entrez un montant en FCFA', 'Enter amount in FCFA')}
                        value={customAmount}
                        onChange={(e) => {
                          setCustomAmount(e.target.value);
                          setSelectedAmount(null);
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="w-5 h-5 text-primary-600"
                    />
                    <span>{tr('Faire un don anonyme', 'Make an anonymous donation')}</span>
                  </label>
                </div>

                <div className="bg-primary-50 p-6 rounded-lg mb-8">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">{tr('Montant total', 'Total amount')}</span>
                    <span className="text-3xl font-bold text-primary-600">
                      {formatFCFA(getTotalAmount())}
                    </span>
                  </div>
                  {selectedCategory !== 'common' && !fullPayment && (
                    <p className="text-sm text-gray-600">
                      * {tr('L etudiant completera avec', 'Student will contribute')} {formatFCFA(PC_CATEGORIES[selectedCategory as PC_Category].studentShare * quantity)}
                    </p>
                  )}
                </div>

                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                  >
                    {tr('Retour', 'Back')}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setStep(3)}
                    disabled={selectedCategory === 'common' ? !(selectedAmount || customAmount) : !getTotalAmount()}
                  >
                    {tr('Continuer vers le paiement', 'Continue to payment')}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Payment - PayPal uniquement */}
            {step === 3 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {tr('Finaliser votre don', 'Finalize your donation')}
                </h2>

                {/* PayPal Only */}
                <div className="mb-8">
                  <button
                    type="button"
                    className="w-full p-6 border-2 border-primary-600 bg-primary-50 rounded-xl flex items-center justify-center space-x-4 hover:bg-primary-100 transition-colors"
                  >
                    <svg className="h-8 w-8 text-primary-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72c.045-.28.288-.48.575-.48h8.49c3.504 0 5.792 1.58 6.258 4.64.03.197.045.397.045.6 0 .67-.11 1.307-.324 1.907-.932 2.63-3.11 4.147-6.258 4.147h-2.073c-.42 0-.79.286-.89.688l-.67 3.255c-.067.31-.34.528-.66.528z"/>
                    </svg>
                    <span className="text-lg font-semibold text-primary-600">{tr('Payer avec PayPal', 'Pay with PayPal')}</span>
                  </button>
                  <p className="text-center text-sm text-gray-500 mt-2">
                    {tr(
                      'Vous serez redirige vers PayPal pour effectuer votre paiement en toute securite',
                      'You will be redirected to PayPal to complete your payment securely'
                    )}
                  </p>
                </div>

                {/* Contact Information */}
                <div className="space-y-4 mb-8">
                  <Input
                    label={tr('Nom complet', 'Full name')}
                    placeholder="Jean Dupont"
                    required
                  />
                  <Input
                    label="Email"
                    type="email"
                    placeholder="jean@example.com"
                    required
                  />
                  <Input
                    label={tr('Telephone', 'Phone')}
                    type="tel"
                    placeholder="+229 01 23 45 67"
                  />
                </div>

                {/* Summary */}
                <div className="bg-gray-50 p-6 rounded-lg mb-8">
                  <h3 className="font-semibold text-lg mb-4">{tr('Recapitulatif', 'Summary')}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{tr('Type de don', 'Donation type')}</span>
                      <span className="font-medium">
                        {selectedCategory === 'common'
                          ? tr('Cagnotte commune', 'Shared fund')
                          : `${PC_CATEGORIES[selectedCategory as PC_Category].name} x${quantity}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{tr('Montant', 'Amount')}</span>
                      <span className="font-medium">{formatFCFA(getTotalAmount())}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{tr('Anonyme', 'Anonymous')}</span>
                      <span className="font-medium">{isAnonymous ? tr('Oui', 'Yes') : tr('Non', 'No')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(2)}
                  >
                    {tr('Retour', 'Back')}
                  </Button>
                  <Button type="submit" disabled={isProcessing}>
                    {isProcessing ? tr('Traitement...', 'Processing...') : `${tr('Confirmer le don de', 'Confirm donation of')} ${formatFCFA(getTotalAmount())}`}
                  </Button>
                </div>

                <p className="text-xs text-gray-500 text-center mt-4">
                  {tr(
                    'En cliquant sur confirmer, vous acceptez nos conditions generales et notre politique de confidentialite. Vous recevrez un recu fiscal par email.',
                    'By confirming, you accept our terms and privacy policy. You will receive a tax receipt by email.'
                  )}
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}


