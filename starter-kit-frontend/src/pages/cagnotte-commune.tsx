import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { formatFCFA } from '@/utils/currency';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/lib/api';

export default function CagnotteCommunePage() {
  const { tr } = useLanguage();
  const [stats, setStats] = useState({
    totalRaised: 0,
    totalPcFinanced: 0,
    yearlyTarget: 1000,
    progressPercentage: 0,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/donations/stats');
        setStats(response.data);
      } catch {
        setError(tr('Impossible de charger les statistiques.', 'Could not load statistics.'));
      }
    };

    fetchStats();
  }, [tr]);

  const totalCollecte = stats.totalRaised;
  const objectif = stats.yearlyTarget * 150000;
  const progression = (totalCollecte / objectif) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{tr('Cagnotte Commune', 'Shared Fund')}</h1>
          <p className="text-xl text-gray-600">{tr('Chaque don compte pour financer le prochain ordinateur', 'Every donation helps fund the next laptop')}</p>
        </div>

        <div className="max-w-4xl mx-auto mb-12">
          {error && <p className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
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
                <p className="text-3xl font-bold text-primary-600">{Math.floor(stats.totalPcFinanced)}</p>
                <p className="text-gray-600">{tr('PC finances', 'Funded PCs')}</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary-600">{stats.progressPercentage}%</p>
                <p className="text-gray-600">{tr('Progression', 'Progress')}</p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Link href="/donation">
                <Button size="lg">{tr('Faire un don a la cagnotte', 'Donate to this fund')}</Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-500">
          {tr('La liste des derniers donateurs sera connectee quand l endpoint dedie sera disponible.', 'The latest donors list will be connected once the dedicated endpoint is available.')}
        </div>
      </div>
    </div>
  );
}
