import { useCallback, useEffect, useState } from 'react';
import type { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/lib/api';

const ADMIN_COOKIE = 'starterkit_admin_auth_v2';

type PcRequestDetails = {
  id: number;
  justificationText: string;
  futureProject: string;
  confirmationStatus: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  pcType: 'BASIC' | 'STANDARD' | 'PREMIUM';
  createdAt: string;
  user: {
    id: number;
    email: string;
    profile?: {
      firstName?: string;
      lastName?: string;
      phone?: string;
    } | null;
  };
  assignedPc?: {
    id: number;
    serialNumber: string;
    brand: string;
    model: string;
    status: string;
  } | null;
};

export default function PcRequestDetailsPage() {
  const router = useRouter();
  const { tr } = useLanguage();
  const { id } = router.query;
  const [request, setRequest] = useState<PcRequestDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadRequest = useCallback(async () => {
    if (!id || Array.isArray(id)) return;
    try {
      setError('');
      setLoading(true);
      const response = await api.get(`/pc-requests/${id}`);
      setRequest(response.data || null);
    } catch (err: any) {
      setError(err?.response?.data?.message || tr('Impossible de charger la demande.', 'Could not load request.'));
      setRequest(null);
    } finally {
      setLoading(false);
    }
  }, [id, tr]);

  useEffect(() => {
    loadRequest();
  }, [loadRequest]);

  const updateStatus = async (status: 'ACCEPTED' | 'REJECTED') => {
    if (!request) return;
    try {
      await api.patch(`/pc-requests/${request.id}/status`, { status });
      await loadRequest();
    } catch (err: any) {
      setError(err?.response?.data?.message || tr('Mise a jour impossible.', 'Could not update status.'));
    }
  };

  const fullName = `${request?.user?.profile?.firstName || ''} ${request?.user?.profile?.lastName || ''}`.trim() || 'Candidate';

  return (
    <div className="min-h-screen bg-slate-100 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">{tr('Detail demande PC', 'PC request details')}</h1>
          <Link href="/admin">
            <Button variant="outline">{tr('Retour dashboard', 'Back to dashboard')}</Button>
          </Link>
        </div>

        {error && <p className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
        {loading && <p className="rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-600">{tr('Chargement...', 'Loading...')}</p>}

        {!loading && request && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <section className="lg:col-span-2 rounded-xl border border-primary-100 bg-white p-5 space-y-4">
              <div>
                <p className="text-xs text-gray-500">{tr('Projet futur', 'Future project')}</p>
                <div className="mt-1 rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">{request.futureProject}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500">{tr('Justification', 'Justification')}</p>
                <div className="mt-1 rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">{request.justificationText}</p>
                </div>
              </div>
            </section>

            <aside className="rounded-xl border border-primary-100 bg-white p-5 space-y-3">
              <div>
                <p className="text-xs text-gray-500">{tr('Candidat', 'Candidate')}</p>
                <p className="text-sm font-semibold text-gray-900">{fullName}</p>
                <p className="text-xs text-gray-600">{request.user.email}</p>
                {request.user.profile?.phone && <p className="text-xs text-gray-600">{request.user.profile.phone}</p>}
              </div>
              <div>
                <p className="text-xs text-gray-500">{tr('Categorie PC', 'PC category')}</p>
                <p className="text-sm font-semibold text-gray-900">{request.pcType}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">{tr('Statut', 'Status')}</p>
                <p className="text-sm font-semibold text-gray-900">{request.confirmationStatus}</p>
              </div>
              <div className="pt-2 flex gap-2">
                <Button
                  size="sm"
                  disabled={request.confirmationStatus !== 'PENDING'}
                  onClick={() => updateStatus('ACCEPTED')}
                >
                  {tr('Accepter', 'Accept')}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={request.confirmationStatus !== 'PENDING'}
                  onClick={() => updateStatus('REJECTED')}
                >
                  {tr('Refuser', 'Reject')}
                </Button>
              </div>
            </aside>
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
