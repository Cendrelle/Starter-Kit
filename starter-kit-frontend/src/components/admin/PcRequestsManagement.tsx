import React from 'react';
import { useRouter } from 'next/router';
import { PcRequestRecord } from '@/utils/frontendStore';
import { useLanguage } from '@/context/LanguageContext';

interface PcRequestsManagementProps {
  requests: PcRequestRecord[];
  onDecision: (requestId: string, decision: 'accepted' | 'rejected') => void;
  compact?: boolean;
}

const decisionBadge: Record<PcRequestRecord['decision'], string> = {
  pending: 'bg-amber-100 text-amber-800',
  accepted: 'bg-emerald-100 text-emerald-800',
  rejected: 'bg-rose-100 text-rose-800',
};

export const PcRequestsManagement: React.FC<PcRequestsManagementProps> = ({
  requests,
  onDecision,
  compact = false,
}) => {
  const { tr } = useLanguage();
  const router = useRouter();

  const openDetails = (id: string) => {
    router.push(`/admin/pc-requests/${id}`);
  };

  return (
    <div>
      <h2 className={`font-bold text-gray-900 ${compact ? 'text-xl mb-4' : 'text-2xl mb-6'}`}>
        {tr('Demandes de PC', 'PC requests')}
      </h2>
      <div className="md:hidden space-y-3">
        {requests.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
            {tr('Aucune demande de PC.', 'No PC request.')}
          </div>
        )}
        {requests.map((request) => {
          const disabled = request.decision !== 'pending';
          return (
            <article
              key={request.id}
              className={`rounded-xl border p-4 cursor-pointer ${disabled ? 'border-gray-100 bg-gray-50' : 'border-gray-200 bg-white'}`}
              onClick={() => openDetails(request.id)}
            >
              <p className="font-semibold text-gray-900">{request.candidateName}</p>
              <p className="text-xs text-gray-500">{request.candidateEmail}</p>
              <p className="text-xs text-gray-500">{request.candidatePhone}</p>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500">{tr('Categorie', 'Category')}</p>
                  <p className="font-semibold uppercase tracking-wide">{request.category}</p>
                </div>
                <div>
                  <p className="text-gray-500">{tr('Statut', 'Status')}</p>
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${decisionBadge[request.decision]}`}>
                    {request.decision === 'pending' && tr('En attente', 'Pending')}
                    {request.decision === 'accepted' && tr('Acceptee', 'Accepted')}
                    {request.decision === 'rejected' && tr('Refusee', 'Rejected')}
                  </span>
                </div>
              </div>
              <div className="mt-3">
                <p className="text-xs text-gray-500">{tr('Projet', 'Project')}</p>
                <div className="mt-1 rounded-lg border border-gray-200 bg-gray-50 p-2">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap break-words max-h-24 overflow-auto">
                    {request.professionalGoal}
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-2">{tr('Justification', 'Justification')}</p>
                <div className="mt-1 rounded-lg border border-gray-200 bg-gray-50 p-2">
                  <p className="text-sm text-gray-600 whitespace-pre-wrap break-words max-h-24 overflow-auto">
                    {request.reason}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-md bg-slate-700 text-white text-xs font-semibold hover:bg-slate-800"
                  onClick={(event) => {
                    event.stopPropagation();
                    openDetails(request.id);
                  }}
                >
                  {tr('Voir', 'View')}
                </button>
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-md bg-emerald-600 text-white text-xs font-semibold disabled:bg-gray-300"
                  onClick={(event) => {
                    event.stopPropagation();
                    onDecision(request.id, 'accepted');
                  }}
                  disabled={disabled}
                >
                  {tr('Accepter', 'Accept')}
                </button>
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-md bg-rose-600 text-white text-xs font-semibold disabled:bg-gray-300"
                  onClick={(event) => {
                    event.stopPropagation();
                    onDecision(request.id, 'rejected');
                  }}
                  disabled={disabled}
                >
                  {tr('Refuser', 'Reject')}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <div className="hidden md:block rounded-xl border border-primary-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-primary-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-primary-900">{tr('Candidat', 'Candidate')}</th>
              <th className="px-4 py-3 text-left font-semibold text-primary-900">{tr('Categorie', 'Category')}</th>
              <th className="px-4 py-3 text-left font-semibold text-primary-900">{tr('Projet', 'Project')}</th>
              <th className="px-4 py-3 text-left font-semibold text-primary-900">{tr('Statut', 'Status')}</th>
              <th className="px-4 py-3 text-left font-semibold text-primary-900">{tr('Action', 'Action')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {requests.length === 0 && (
              <tr>
                <td className="px-4 py-10 text-center text-gray-500" colSpan={5}>
                  {tr('Aucune demande de PC.', 'No PC request.')}
                </td>
              </tr>
            )}
            {requests.map((request) => {
              const disabled = request.decision !== 'pending';
              return (
                <tr key={request.id} className={`${disabled ? 'bg-gray-50' : ''} cursor-pointer`} onClick={() => openDetails(request.id)}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{request.candidateName}</p>
                    <p className="text-xs text-gray-500">{request.candidateEmail}</p>
                    <p className="text-xs text-gray-500">{request.candidatePhone}</p>
                  </td>
                  <td className="px-4 py-3 uppercase text-xs font-semibold tracking-wide">{request.category}</td>
                  <td className="px-4 py-3 max-w-xs">
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-2">
                      <p className="text-gray-700 text-sm whitespace-pre-wrap break-words max-h-24 overflow-auto">
                        {request.professionalGoal}
                      </p>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">{tr('Justification', 'Justification')}</p>
                    <div className="mt-1 rounded-lg border border-gray-200 bg-gray-50 p-2">
                      <p className="text-xs text-gray-500 whitespace-pre-wrap break-words max-h-20 overflow-auto">
                        {request.reason}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${decisionBadge[request.decision]}`}>
                      {request.decision === 'pending' && tr('En attente', 'Pending')}
                      {request.decision === 'accepted' && tr('Acceptee', 'Accepted')}
                      {request.decision === 'rejected' && tr('Refusee', 'Rejected')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="px-3 py-1.5 rounded-md bg-slate-700 text-white text-xs font-semibold hover:bg-slate-800"
                        onClick={(event) => {
                          event.stopPropagation();
                          openDetails(request.id);
                        }}
                      >
                        {tr('Voir', 'View')}
                      </button>
                      <button
                        type="button"
                        className="px-3 py-1.5 rounded-md bg-emerald-600 text-white text-xs font-semibold disabled:bg-gray-300"
                        onClick={(event) => {
                          event.stopPropagation();
                          onDecision(request.id, 'accepted');
                        }}
                        disabled={disabled}
                      >
                        {tr('Accepter', 'Accept')}
                      </button>
                      <button
                        type="button"
                        className="px-3 py-1.5 rounded-md bg-rose-600 text-white text-xs font-semibold disabled:bg-gray-300"
                        onClick={(event) => {
                          event.stopPropagation();
                          onDecision(request.id, 'rejected');
                        }}
                        disabled={disabled}
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
