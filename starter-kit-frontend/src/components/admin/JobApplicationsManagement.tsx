import React from 'react';
import { JobApplication } from '@/utils/types';
import { useLanguage } from '@/context/LanguageContext';

interface JobApplicationsManagementProps {
  applications: JobApplication[];
  onUpdateStatus: (applicationId: string, status: 'accepted' | 'rejected') => void;
  compact?: boolean;
}

const statusBadge: Record<JobApplication['status'], string> = {
  pending: 'bg-amber-100 text-amber-800',
  reviewed: 'bg-blue-100 text-blue-800',
  accepted: 'bg-emerald-100 text-emerald-800',
  rejected: 'bg-rose-100 text-rose-800',
};

export const JobApplicationsManagement: React.FC<JobApplicationsManagementProps> = ({
  applications,
  onUpdateStatus,
  compact = false,
}) => {
  const { tr } = useLanguage();
  return (
    <div>
      <h2 className={`font-bold text-gray-900 ${compact ? 'text-xl mb-4' : 'text-2xl mb-6'}`}>
        {tr('Candidatures aux stages', 'Internship applications')}
      </h2>
      <div className="rounded-xl border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">{tr('Candidat', 'Candidate')}</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">{tr('Offre', 'Job')}</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Email</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">{tr('Telephone', 'Phone')}</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">{tr('Statut', 'Status')}</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">{tr('Actions', 'Actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {applications.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-gray-500">
                  {tr('Aucune candidature pour le moment.', 'No application yet.')}
                </td>
              </tr>
            )}
            {applications.map((app) => {
              const locked = app.status === 'accepted' || app.status === 'rejected';
              return (
                <tr key={app.id} className={locked ? 'bg-gray-50' : ''}>
                  <td className="px-4 py-3 font-medium text-gray-900">{app.fullName}</td>
                  <td className="px-4 py-3">{app.jobId}</td>
                  <td className="px-4 py-3">{app.email}</td>
                  <td className="px-4 py-3">{app.phone}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusBadge[app.status]}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        className="px-3 py-1.5 rounded-md bg-emerald-600 text-white text-xs font-semibold disabled:bg-gray-300"
                        onClick={() => onUpdateStatus(app.id, 'accepted')}
                        disabled={locked}
                      >
                        {tr('Accepter', 'Accept')}
                      </button>
                      <button
                        className="px-3 py-1.5 rounded-md bg-rose-600 text-white text-xs font-semibold disabled:bg-gray-300"
                        onClick={() => onUpdateStatus(app.id, 'rejected')}
                        disabled={locked}
                      >
                        {tr('Refuser', 'Reject')}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
