import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { formatFCFA } from '@/utils/currency';
import { MOCK_DONORS } from '@/utils/constants';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '@/context/LanguageContext';

export default function CagnotteCommunePage() {
  const { tr } = useLanguage();
  const totalCollecte = 156780;
  const objectif = 500000;
  const progression = (totalCollecte / objectif) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{tr('Cagnotte Commune', 'Shared Fund')}</h1>
          <p className="text-xl text-gray-600">{tr('Chaque don compte pour financer le prochain ordinateur', 'Every donation helps fund the next laptop')}</p>
        </div>

        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">{tr('Objectif 2026', '2026 Target')}</h2>
              <span className="text-primary-600 font-semibold">
                {formatFCFA(totalCollecte)} / {formatFCFA(objectif)}
              </span>
            </div>

            <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden mb-6">
              <div className="h-full bg-primary-600 rounded-full transition-all duration-500" style={{ width: `${progression}%` }} />
            </div>

            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-3xl font-bold text-primary-600">{formatFCFA(totalCollecte)}</p>
                <p className="text-gray-600">{tr('Collectes', 'Raised')}</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary-600">{Math.floor(totalCollecte / 250000)}</p>
                <p className="text-gray-600">{tr('PC finances', 'Funded PCs')}</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary-600">{MOCK_DONORS.length}</p>
                <p className="text-gray-600">{tr('Donateurs', 'Donors')}</p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Link href="/donation">
                <Button size="lg">{tr('Faire un don a la cagnotte', 'Donate to this fund')}</Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{tr('Derniers donateurs', 'Latest donors')}</h2>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="space-y-4">
              {MOCK_DONORS.map((donor) => (
                <div key={donor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <UserCircleIcon className="h-10 w-10 text-gray-400" />
                    <div>
                      <p className="font-semibold text-gray-900">{donor.isAnonymous ? tr('Donateur anonyme', 'Anonymous donor') : donor.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary-600">{formatFCFA(donor.amount)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
