import React from 'react';
import { MOCK_STATS } from '@/utils/constants';
import { formatFCFA } from '@/utils/currency';

export const StatsOverview: React.FC = () => {
  const stats = MOCK_STATS;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Aperçu des statistiques</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribution des PC</h3>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-600">PC distribués</span>
              <span className="font-semibold">{stats.pcsDistributed}/{stats.targetPCs}</span>
            </div>
            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-600 rounded-full"
                style={{ width: `${(stats.pcsDistributed / stats.targetPCs) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Collecte de dons</h3>
          <p className="text-3xl font-bold text-primary-600 mb-2">{formatFCFA(stats.totalDonations)}</p>
          <p className="text-gray-600">Total collecté</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Stages</h3>
          <p className="text-3xl font-bold text-secondary-600 mb-2">{stats.totalJobs}</p>
          <p className="text-gray-600">Offres publiées</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Candidats</h3>
          <p className="text-3xl font-bold text-purple-600 mb-2">{stats.totalCandidates}</p>
          <p className="text-gray-600">Inscrits sur la plateforme</p>
        </div>
      </div>
    </div>
  );
};
