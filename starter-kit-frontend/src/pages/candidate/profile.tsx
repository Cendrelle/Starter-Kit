import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useFrontendStore } from '@/hooks/useFrontendStore';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/context/LanguageContext';
import { JobRecord, PcRequestRecord } from '@/utils/frontendStore';
import { clearAuthToken } from '@/lib/auth';
import { api } from '@/lib/api';
import { mapBackendJobApplicationToRecord, mapBackendJobToJobRecord, mapBackendPcRequestToRecord } from '@/lib/mappers';
import { JobApplication } from '@/utils/types';

export default function CandidateProfilePage() {
  const router = useRouter();
  const { store, patchStore } = useFrontendStore();
  const { tr } = useLanguage();
  const [isClientReady, setIsClientReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [myPcRequests, setMyPcRequests] = useState<PcRequestRecord[]>([]);
  const [myApplications, setMyApplications] = useState<JobApplication[]>([]);
  const [jobs, setJobs] = useState<JobRecord[]>([]);
  const user = isClientReady ? store.candidateSession : null;

  useEffect(() => {
    setIsClientReady(true);
  }, []);

  useEffect(() => {
    if (isClientReady && !store.candidateSession) {
      router.replace('/candidate/login');
    }
  }, [isClientReady, router, store.candidateSession]);

  useEffect(() => {
    if (!isClientReady || !store.candidateSession) return;

    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        setError('');

        const [pcRes, appRes, jobsRes] = await Promise.all([
          api.get('/pc-requests/me'),
          api.get('/job-applications/me'),
          api.get('/jobs'),
        ]);

        const pcRequest = pcRes.data
          ? [
              mapBackendPcRequestToRecord({
                ...pcRes.data,
                user: {
                  id: Number(store.candidateSession?.id) || 0,
                  email: store.candidateSession?.email || '',
                  profile: {
                    firstName: store.candidateSession?.fullName.split(' ')[0] || '',
                    lastName: store.candidateSession?.fullName.split(' ').slice(1).join(' '),
                  },
                },
              }),
            ]
          : [];
        setMyPcRequests(pcRequest);
        setMyApplications((appRes.data || []).map(mapBackendJobApplicationToRecord));
        setJobs((jobsRes.data || []).map(mapBackendJobToJobRecord));
      } catch (err: any) {
        setError(err?.response?.data?.message || tr('Chargement du profil impossible.', 'Could not load profile data.'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [isClientReady, store.candidateSession, tr]);

  const jobById = useMemo(
    () =>
      jobs.reduce<Record<string, JobRecord>>((acc, job) => {
        acc[job.id] = job;
        return acc;
      }, {}),
    [jobs]
  );

  if (!isClientReady || !user) {
    return <div className="min-h-screen bg-gray-50 py-10" />;
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
                  clearAuthToken('candidate');
                  patchStore((prev) => ({ ...prev, candidateSession: null }));
                  router.push('/candidate/login');
                }}
              >
                {tr('Deconnexion', 'Logout')}
              </button>
            </div>
          </div>
        </div>
        {error && <p className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
        {isLoading && <p className="rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-600">{tr('Chargement...', 'Loading...')}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <section className="rounded-2xl bg-white p-5 shadow-md border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-3">{tr('Mes demandes de PC', 'My PC requests')}</h2>
            {myPcRequests.length === 0 && <p className="text-sm text-gray-500">{tr('Aucune demande pour le moment.', 'No requests yet.')}</p>}
            <div className="space-y-3">
              {myPcRequests.map((request) => (
                <div key={request.id} className="rounded-lg border border-gray-200 p-3">
                  <p className="text-sm text-gray-700">{tr('Categorie', 'Category')}: {request.category}</p>
                  <p className="text-sm text-gray-700">{tr('Projet', 'Project')}: {request.professionalGoal}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs text-gray-500">{tr('Statut', 'Status')}:</span>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-sm font-bold ${
                        request.decision === 'accepted'
                          ? 'bg-emerald-100 text-emerald-800'
                          : request.decision === 'rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {request.decision === 'pending' && tr('En attente', 'Pending')}
                      {request.decision === 'accepted' && tr('Acceptee', 'Accepted')}
                      {request.decision === 'rejected' && tr('Refusee', 'Rejected')}
                    </span>
                  </div>
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
                  <p className="text-sm text-gray-700">
                    {tr('Offre', 'Job')}: {jobById[application.jobId]?.title || application.jobId}
                  </p>
                  <p className="text-sm text-gray-700">
                    {tr('Entreprise', 'Company')}: {jobById[application.jobId]?.company || tr('Non disponible', 'Unavailable')}
                  </p>
                  <p className="text-sm text-gray-700">
                    {tr('Localisation', 'Location')}: {jobById[application.jobId]?.location || tr('Non disponible', 'Unavailable')}
                  </p>
                  <p className="text-sm text-gray-700">{tr('Telephone', 'Phone')}: {application.phone}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs text-gray-500">{tr('Statut', 'Status')}:</span>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-sm font-bold ${
                        application.status === 'accepted'
                          ? 'bg-emerald-100 text-emerald-800'
                          : application.status === 'rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : application.status === 'reviewed'
                              ? 'bg-primary-100 text-primary-800'
                              : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {application.status === 'pending' && tr('En attente', 'Pending')}
                      {application.status === 'reviewed' && tr('En revue', 'Reviewed')}
                      {application.status === 'accepted' && tr('Acceptee', 'Accepted')}
                      {application.status === 'rejected' && tr('Refusee', 'Rejected')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
