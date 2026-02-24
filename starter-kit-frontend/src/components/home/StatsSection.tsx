import React from 'react';
import { Stats } from '@/utils/types';
import { ComputerDesktopIcon, BanknotesIcon, BriefcaseIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { formatFCFA } from '@/utils/currency';
import { useLanguage } from '@/context/LanguageContext';

interface StatsSectionProps {
  stats: Stats;
}

const iconStyles = [
  { bg: 'bg-blue-100', text: 'text-blue-600' },
  { bg: 'bg-green-100', text: 'text-green-600' },
  { bg: 'bg-purple-100', text: 'text-purple-600' },
  { bg: 'bg-orange-100', text: 'text-orange-600' },
];

export const StatsSection: React.FC<StatsSectionProps> = ({ stats }) => {
  const { tr } = useLanguage();
  const statItems = [
    { label: tr('PC distribues', 'PC delivered'), value: stats.pcsDistributed, icon: ComputerDesktopIcon },
    { label: tr('Dons collectes', 'Donations raised'), value: formatFCFA(stats.totalDonations), icon: BanknotesIcon },
    { label: tr('Stages publies', 'Published internships'), value: stats.totalJobs, icon: BriefcaseIcon },
    { label: tr('Candidats aides', 'Supported candidates'), value: stats.totalCandidates, icon: UserGroupIcon },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {statItems.map((item, index) => {
            const Icon = item.icon;
            const style = iconStyles[index];
            return (
              <div key={index} className="text-center">
                <div className={`inline-flex p-3 ${style.bg} rounded-full mb-4`}>
                  <Icon className={`h-6 w-6 ${style.text}`} />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{item.value}</div>
                <div className="text-sm text-gray-600">{item.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
