import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import type { GetServerSideProps } from 'next';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { JobManagement } from '@/components/admin/JobManagement';
import { PcRequestsManagement } from '@/components/admin/PcRequestsManagement';
import { JobApplicationsManagement } from '@/components/admin/JobApplicationsManagement';
import { CarouselManagement } from '@/components/admin/CarouselManagement';
import {
  ComputerDesktopIcon,
  BriefcaseIcon,
  UserGroupIcon,
  PhotoIcon,
  ChartBarIcon,
  ArrowLeftEndOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useFrontendStore } from '@/hooks/useFrontendStore';
import { useLanguage } from '@/context/LanguageContext';

export default function AdminPage() {
  const router = useRouter();
  const { store, patchStore } = useFrontendStore();
  const { tr } = useLanguage();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isClientReady, setIsClientReady] = useState(false);

  useEffect(() => {
    setIsClientReady(true);
  }, []);

  useEffect(() => {
    if (!store.admin.isLoggedIn) {
      router.replace('/admin/login');
    }
  }, [router, store.admin.isLoggedIn]);

  useEffect(() => {
    const clearAdminSession = () => {
      patchStore((prev) => ({
        ...prev,
        admin: {
          isLoggedIn: false,
          email: '',
        },
      }));
      document.cookie = 'starterkit_admin_auth=; Max-Age=0; Path=/; SameSite=Lax';
    };

    const handleRouteChangeStart = (nextUrl: string) => {
      if (!nextUrl.startsWith('/admin')) {
        clearAdminSession();
      }
    };

    const handleBeforeUnload = () => {
      clearAdminSession();
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [patchStore, router.events]);

  const tabs = useMemo(
    () => [
      { id: 'dashboard', name: 'Dashboard', icon: ChartBarIcon },
      { id: 'pc-requests', name: tr('Demandes PC', 'PC requests'), icon: ComputerDesktopIcon },
      { id: 'jobs', name: tr('Offres', 'Jobs'), icon: BriefcaseIcon },
      { id: 'applications', name: tr('Candidatures', 'Applications'), icon: UserGroupIcon },
      { id: 'carousel', name: tr('Carrousel', 'Carousel'), icon: PhotoIcon },
    ],
    [tr]
  );

  const onDecisionPc = (requestId: string, decision: 'accepted' | 'rejected') => {
    patchStore((prev) => ({
      ...prev,
      pcRequests: prev.pcRequests.map((request) =>
        request.id === requestId ? { ...request, decision } : request
      ),
    }));
  };

  const onCreateJob = (payload: { title: string; company: string; location: string; tags: string[] }) => {
    patchStore((prev) => ({
      ...prev,
      jobs: [
        {
          id: `job-${Date.now()}`,
          title: payload.title,
          company: payload.company,
          description: tr(`Offre publiee par ${payload.company}.`, `Job posted by ${payload.company}.`),
          requirements: ['CV a jour'],
          tags: payload.tags.length ? payload.tags : ['Stage'],
          location: payload.location,
          contractType: 'internship',
          deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
          status: 'active',
          createdAt: new Date().toISOString(),
          recruiterEmail: 'admin@starterkit.bj',
        },
        ...prev.jobs,
      ],
    }));
  };

  const onToggleJobStatus = (jobId: string) => {
    patchStore((prev) => ({
      ...prev,
      jobs: prev.jobs.map((job) =>
        job.id === jobId ? { ...job, status: job.status === 'active' ? 'draft' : 'active' } : job
      ),
    }));
  };

  const onDeleteJob = (jobId: string) => {
    patchStore((prev) => ({
      ...prev,
      jobs: prev.jobs.filter((job) => job.id !== jobId),
      applications: prev.applications.filter((application) => application.jobId !== jobId),
    }));
  };

  const onUpdateApplicationStatus = (applicationId: string, status: 'accepted' | 'rejected') => {
    patchStore((prev) => ({
      ...prev,
      applications: prev.applications.map((application) =>
        application.id === applicationId ? { ...application, status } : application
      ),
    }));
  };

  const logoutAdmin = () => {
    patchStore((prev) => ({
      ...prev,
      admin: {
        isLoggedIn: false,
        email: '',
      },
    }));
    document.cookie = 'starterkit_admin_auth=; Max-Age=0; Path=/; SameSite=Lax';
    router.push('/admin/login');
  };

  if (!isClientReady || !store.admin.isLoggedIn) {
    return <div className="min-h-screen bg-gray-100" />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{tr('Administration StarterKit', 'StarterKit Administration')}</h1>
            <p className="text-sm text-gray-500">{store.admin.email}</p>
          </div>
          <button
            onClick={logoutAdmin}
            className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white"
          >
            <ArrowLeftEndOnRectangleIcon className="h-4 w-4" />
            {tr('Deconnexion', 'Logout')}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-56 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-3">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${
                        activeTab === tab.id ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{tab.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-5">
              {activeTab === 'dashboard' && (
                <AdminDashboard
                  requests={store.pcRequests}
                  jobs={store.jobs}
                  applications={store.applications}
                  onDecisionPc={onDecisionPc}
                  onCreateJob={onCreateJob}
                  onToggleJobStatus={onToggleJobStatus}
                  onDeleteJob={onDeleteJob}
                  onUpdateApplicationStatus={onUpdateApplicationStatus}
                />
              )}
              {activeTab === 'pc-requests' && (
                <PcRequestsManagement requests={store.pcRequests} onDecision={onDecisionPc} />
              )}
              {activeTab === 'jobs' && (
                <JobManagement
                  jobs={store.jobs}
                  onCreateJob={onCreateJob}
                  onToggleStatus={onToggleJobStatus}
                  onDeleteJob={onDeleteJob}
                />
              )}
              {activeTab === 'applications' && (
                <JobApplicationsManagement
                  applications={store.applications}
                  onUpdateStatus={onUpdateApplicationStatus}
                />
              )}
              {activeTab === 'carousel' && (
                <CarouselManagement
                  images={store.carouselImages}
                  onChange={(images) =>
                    patchStore((prev) => ({
                      ...prev,
                      carouselImages: images,
                    }))
                  }
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookie = context.req.headers.cookie || '';
  const hasAdminCookie = cookie.split(';').some((chunk) => chunk.trim().startsWith('starterkit_admin_auth=1'));

  if (!hasAdminCookie) {
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false,
      },
    };
  }

  return { props: {} };
};
