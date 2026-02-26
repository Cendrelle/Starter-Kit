import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useFrontendStore } from '@/hooks/useFrontendStore';
import { MagnifyingGlassIcon, MapPinIcon, BriefcaseIcon } from '@heroicons/react/24/outline';
import { JOB_TAGS, LOCATIONS_BENIN, CONTRACT_TYPES } from '@/utils/constants';
import { useLanguage } from '@/context/LanguageContext';
import { JobRecord } from '@/utils/frontendStore';
import { api } from '@/lib/api';
import { mapBackendJobToJobRecord } from '@/lib/mappers';

interface Filters {
  domain: string;
  location: string;
  contractType: string;
}

export default function JobsPage() {
  const { store, patchStore } = useFrontendStore();
  const { tr } = useLanguage();
  const candidateSession = store.candidateSession;
  const [backendJobs, setBackendJobs] = useState<JobRecord[] | null>(null);
  const [jobsError, setJobsError] = useState('');
  const [filters, setFilters] = useState<Filters>({ domain: '', location: '', contractType: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [activeApplyJobId, setActiveApplyJobId] = useState<string | null>(null);
  const [applyError, setApplyError] = useState('');
  const [isSubmittingApplication, setIsSubmittingApplication] = useState(false);
  const [applyForm, setApplyForm] = useState({
    fullName: candidateSession?.fullName || '',
    email: candidateSession?.email || '',
    phone: candidateSession?.phone || '',
    cvUrl: '',
    coverLetter: '',
  });

  useEffect(() => {
    let isMounted = true;

    const fetchJobs = async () => {
      try {
        setJobsError('');
        const response = await api.get('/jobs');
        if (!isMounted) return;
        const mapped = Array.isArray(response.data) ? response.data.map(mapBackendJobToJobRecord) : [];
        setBackendJobs(mapped);
      } catch {
        if (!isMounted) return;
        setJobsError(tr('Impossible de charger les offres depuis le serveur.', 'Could not load jobs from server.'));
        setBackendJobs(null);
      }
    };

    fetchJobs();

    return () => {
      isMounted = false;
    };
  }, [tr]);

  const jobs = useMemo(() => {
    const sourceJobs = backendJobs || [];

    return sourceJobs.filter((job) => {
      if (job.status !== 'active') return false;
      if (filters.domain && !job.tags.includes(filters.domain)) return false;
      if (filters.location && job.location !== filters.location) return false;
      if (filters.contractType && job.contractType !== filters.contractType) return false;
      if (searchTerm) {
        const raw = `${job.title} ${job.description} ${job.company} ${job.tags.join(' ')}`.toLowerCase();
        if (!raw.includes(searchTerm.toLowerCase())) return false;
      }
      return true;
    });
  }, [backendJobs, filters, searchTerm]);

  const submitApplication = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!activeApplyJobId) return;
    setApplyError('');

    try {
      setIsSubmittingApplication(true);
      const response = await api.post(`/jobs/${activeApplyJobId}/apply`, {
        fullName: applyForm.fullName || candidateSession?.fullName || tr('Candidat', 'Candidate'),
        email: (applyForm.email || candidateSession?.email || '').trim().toLowerCase(),
        phone: applyForm.phone || candidateSession?.phone || '',
        message: applyForm.coverLetter,
      });

      const created = response?.data?.application;
      if (created) {
        patchStore((prev) => ({
          ...prev,
          applications: [
            {
              id: String(created.id),
              jobId: String(created.jobId),
              userId: candidateSession?.id || `guest-${Date.now()}`,
              fullName: created.fullName,
              email: created.email,
              phone: created.phone || '',
              cvUrl: applyForm.cvUrl || '/cv/non-fourni.pdf',
              coverLetter: created.message || '',
              status: String(created.status || 'PENDING').toLowerCase() as 'pending' | 'accepted' | 'rejected' | 'reviewed',
              appliedAt: created.createdAt || new Date().toISOString(),
            },
            ...prev.applications,
          ],
        }));
      }

      setApplyForm({
        fullName: candidateSession?.fullName || '',
        email: candidateSession?.email || '',
        phone: candidateSession?.phone || '',
        cvUrl: '',
        coverLetter: '',
      });
      setActiveApplyJobId(null);
    } catch (err: any) {
      setApplyError(err?.response?.data?.message || tr('Candidature impossible.', 'Could not submit application.'));
    } finally {
      setIsSubmittingApplication(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{tr('Offres de stage', 'Internship offers')}</h1>
          <p className="text-xl text-gray-600">
            {tr(
              'Postulez directement sans creer de compte. Votre dossier arrive dans le dashboard admin.',
              'Apply directly without creating an account. Your application goes to the admin dashboard.'
            )}
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder={tr('Rechercher un stage, une entreprise...', 'Search internships, companies...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h3 className="font-bold text-lg mb-4">{tr('Filtres', 'Filters')}</h3>
              <div className="space-y-4">
                <select
                  className="input-field"
                  value={filters.domain}
                  onChange={(e) => setFilters((prev) => ({ ...prev, domain: e.target.value }))}
                >
                  <option value="">{tr('Tous les domaines', 'All domains')}</option>
                  {JOB_TAGS.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
                <select
                  className="input-field"
                  value={filters.location}
                  onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value }))}
                >
                  <option value="">{tr('Toutes les villes', 'All cities')}</option>
                  {LOCATIONS_BENIN.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
                <select
                  className="input-field"
                  value={filters.contractType}
                  onChange={(e) => setFilters((prev) => ({ ...prev, contractType: e.target.value }))}
                >
                  <option value="">{tr('Tous les contrats', 'All contracts')}</option>
                  {CONTRACT_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => setFilters({ domain: '', location: '', contractType: '' })}
                >
                  {tr('Reinitialiser', 'Reset')}
                </Button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-4">
            {jobsError && <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">{jobsError}</p>}
            <p className="text-gray-600">
              <span className="font-semibold">{jobs.length}</span> {tr('offre(s) active(s)', 'active job(s)')}
            </p>

            {jobs.map((job) => (
              <div key={job.id} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                    <p className="text-gray-600">{job.company}</p>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-500 mt-2">
                      <span className="inline-flex items-center">
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        {job.location}
                      </span>
                      <span className="inline-flex items-center">
                        <BriefcaseIcon className="h-4 w-4 mr-1" />
                        {CONTRACT_TYPES.find((item) => item.value === job.contractType)?.label || 'Stage'}
                      </span>
                    </div>
                  </div>
                  <Button size="sm" onClick={() => setActiveApplyJobId(activeApplyJobId === job.id ? null : job.id)}>
                    {activeApplyJobId === job.id ? tr('Fermer', 'Close') : tr('Postuler', 'Apply')}
                  </Button>
                </div>
                <p className="text-gray-700 mt-4">{job.description}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {job.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold">
                      #{tag}
                    </span>
                  ))}
                </div>

                {activeApplyJobId === job.id && (
                  <form onSubmit={submitApplication} className="mt-5 rounded-lg border border-gray-200 p-4 space-y-3">
                    <p className="font-semibold text-gray-900">{tr('Candidater rapidement', 'Quick apply')}</p>
                    <div className="grid md:grid-cols-2 gap-3">
                      <Input
                        label={tr('Nom complet', 'Full name')}
                        value={applyForm.fullName}
                        onChange={(e) => setApplyForm((prev) => ({ ...prev, fullName: e.target.value }))}
                        required
                      />
                      <Input
                        label="Email"
                        type="email"
                        value={applyForm.email}
                        onChange={(e) => setApplyForm((prev) => ({ ...prev, email: e.target.value }))}
                        required
                      />
                      <Input
                        label={tr('Telephone', 'Phone')}
                        value={applyForm.phone}
                        onChange={(e) => setApplyForm((prev) => ({ ...prev, phone: e.target.value }))}
                        required
                      />
                      <Input
                        label={tr('Lien CV (optionnel)', 'CV link (optional)')}
                        value={applyForm.cvUrl}
                        onChange={(e) => setApplyForm((prev) => ({ ...prev, cvUrl: e.target.value }))}
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{tr('Message', 'Message')}</label>
                      <textarea
                        value={applyForm.coverLetter}
                        onChange={(e) => setApplyForm((prev) => ({ ...prev, coverLetter: e.target.value }))}
                        rows={4}
                        className="input-field"
                        placeholder={tr('Pourquoi vous correspondez a ce stage ?', 'Why are you a fit for this internship?')}
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit" size="sm" disabled={isSubmittingApplication}>
                        {isSubmittingApplication ? tr('Envoi...', 'Submitting...') : tr('Envoyer ma candidature', 'Submit application')}
                      </Button>
                    </div>
                    {applyError && <p className="text-sm text-red-600">{applyError}</p>}
                  </form>
                )}
              </div>
            ))}

            {jobs.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                {tr('Aucune offre ne correspond aux filtres.', 'No internship matches your filters.')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
