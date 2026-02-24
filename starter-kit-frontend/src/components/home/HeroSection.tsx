import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '../ui/Button';
import { AcademicCapIcon, PlayCircleIcon } from '@heroicons/react/24/outline';
import { formatFCFA } from '@/utils/currency';
import { useLanguage } from '@/context/LanguageContext';

interface HeroSectionProps {
  stats: {
    totalPCs: number;
    targetPCs: number;
    totalDonations: number;
    totalJobs: number;
  };
}

export const HeroSection: React.FC<HeroSectionProps> = ({ stats }) => {
  const progress = (stats.totalPCs / stats.targetPCs) * 100;
  const { tr } = useLanguage();

  return (
    <div className="relative bg-gradient-to-br from-primary-50 to-secondary-50 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-400 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-400 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              <span className="block">{tr('Donnez un', 'Give one')}</span>
              <span className="text-primary-600">{tr('ordinateur', 'laptop')}</span>
              <span className="block">{tr('Changez un avenir', 'Change a future')}</span>
            </h1>

            <p className="text-lg text-gray-600 mb-8">
              {tr(
                'StarterKit connecte les diplomes meritants avec des ordinateurs et des opportunites de stage.',
                'StarterKit connects deserving graduates with laptops and internship opportunities.'
              )}
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <Link href="/donation">
                <Button size="lg">{tr('Faire un don', 'Donate')}</Button>
              </Link>
              <Link href="/jobs">
                <Button variant="outline" size="lg">
                  {tr('Voir les stages', 'View internships')}
                </Button>
              </Link>
              <button className="inline-flex items-center text-gray-700 hover:text-primary-600 transition-colors">
                <PlayCircleIcon className="h-10 w-10 mr-2" />
                <span className="font-medium">{tr('Voir la video', 'Watch video')}</span>
              </button>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-gray-900">
                  {stats.totalPCs} {tr('ordinateurs finances', 'funded laptops')}
                </span>
                <span className="text-primary-600 font-semibold">
                  {tr('Objectif', 'Target')}: {stats.targetPCs}
                </span>
              </div>
              <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-primary-600 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{formatFCFA(stats.totalDonations)}</div>
                  <div className="text-sm text-gray-600">{tr('Collectes', 'Raised')}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.totalPCs}</div>
                  <div className="text-sm text-gray-600">{tr('PC distribues', 'PC delivered')}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.totalJobs}</div>
                  <div className="text-sm text-gray-600">{tr('Stages', 'Internships')}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <Image
              src="/images/hero-student.jpg"
              alt="Student with laptop"
              width={900}
              height={700}
              className="rounded-2xl shadow-2xl"
            />
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-lg animate-float">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <AcademicCapIcon className="h-6 w-6 text-green-700" />
                </div>
                <div>
                  <div className="font-semibold">Marie, 23</div>
                  <div className="text-sm text-gray-600">
                    {tr('"Grace a vous, j ai decroche mon stage!"', '"Thanks to you, I got my internship!"')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
