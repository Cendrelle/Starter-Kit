import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import type { GetServerSideProps } from 'next';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { JobManagement } from '@/components/admin/JobManagement';
import { PcRequestsManagement } from '@/components/admin/PcRequestsManagement';
import { JobApplicationsManagement } from '@/components/admin/JobApplicationsManagement';
import { CarouselManagement } from '@/components/admin/CarouselManagement';
import { JobApplication } from '@/utils/types';
import { PlatformOverviewStats } from '@/utils/types';
import { JobRecord, PcRequestRecord } from '@/utils/frontendStore';
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
import { api } from '@/lib/api';
import { clearAuthToken } from '@/lib/auth';
import {
  mapBackendJobApplicationToRecord,
  mapBackendJobToJobRecord,
  mapBackendPcRequestToRecord,
} from '@/lib/mappers';

interface AdminPageProps {
  hasAdminCookie: boolean;
}
const ADMIN_COOKIE = 'starterkit_admin_auth_v2';

export default function AdminPage({ hasAdminCookie }: AdminPageProps) {
  const router = useRouter();
  const { store, patchStore } = useFrontendStore();
  const { tr } = useLanguage();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [requests, setRequests] = useState<PcRequestRecord[]>([]);
  const [jobs, setJobs] = useState<JobRecord[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [overviewStats, setOverviewStats] = useState<PlatformOverviewStats | null>(null);

  const fetchAdminData = useCallback(async () => {
    try {
      setError('');
      const [pcRes, jobsRes, appsRes, statsRes] = await Promise.all([
        api.get('/pc-requests'),
        api.get('/jobs'),
        api.get('/job-applications/admin'),
        api.get('/stats/overview'),
      ]);
      setRequests((pcRes.data || []).map(mapBackendPcRequestToRecord));
      setJobs((jobsRes.data || []).map(mapBackendJobToJobRecord));
      setApplications((appsRes.data || []).map(mapBackendJobApplicationToRecord));
      setOverviewStats(statsRes.data || null);
    } catch (err: any) {
      setError(err?.response?.data?.message || tr('Chargement admin impossible.', 'Could not load admin data.'));
    } finally {
      setIsLoading(false);
    }
  }, [tr]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!hasAdminCookie) return;
    fetchAdminData();
  }, [hasAdminCookie, fetchAdminData]);

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

  const onDecisionPc = async (requestId: string, decision: 'accepted' | 'rejected') => {
    try {
      await api.patch(`/pc-requests/${requestId}/status`, {
        status: decision === 'accepted' ? 'ACCEPTED' : 'REJECTED',
      });
      await fetchAdminData();
    } catch (err: any) {
      setError(err?.response?.data?.message || tr('Mise a jour demande PC impossible.', 'Could not update PC request.'));
    }
  };

  const onCreateJob = async (payload: {
    title: string;
    company: string;
    location: string;
    tags: string[];
    description: string;
  }) => {
    try {
      await api.post('/jobs', {
        title: payload.title,
        companyName: payload.company,
        description: payload.description,
        location: payload.location,
      });
      await fetchAdminData();
    } catch (err: any) {
      setError(err?.response?.data?.message || tr('Creation offre impossible.', 'Could not create job.'));
    }
  };

  const onToggleJobStatus = async (jobId: string) => {
    const current = jobs.find((item) => item.id === jobId);
    if (!current) return;
    try {
      await api.patch(`/jobs/${jobId}/status`, {
        isActive: current.status !== 'active',
      });
      await fetchAdminData();
    } catch (err: any) {
      setError(err?.response?.data?.message || tr('Mise a jour offre impossible.', 'Could not update job.'));
    }
  };

  const onDeleteJob = async (jobId: string) => {
    try {
      await api.delete(`/jobs/${jobId}`);
      await fetchAdminData();
    } catch (err: any) {
      setError(err?.response?.data?.message || tr('Suppression offre impossible.', 'Could not delete job.'));
    }
  };

  const onUpdateApplicationStatus = async (applicationId: string, status: 'accepted' | 'rejected') => {
    try {
      await api.patch(`/job-applications/admin/${applicationId}/status`, {
        status: status === 'accepted' ? 'ACCEPTED' : 'REJECTED',
      });
      await fetchAdminData();
    } catch (err: any) {
      setError(err?.response?.data?.message || tr('Mise a jour candidature impossible.', 'Could not update application.'));
    }
  };

  const logoutAdmin = () => {
    clearAuthToken('admin');
    patchStore((prev) => ({
      ...prev,
      admin: {
        isLoggedIn: false,
        email: '',
      },
    }));
    document.cookie = 'starterkit_admin_auth=; Max-Age=0; Path=/; SameSite=Lax';
    document.cookie = `${ADMIN_COOKIE}=; Max-Age=0; Path=/; SameSite=Lax`;
    router.push('/admin/login');
  };

  if (!isMounted) {
    return <div className="min-h-screen bg-slate-100" />;
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="bg-white shadow-sm border-b border-primary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{tr('Administration StarterKit', 'StarterKit Administration')}</h1>
            <p className="text-sm text-gray-500">{store.admin.email}</p>
          </div>
          <button
            onClick={logoutAdmin}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-700 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-800"
          >
            <ArrowLeftEndOnRectangleIcon className="h-4 w-4" />
            {tr('Deconnexion', 'Logout')}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 md:py-6">
        {error && <p className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
        {isLoading ? (
          <div className="rounded-xl border border-primary-100 bg-white p-5 text-sm text-gray-600">
            {tr('Chargement des donnees admin...', 'Loading admin data...')}
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            <div className="md:w-56 flex-shrink-0">
              <div className="bg-white rounded-xl shadow-sm p-3 border border-primary-100">
                <nav className="grid grid-cols-2 gap-2 md:grid-cols-1 md:space-y-1 md:gap-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center justify-center md:justify-start space-x-2 md:space-x-3 px-2.5 py-2.5 rounded-lg transition-colors text-xs md:text-sm ${
                          activeTab === tab.id ? 'bg-primary-100 text-primary-800' : 'text-slate-700 hover:bg-primary-50'
                        }`}
                      >
                        <Icon className="h-4 w-4 md:h-5 md:w-5" />
                        <span className="font-medium">{tab.name}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            <div className="flex-1">
              <div className="bg-white rounded-xl shadow-sm p-3 md:p-5 border border-primary-100">
                {activeTab === 'dashboard' && (
                  <AdminDashboard
                    requests={requests}
                    jobs={jobs}
                    applications={applications}
                    overviewStats={overviewStats}
                    onDecisionPc={onDecisionPc}
                    onCreateJob={onCreateJob}
                    onToggleJobStatus={onToggleJobStatus}
                    onDeleteJob={onDeleteJob}
                    onUpdateApplicationStatus={onUpdateApplicationStatus}
                  />
                )}
                {activeTab === 'pc-requests' && <PcRequestsManagement requests={requests} onDecision={onDecisionPc} />}
                {activeTab === 'jobs' && (
                  <JobManagement jobs={jobs} onCreateJob={onCreateJob} onToggleStatus={onToggleJobStatus} onDeleteJob={onDeleteJob} />
                )}
                {activeTab === 'applications' && (
                  <JobApplicationsManagement applications={applications} onUpdateStatus={onUpdateApplicationStatus} />
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
        )}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookie = context.req.headers.cookie || '';
  const hasAdminCookie = cookie.split(';').some((chunk) => chunk.trim().startsWith(`${ADMIN_COOKIE}=1`));

  if (!hasAdminCookie) {
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false,
      },
    };
  }

  return { props: { hasAdminCookie: true } };
};
