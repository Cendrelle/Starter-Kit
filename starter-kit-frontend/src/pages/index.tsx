import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Carousel } from '@/components/ui/Carousel';
import { DonorWall } from '@/components/donation/DonorWall';
import { PartnersCarousel } from '@/components/home/PartnersCarousel';
import { useFrontendStore } from '@/hooks/useFrontendStore';
import { MOCK_DONORS, MOCK_PARTNERS, MOCK_STATS } from '@/utils/constants';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/Button';
import { PlatformOverviewStats } from '@/utils/types';
import { api } from '@/lib/api';
import { formatFCFA } from '@/utils/currency';
import {
  ArrowTrendingUpIcon,
  CheckBadgeIcon,
  BriefcaseIcon,
  ComputerDesktopIcon,
  HeartIcon,
  ShieldCheckIcon,
  RocketLaunchIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

export default function HomePage() {
  const { store } = useFrontendStore();
  const { tx, tr } = useLanguage();
  const [overviewStats, setOverviewStats] = useState<PlatformOverviewStats | null>(null);

  const carouselItems = store.carouselImages
    .filter((image) => image.active)
    .sort((a, b) => a.order - b.order)
    .map((img) => ({
      id: img.id,
      image: img.url,
      title: img.title,
      description: img.description,
      link: img.link,
    }));

  useEffect(() => {
    let mounted = true;
    const fetchStats = async () => {
      try {
        const response = await api.get('/stats/overview');
        if (mounted) setOverviewStats(response.data || null);
      } catch {
        if (mounted) setOverviewStats(null);
      }
    };
    fetchStats();
    return () => {
      mounted = false;
    };
  }, []);

  const stats = overviewStats
    ? {
        totalJobs: overviewStats.jobs.active,
        totalCandidates: overviewStats.users.candidates,
        totalDonations: overviewStats.donations.totalRaised,
        pcsDistributed: overviewStats.inventory.delivered,
        targetPCs: Math.max(1000, overviewStats.inventory.delivered + overviewStats.inventory.inStock),
      }
    : {
        ...MOCK_STATS,
        totalJobs: Math.max(MOCK_STATS.totalJobs, store.jobs.length),
        totalCandidates: Math.max(MOCK_STATS.totalCandidates, store.applications.length + 120),
      };

  const progress = Math.min(100, Math.round((stats.pcsDistributed / stats.targetPCs) * 100));

  const trustCards = [
    { title: tx('home.trustCard1Title'), text: tx('home.trustCard1Text'), icon: HeartIcon },
    { title: tx('home.trustCard2Title'), text: tx('home.trustCard2Text'), icon: CheckBadgeIcon },
    { title: tx('home.trustCard3Title'), text: tx('home.trustCard3Text'), icon: BriefcaseIcon },
  ];

  const impactPillars = [
    { title: tx('home.pillar1Title'), text: tx('home.pillar1Text'), icon: ShieldCheckIcon },
    { title: tx('home.pillar2Title'), text: tx('home.pillar2Text'), icon: ArrowTrendingUpIcon },
    { title: tx('home.pillar3Title'), text: tx('home.pillar3Text'), icon: RocketLaunchIcon },
  ];

  const beneficiaryReviews = [
    { name: tx('home.review1Name'), role: tx('home.review1Role'), quote: tx('home.review1Quote') },
    { name: tx('home.review2Name'), role: tx('home.review2Role'), quote: tx('home.review2Quote') },
    { name: tx('home.review3Name'), role: tx('home.review3Role'), quote: tx('home.review3Quote') },
    { name: tx('home.review4Name'), role: tx('home.review4Role'), quote: tx('home.review4Quote') },
  ];

  return (
    <div className="bg-slate-50">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#1d4ed8_0%,_transparent_40%),radial-gradient(circle_at_bottom_left,_#16a34a_0%,_transparent_38%)] opacity-15" />
        <div className="container-custom relative py-4">
          {carouselItems.length > 0 && <Carousel items={carouselItems} autoPlay interval={5500} />}
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="container-custom">
          <div className="grid lg:grid-cols-5 gap-8 items-start">
            <div className="lg:col-span-3">
              <p className="inline-flex items-center rounded-full bg-white border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 mb-4">
                {tx('home.badge')}
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl leading-tight font-black text-slate-900">
                <span className="block">{tx('home.heroTitle1')}</span>
                <span className="block text-primary-700">{tx('home.heroTitle2')}</span>
                <span className="block">{tx('home.heroTitle3')}</span>
              </h1>
              <p className="mt-5 text-lg text-slate-600 max-w-2xl">{tx('home.heroText')}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/donation">
                  <Button size="lg">{tx('home.ctaDonate')}</Button>
                </Link>
                <Link href="/jobs">
                  <Button variant="outline" size="lg">
                    {tx('home.ctaJobs')}
                  </Button>
                </Link>
                <Link href="/candidate/pc-request">
                  <Button variant="ghost" size="lg">
                    {tx('home.ctaRequest')}
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-slate-500">{tx('home.kpiFunded')}</p>
                  <ArrowTrendingUpIcon className="h-5 w-5 text-primary-700" />
                </div>
                <p className="text-3xl font-black text-slate-900">{progress}%</p>
                <p className="text-xs text-slate-500 mt-1">{tx('home.kpiFundedHint')}</p>
                <div className="mt-3 h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-primary-600 rounded-full" style={{ width: `${progress}%` }} />
                </div>
              </div>

              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">{tx('home.kpiDonors')}</p>
                  <UserGroupIcon className="h-5 w-5 text-emerald-700" />
                </div>
                <p className="mt-2 text-3xl font-black text-slate-900">{stats.totalCandidates}</p>
              </div>

              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">{tx('home.kpiInternships')}</p>
                  <BriefcaseIcon className="h-5 w-5 text-violet-700" />
                </div>
                <p className="mt-2 text-3xl font-black text-slate-900">{stats.totalJobs}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container-custom">
          <div className="rounded-3xl bg-white border border-slate-200 p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900">{tx('home.sectionPcTitle')}</h2>
            <p className="mt-3 text-slate-600 max-w-3xl">{tx('home.sectionPcText')}</p>
            <div className="mt-8 grid md:grid-cols-3 gap-4">
              {trustCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div key={card.title} className="rounded-2xl border border-slate-200 p-4 bg-slate-50">
                    <Icon className="h-6 w-6 text-primary-700 mb-3" />
                    <h3 className="font-bold text-slate-900">{card.title}</h3>
                    <p className="text-sm text-slate-600 mt-1">{card.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <DonorWall donors={MOCK_DONORS} />
            </div>

            <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-black text-slate-900">{tx('home.impactBoardTitle')}</h3>
              <p className="text-sm text-slate-600 mt-2">{tx('home.impactBoardText')}</p>

              <div className="mt-6 grid sm:grid-cols-3 gap-4">
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                  <ComputerDesktopIcon className="h-5 w-5 text-primary-700 mb-2" />
                  <p className="text-xs text-slate-500">{tx('home.impactBoardProgress')}</p>
                  <p className="text-2xl font-black text-slate-900">
                    {stats.pcsDistributed}/{stats.targetPCs}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                  <HeartIcon className="h-5 w-5 text-rose-700 mb-2" />
                  <p className="text-xs text-slate-500">{tx('header.donate')}</p>
                  <p className="text-2xl font-black text-slate-900">{formatFCFA(stats.totalDonations)}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                  <BriefcaseIcon className="h-5 w-5 text-violet-700 mb-2" />
                  <p className="text-xs text-slate-500">{tx('header.jobs')}</p>
                  <p className="text-2xl font-black text-slate-900">{stats.totalJobs}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/donation">
                  <Button>{tx('home.ctaDonate')}</Button>
                </Link>
                <Link href="/jobs">
                  <Button variant="outline">{tx('home.ctaJobs')}</Button>
                </Link>
              </div>
              {overviewStats && (
                <p className="mt-4 text-xs text-slate-500">
                  {tr('Inventaire PC', 'PC inventory')}: {overviewStats.inventory.total} | {tr('En stock', 'In stock')}: {overviewStats.inventory.inStock}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-14">
        <div className="container-custom">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
            <div className="max-w-3xl">
              <h2 className="text-2xl md:text-3xl font-black text-slate-900">{tx('home.whyTitle')}</h2>
              <p className="mt-3 text-slate-600">{tx('home.whyText')}</p>
            </div>
            <div className="mt-7 grid md:grid-cols-3 gap-4">
              {impactPillars.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <div key={pillar.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <Icon className="h-6 w-6 text-primary-700 mb-3" />
                    <h3 className="font-bold text-slate-900">{pillar.title}</h3>
                    <p className="text-sm text-slate-600 mt-1">{pillar.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <PartnersCarousel partners={MOCK_PARTNERS} />

      <section className="py-16 bg-gradient-to-r from-primary-800 via-primary-700 to-primary-600">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white">{tx('home.finalTitle')}</h2>
          <p className="mt-3 text-lg text-primary-100 max-w-2xl mx-auto">{tx('home.finalText')}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/donation">
              <Button size="lg" className="bg-amber-300 text-slate-900 hover:bg-amber-200 border border-amber-200">
                {tx('home.finalDonate')}
              </Button>
            </Link>
            <Link href="/jobs">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                {tx('home.finalJobs')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-14 bg-gradient-to-r from-slate-900 via-primary-900 to-slate-900 overflow-hidden">
        <div className="container-custom">
          <h2 className="text-2xl md:text-3xl font-black text-white">{tx('home.reviewsTitle')}</h2>
          <p className="text-primary-100 mt-2 mb-6">{tx('home.reviewsText')}</p>
        </div>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-slate-900 to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-slate-900 to-transparent z-10" />
          <div className="flex w-max gap-4 animate-marquee-x px-4">
            {[...beneficiaryReviews, ...beneficiaryReviews].map((review, index) => (
              <article
                key={`${review.name}-${index}`}
                className="w-[300px] md:w-[360px] shrink-0 rounded-2xl border border-amber-200/60 bg-amber-50 p-5 shadow-lg"
              >
                <p className="text-slate-700 text-sm leading-relaxed">&quot;{review.quote}&quot;</p>
                <div className="mt-4">
                  <p className="font-semibold text-slate-900">{review.name}</p>
                  <p className="text-xs text-primary-700">{review.role}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
