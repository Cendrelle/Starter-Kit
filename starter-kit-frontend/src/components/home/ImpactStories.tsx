import React from 'react';
import { Button } from '../ui/Button';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '@/context/LanguageContext';
import Image from 'next/image';

interface Story {
  id: string;
  name: string;
  age: number;
  location: string;
  storyFr: string;
  storyEn: string;
  image: string;
  pcReceived: string;
  stage?: string;
}

const stories: Story[] = [
  {
    id: '1',
    name: 'Marie K.',
    age: 23,
    location: 'Cotonou',
    storyFr: 'Grace au PC Standard finance par la communaute, j ai pu postuler a des stages web et obtenir une opportunite chez TechStart Benin.',
    storyEn: 'Thanks to a community-funded Standard PC, I was able to apply to web internships and secure an opportunity at TechStart Benin.',
    image: '/images/stories/marie.jpg',
    pcReceived: 'PC Standard',
    stage: 'Developpeuse Web Junior',
  },
  {
    id: '2',
    name: 'Abdoulaye S.',
    age: 25,
    location: 'Parakou',
    storyFr: 'Avec mon PC Premium, je peux travailler sur des projets data et participer a des competitions internationales.',
    storyEn: 'With my Premium PC, I can work on data projects and join international competitions.',
    image: '/images/stories/abdoulaye.jpg',
    pcReceived: 'PC Premium',
    stage: 'Data Analyst',
  },
  {
    id: '3',
    name: 'Fatima B.',
    age: 22,
    location: 'Porto-Novo',
    storyFr: 'Le PC Basic m a permis de creer mon portfolio en design graphique et de signer mes premiers contrats.',
    storyEn: 'The Basic PC helped me build my graphic design portfolio and land my first contracts.',
    image: '/images/stories/fatima.jpg',
    pcReceived: 'PC Basic',
    stage: 'Graphic Designer',
  },
];

export const ImpactStories: React.FC = () => {
  const { tr, isEn } = useLanguage();

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{tr("Histoires d'impact", 'Impact stories')}</h2>
          <p className="text-lg text-gray-600">
            {tr(
              'Decouvrez comment votre generosite transforme des vies et cree des opportunites',
              'See how your generosity transforms lives and creates opportunities'
            )}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {stories.map((story) => (
            <div key={story.id} className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow">
              <div className="relative h-64 bg-gray-200">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                <Image
                  src={story.image}
                  alt={story.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-4 left-4 z-20 text-white">
                  <p className="text-sm opacity-90">{story.location}</p>
                  <p className="font-semibold">
                    {story.name}, {story.age} {tr('ans', 'years')}
                  </p>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-semibold">{story.pcReceived}</span>
                  {story.stage && <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">{story.stage}</span>}
                </div>

                <p className="text-gray-600 mb-4 line-clamp-3">{isEn ? story.storyEn : story.storyFr}</p>

                <button className="text-primary-600 font-semibold inline-flex items-center group-hover:translate-x-1 transition-transform">
                  {tr('Lire son histoire', 'Read full story')}
                  <ArrowRightIcon className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            {tr('Voir toutes les histoires', 'View all stories')}
          </Button>
        </div>
      </div>
    </section>
  );
};
