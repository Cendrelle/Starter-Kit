import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useFrontendStore } from '@/hooks/useFrontendStore';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/context/LanguageContext';

export default function CandidateProfilePage() {
  const router = useRouter();
  const { store, patchStore } = useFrontendStore();
  const { tr } = useLanguage();
  const user = store.candidateSession;

  const myPcRequests = useMemo(
    () => (user ? store.pcRequests.filter((item) => item.candidateEmail === user.email) : []),
    [store.pcRequests, user]
  );
  const myApplications = useMemo(
    () => (user ? store.applications.filter((item) => item.email === user.email) : []),
    [store.applications, user]
  );

  if (!user) {
    if (typeof window !== 'undefined') router.replace('/candidate/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container-custom space-y-6">
        <div className="rounded-2xl bg-white p-6 shadow-md border border-gray-100">
          <div className="flex flex-wrap justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{tr('Mon profil candidat', 'My candidate profile')}</h1>
              <p className="text-gray-600">{user.fullName}</p>
              <p className="text-gray-500 text-sm">{user.email}</p>
            </div>
            <div className="flex gap-2">
              <Link href="/candidate/pc-request">
                <Button size="sm">{tr('Faire une demande PC', 'Submit PC request')}</Button>
              </Link>
              <button
                className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold"
                onClick={() => {
                  patchStore((prev) => ({ ...prev, candidateSession: null }));
                  router.push('/candidate/login');
                }}
              >
                {tr('Deconnexion', 'Logout')}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <section className="rounded-2xl bg-white p-5 shadow-md border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-3">{tr('Mes demandes de PC', 'My PC requests')}</h2>
            {myPcRequests.length === 0 && <p className="text-sm text-gray-500">{tr('Aucune demande pour le moment.', 'No requests yet.')}</p>}
            <div className="space-y-3">
              {myPcRequests.map((request) => (
                <div key={request.id} className="rounded-lg border border-gray-200 p-3">
                  <p className="text-sm text-gray-700">{tr('Categorie', 'Category')}: {request.category}</p>
                  <p className="text-sm text-gray-700">{tr('Objectif', 'Goal')}: {request.professionalGoal}</p>
                  <p className="text-xs text-gray-500">{tr('Statut', 'Status')}: {request.decision}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl bg-white p-5 shadow-md border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-3">{tr('Mes candidatures stage', 'My internship applications')}</h2>
            {myApplications.length === 0 && <p className="text-sm text-gray-500">{tr('Aucune candidature envoyee.', 'No application submitted yet.')}</p>}
            <div className="space-y-3">
              {myApplications.map((application) => (
                <div key={application.id} className="rounded-lg border border-gray-200 p-3">
                  <p className="text-sm text-gray-700">{tr('Offre', 'Job')}: {application.jobId}</p>
                  <p className="text-sm text-gray-700">{tr('Telephone', 'Phone')}: {application.phone}</p>
                  <p className="text-xs text-gray-500">{tr('Statut', 'Status')}: {application.status}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
