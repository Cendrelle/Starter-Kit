import React from 'react';
import { JobApplication, PlatformOverviewStats } from '@/utils/types';
import { JobRecord, PcRequestRecord } from '@/utils/frontendStore';
import { PcRequestsManagement } from '@/components/admin/PcRequestsManagement';
import { JobManagement } from '@/components/admin/JobManagement';
import { JobApplicationsManagement } from '@/components/admin/JobApplicationsManagement';
import { useLanguage } from '@/context/LanguageContext';
import { formatFCFA } from '@/utils/currency';

interface AdminDashboardProps {
  requests: PcRequestRecord[];
  jobs: JobRecord[];
  applications: JobApplication[];
  overviewStats: PlatformOverviewStats | null;
  onDecisionPc: (id: string, decision: 'accepted' | 'rejected') => void;
  onCreateJob: (payload: { title: string; company: string; location: string; tags: string[]; description: string }) => void;
  onToggleJobStatus: (jobId: string) => void;
  onDeleteJob: (jobId: string) => void;
  onUpdateApplicationStatus: (id: string, status: 'accepted' | 'rejected') => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  requests,
  jobs,
  applications,
  overviewStats,
  onDecisionPc,
  onCreateJob,
  onToggleJobStatus,
  onDeleteJob,
  onUpdateApplicationStatus,
}) => {
  const { tr } = useLanguage();
  const acceptedPc = requests.filter((item) => item.decision === 'accepted').length;
  const pendingPc = requests.filter((item) => item.decision === 'pending').length;
  const activeJobs = jobs.filter((item) => item.status === 'active').length;
  const pendingApplications = applications.filter((item) => item.status === 'pending').length;

  const fallbackStats = [
    { label: tr('Demandes PC en attente', 'Pending PC requests'), value: pendingPc },
    { label: tr('Demandes PC acceptees', 'Approved PC requests'), value: acceptedPc },
    { label: tr('Offres actives', 'Active jobs'), value: activeJobs },
    { label: tr('Candidatures en attente', 'Pending applications'), value: pendingApplications },
  ];

  const extendedStats = overviewStats ? [
    { label: tr('Dons recus (FCFA)', 'Donations received (FCFA)'), value: formatFCFA(overviewStats.donations.totalRaised) },
    { label: tr('Inventaire total PC', 'Total PC inventory'), value: overviewStats.inventory.total },
    { label: tr('PC en stock', 'PC in stock'), value: overviewStats.inventory.inStock },
    { label: tr('PC livres', 'Delivered PCs'), value: overviewStats.inventory.delivered },
    { label: tr('Demandes PC en attente', 'Pending PC requests'), value: overviewStats.pcRequests.pending },
    { label: tr('Demandes PC acceptees', 'Approved PC requests'), value: overviewStats.pcRequests.accepted },
    { label: tr('Offres actives', 'Active jobs'), value: overviewStats.jobs.active },
    { label: tr('Candidatures en attente', 'Pending applications'), value: overviewStats.applications.pending },
  ] : fallbackStats;

  const stats = extendedStats;

  const statsGridClass = overviewStats
    ? 'grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-2 md:gap-3'
    : 'grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{tr('Tableau de bord admin', 'Admin dashboard')}</h2>
        <p className="text-sm text-gray-600">{tr('Vue operationnelle en temps reel (frontend).', 'Real-time operational view (frontend).')}</p>
      </div>

      <div className={statsGridClass}>
        {stats.map((item) => (
          <div key={item.label} className="rounded-lg md:rounded-xl border border-primary-100 bg-gradient-to-b from-white to-primary-50/30 p-3 md:p-4">
            <p className="text-xs text-gray-500">{item.label}</p>
            <p className="mt-1 text-lg md:text-2xl font-bold text-gray-900">{item.value}</p>
          </div>
        ))}
      </div>

      <section className="rounded-2xl border border-primary-200 bg-primary-50/70 p-4 md:p-5">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-primary-900">{tr('Ligne 1: Gestion des demandes PC', 'Row 1: PC request management')}</h3>
          <p className="text-xs text-primary-800">{tr('Les actions accepter/refuser se bloquent automatiquement apres decision.', 'Accept/Reject actions are disabled after decision.')}</p>
        </div>
        <PcRequestsManagement requests={requests} onDecision={onDecisionPc} compact />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 md:p-5">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-slate-900">{tr('Ligne 2: Offres de stage et candidatures', 'Row 2: Jobs and applications')}</h3>
          <p className="text-xs text-slate-700">{tr('Publication, activation/desactivation et suivi des candidatures.', 'Posting, activation/deactivation and application tracking.')}</p>
        </div>
        <div className="grid grid-cols-1 gap-5">
          <JobManagement
            jobs={jobs}
            onCreateJob={onCreateJob}
            onToggleStatus={onToggleJobStatus}
            onDeleteJob={onDeleteJob}
            compact
          />
          <JobApplicationsManagement
            applications={applications}
            onUpdateStatus={onUpdateApplicationStatus}
            compact
          />
        </div>
      </section>
    </div>
  );
};
