import React from 'react';
import { JobApplication } from '@/utils/types';
import { JobRecord, PcRequestRecord } from '@/utils/frontendStore';
import { PcRequestsManagement } from '@/components/admin/PcRequestsManagement';
import { JobManagement } from '@/components/admin/JobManagement';
import { JobApplicationsManagement } from '@/components/admin/JobApplicationsManagement';
import { useLanguage } from '@/context/LanguageContext';

interface AdminDashboardProps {
  requests: PcRequestRecord[];
  jobs: JobRecord[];
  applications: JobApplication[];
  onDecisionPc: (id: string, decision: 'accepted' | 'rejected') => void;
  onCreateJob: (payload: { title: string; company: string; location: string; tags: string[] }) => void;
  onToggleJobStatus: (jobId: string) => void;
  onDeleteJob: (jobId: string) => void;
  onUpdateApplicationStatus: (id: string, status: 'accepted' | 'rejected') => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  requests,
  jobs,
  applications,
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

  const stats = [
    { label: tr('Demandes PC en attente', 'Pending PC requests'), value: pendingPc },
    { label: tr('Demandes PC acceptees', 'Approved PC requests'), value: acceptedPc },
    { label: tr('Offres actives', 'Active jobs'), value: activeJobs },
    { label: tr('Candidatures en attente', 'Pending applications'), value: pendingApplications },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{tr('Tableau de bord admin', 'Admin dashboard')}</h2>
        <p className="text-sm text-gray-600">{tr('Vue operationnelle en temps reel (frontend).', 'Real-time operational view (frontend).')}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((item) => (
          <div key={item.label} className="rounded-xl border border-gray-200 bg-gradient-to-b from-white to-gray-50 p-4">
            <p className="text-xs text-gray-500">{item.label}</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{item.value}</p>
          </div>
        ))}
      </div>

      <section className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 md:p-5">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-blue-900">{tr('Ligne 1: Gestion des demandes PC', 'Row 1: PC request management')}</h3>
          <p className="text-xs text-blue-800">{tr('Les actions accepter/refuser se bloquent automatiquement apres decision.', 'Accept/Reject actions are disabled after decision.')}</p>
        </div>
        <PcRequestsManagement requests={requests} onDecision={onDecisionPc} compact />
      </section>

      <section className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 md:p-5">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-emerald-900">{tr('Ligne 2: Offres de stage et candidatures', 'Row 2: Jobs and applications')}</h3>
          <p className="text-xs text-emerald-800">{tr('Publication, activation/desactivation et suivi des candidatures.', 'Posting, activation/deactivation and application tracking.')}</p>
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
