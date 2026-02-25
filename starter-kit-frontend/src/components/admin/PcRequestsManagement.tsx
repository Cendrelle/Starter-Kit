import React from 'react';
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
  return (
    <div>
      <h2 className={`font-bold text-gray-900 ${compact ? 'text-xl mb-4' : 'text-2xl mb-6'}`}>
        {tr('Demandes de PC', 'PC requests')}
      </h2>
      <div className="rounded-xl border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">{tr('Candidat', 'Candidate')}</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">{tr('Categorie', 'Category')}</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">{tr('Objectif', 'Goal')}</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">{tr('Statut', 'Status')}</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">{tr('Action', 'Action')}</th>
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
                <tr key={request.id} className={disabled ? 'bg-gray-50' : ''}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{request.candidateName}</p>
                    <p className="text-xs text-gray-500">{request.candidateEmail}</p>
                    <p className="text-xs text-gray-500">{request.candidatePhone}</p>
                  </td>
                  <td className="px-4 py-3 uppercase text-xs font-semibold tracking-wide">{request.category}</td>
                  <td className="px-4 py-3 max-w-xs">
                    <p className="text-gray-700 line-clamp-3">{request.professionalGoal}</p>
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
                        className="px-3 py-1.5 rounded-md bg-emerald-600 text-white text-xs font-semibold disabled:bg-gray-300"
                        onClick={() => onDecision(request.id, 'accepted')}
                        disabled={disabled}
                      >
                        {tr('Accepter', 'Accept')}
                      </button>
                      <button
                        className="px-3 py-1.5 rounded-md bg-rose-600 text-white text-xs font-semibold disabled:bg-gray-300"
                        onClick={() => onDecision(request.id, 'rejected')}
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
