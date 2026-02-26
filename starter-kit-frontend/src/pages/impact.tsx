import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { formatFCFA } from '@/utils/currency';
import { MOCK_STATS } from '@/utils/constants';
import { useLanguage } from '@/context/LanguageContext';
import { BanknotesIcon, BriefcaseIcon, ComputerDesktopIcon, UserGroupIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function ImpactPage() {
  const stats = MOCK_STATS;
  const { tx } = useLanguage();

  const timeline = [
    tx('impact.timeline1'),
    tx('impact.timeline2'),
    tx('impact.timeline3'),
    tx('impact.timeline4'),
  ];

  const allocations = [
    { label: tx('impact.transparencyBuy'), value: 62 },
    { label: tx('impact.transparencyOps'), value: 24 },
    { label: tx('impact.transparencyPlatform'), value: 14 },
  ];

  const stories = [
    {
      id: 's1',
      name: 'Marie K.',
      role: 'PC Standard',
      city: 'Cotonou',
      image: '/images/stories/marie.jpg',
      text:
        'Grace au materiel recu et aux offres publiees, elle a valide son stage et travaille sur des projets clients.',
    },
    {
      id: 's2',
      name: 'Abdoulaye S.',
      role: 'PC Premium',
      city: 'Parakou',
      image: '/images/stories/abdoulaye.jpg',
      text: 'Il a construit un portfolio data et rejoint une equipe analytique en stage de pre-embauche.',
    },
    {
      id: 's3',
      name: 'Fatima B.',
      role: 'PC Basic',
      city: 'Porto-Novo',
      image: '/images/stories/fatima.jpg',
      text: 'Elle a lance son activite design et facture deja ses premieres missions freelance.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden py-16 lg:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,_#16a34a_0%,_transparent_30%),radial-gradient(circle_at_80%_0%,_#1d4ed8_0%,_transparent_35%)] opacity-15" />
        <div className="container-custom relative">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900">{tx('impact.title')}</h1>
            <p className="mt-4 text-lg text-slate-600">{tx('impact.subtitle')}</p>
          </div>
        </div>
      </section>

      <section className="pb-12">
        <div className="container-custom grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <article className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
            <ComputerDesktopIcon className="h-6 w-6 text-primary-700" />
            <p className="mt-3 text-3xl font-black text-slate-900">{stats.pcsDistributed}</p>
            <p className="text-sm text-slate-500">{tx('impact.statPc')}</p>
          </article>
          <article className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
            <BanknotesIcon className="h-6 w-6 text-emerald-700" />
            <p className="mt-3 text-3xl font-black text-slate-900">{formatFCFA(stats.totalDonations)}</p>
            <p className="text-sm text-slate-500">{tx('impact.statDonation')}</p>
          </article>
          <article className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
            <BriefcaseIcon className="h-6 w-6 text-violet-700" />
            <p className="mt-3 text-3xl font-black text-slate-900">{stats.totalJobs}</p>
            <p className="text-sm text-slate-500">{tx('impact.statJobs')}</p>
          </article>
          <article className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
            <UserGroupIcon className="h-6 w-6 text-amber-700" />
            <p className="mt-3 text-3xl font-black text-slate-900">{stats.totalCandidates}</p>
            <p className="text-sm text-slate-500">{tx('impact.statCandidates')}</p>
          </article>
        </div>
      </section>

      <section className="py-12">
        <div className="container-custom grid lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-2xl font-black text-slate-900">{tx('impact.timelineTitle')}</h2>
            <ol className="mt-5 space-y-3">
              {timeline.map((item, index) => (
                <li key={item} className="flex gap-3">
                  <span className="h-7 w-7 rounded-full bg-primary-100 text-primary-700 font-bold text-sm flex items-center justify-center">
                    {index + 1}
                  </span>
                  <p className="text-slate-700">{item}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-2">
              <ShieldCheckIcon className="h-6 w-6 text-emerald-700" />
              <h2 className="text-2xl font-black text-slate-900">{tx('impact.sectionNumbers')}</h2>
            </div>
            <p className="mt-2 text-slate-600">{tx('impact.transparencyText')}</p>
            <div className="mt-5 space-y-4">
              {allocations.map((row) => (
                <div key={row.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">{row.label}</span>
                    <span className="font-semibold text-slate-800">{row.value}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full bg-primary-600" style={{ width: `${row.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container-custom">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6">{tx('impact.sectionStories')}</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {stories.map((story) => (
              <article key={story.id} className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
                <div className="relative h-52">
                  <Image src={story.image} alt={story.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                </div>
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase text-primary-700">{story.role}</p>
                  <h3 className="text-xl font-bold text-slate-900 mt-1">{story.name}</h3>
                  <p className="text-sm text-slate-500">{story.city}</p>
                  <p className="mt-3 text-slate-600 text-sm">{story.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-primary-800 via-primary-700 to-primary-600">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white">{tx('impact.ctaTitle')}</h2>
          <p className="mt-3 text-lg text-primary-100 max-w-2xl mx-auto">{tx('impact.ctaText')}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/donation">
              <Button size="lg" className="bg-amber-300 text-slate-900 hover:bg-amber-200 border border-amber-200">
                {tx('header.donate')}
              </Button>
            </Link>
            <Link href="/jobs">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                {tx('header.jobs')}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
