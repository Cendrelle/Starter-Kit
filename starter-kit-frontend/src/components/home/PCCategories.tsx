import React from 'react';
import { PC_CATEGORIES } from '@/utils/constants';
import { Button } from '../ui/Button';
import Link from 'next/link';
import { formatFCFA } from '@/utils/currency';
import { useLanguage } from '@/context/LanguageContext';
import Image from 'next/image';

const colorStyles = {
  blue: { bg: 'bg-blue-100', badge: 'bg-blue-600' },
  green: { bg: 'bg-green-100', badge: 'bg-green-600' },
  purple: { bg: 'bg-purple-100', badge: 'bg-purple-600' },
} as const;

export const PCCategories: React.FC = () => {
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
  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {tr('Choisissez le PC a financer', 'Choose the laptop to fund')}
          </h2>
          <p className="text-lg text-gray-600">
            {tr(
              'Trois categories: Basic, Standard, Premium. L etudiant prend 40%, le don couvre 60% ou 100%.',
              'Three categories: Basic, Standard, Premium. The student pays 40%, donors cover 60% or 100%.'
            )}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {Object.entries(PC_CATEGORIES).map(([key, category]) => {
            const style = colorStyles[category.color as keyof typeof colorStyles] || {
              bg: 'bg-gray-100',
              badge: 'bg-gray-600',
            };

            return (
              <div key={key} className="rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:-translate-y-1 transition">
                <div className={`h-48 ${style.bg} relative overflow-hidden`}>
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className={`absolute top-4 right-4 ${style.badge} text-white px-3 py-1 rounded-full text-xs font-semibold`}>
                    {tr('Etudiant', 'Student')}: {formatFCFA(category.studentShare)}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-gray-600 mb-4 text-sm">{tr(descriptions[key]?.fr || category.description, descriptions[key]?.en || category.description)}</p>
                  <ul className="space-y-1 mb-5">
                    {category.specs.map((spec, index) => (
                      <li key={index} className="text-sm text-gray-600">
                        - {spec}
                      </li>
                    ))}
                  </ul>
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600 text-sm">{tr('Prix total', 'Total price')}</span>
                      <span className="text-lg font-bold text-primary-600">{formatFCFA(category.price)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-4 text-sm">
                      <span className="text-gray-600">{tr('Part etudiant (40%)', 'Student share (40%)')}</span>
                      <span className="font-semibold">{formatFCFA(category.studentShare)}</span>
                    </div>
                    <Link href={`/donation?category=${key}`}>
                      <Button variant="outline" fullWidth>
                        {tr('Financer ce PC', 'Fund this laptop')}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link href="/donation">
            <Button size="lg">{tr('Contribuer a la cagnotte commune', 'Contribute to the shared fund')}</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
