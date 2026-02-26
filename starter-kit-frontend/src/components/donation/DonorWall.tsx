import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import { formatDistanceToNow } from 'date-fns';
import { enUS, fr } from 'date-fns/locale';
import { formatFCFA } from '@/utils/currency';
import { useLanguage } from '@/context/LanguageContext';

interface Donor {
  id: string;
  name: string;
  amount: number;
  isAnonymous: boolean;
  createdAt: string;
}

interface DonorWallProps {
  donors: Donor[];
}

export const DonorWall: React.FC<DonorWallProps> = ({ donors }) => {
  const [isClient, setIsClient] = useState(false);
  const { tr, isEn } = useLanguage();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: isEn ? enUS : fr,
      });
    } catch (error) {
      return tr('Date inconnue', 'Unknown date');
    }
  };

  // Version pour le serveur (fixe)
  if (!isClient) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">{tr('Dons recents', 'Recent donations')}</h3>
        <div className="space-y-4">
          {donors.slice(0, 5).map((donor) => (
            <div key={donor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <UserCircleIcon className="h-10 w-10 text-gray-400" />
                <div>
                  <p className="font-semibold text-gray-900">
                    {donor.isAnonymous ? tr('Donateur anonyme', 'Anonymous donor') : donor.name}
                  </p>
                  <p className="text-sm text-gray-500">{tr('Recemment', 'Recently')}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary-600">{formatFCFA(donor.amount)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Version pour le client (avec dates réelles)
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">{tr('Dons recents', 'Recent donations')}</h3>
      <div className="space-y-4">
        {donors.slice(0, 5).map((donor) => (
          <div key={donor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-3">
              <UserCircleIcon className="h-10 w-10 text-gray-400" />
              <div>
                <p className="font-semibold text-gray-900">
                  {donor.isAnonymous ? tr('Donateur anonyme', 'Anonymous donor') : donor.name}
                </p>
                <p className="text-sm text-gray-500">
                  {formatDate(donor.createdAt)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-primary-600">{formatFCFA(donor.amount)}</p>
            </div>
          </div>
        ))}
      </div>

      {donors.length > 5 && (
        <Link
          href="/cagnotte-commune"
          className="block w-full mt-4 text-center text-primary-600 font-semibold hover:text-primary-700 transition-colors"
        >
          {tr('Voir tous les donateurs', 'View all donors')}
        </Link>
      )}
    </div>
  );
};

