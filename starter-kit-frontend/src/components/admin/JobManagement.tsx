import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { JobRecord } from '@/utils/frontendStore';
import { Input } from '@/components/ui/Input';
import { useLanguage } from '@/context/LanguageContext';

interface JobManagementProps {
  jobs: JobRecord[];
  onCreateJob: (payload: { title: string; company: string; location: string; tags: string[] }) => void;
  onToggleStatus: (jobId: string) => void;
  onDeleteJob: (jobId: string) => void;
  compact?: boolean;
}

export const JobManagement: React.FC<JobManagementProps> = ({
  jobs,
  onCreateJob,
  onToggleStatus,
  onDeleteJob,
  compact = false,
}) => {
  const { tr } = useLanguage();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    tags: '',
  });

  const submitForm = (event: React.FormEvent) => {
    event.preventDefault();
    onCreateJob({
      title: form.title,
      company: form.company,
      location: form.location,
      tags: form.tags
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    });
    setForm({ title: '', company: '', location: '', tags: '' });
    setShowForm(false);
  };

  return (
    <div>
      <div className={`flex flex-wrap items-center justify-between gap-3 ${compact ? 'mb-4' : 'mb-6'}`}>
        <h2 className={`font-bold text-gray-900 ${compact ? 'text-xl' : 'text-2xl'}`}>{tr('Offres de stage', 'Internship offers')}</h2>
        <Button size="sm" onClick={() => setShowForm((prev) => !prev)}>
          {showForm ? tr('Fermer', 'Close') : tr('Ajouter une offre', 'Add a job')}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={submitForm} className="mb-5 rounded-xl border border-gray-200 p-4 grid md:grid-cols-2 gap-3">
          <Input
            label={tr('Titre', 'Title')}
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            required
          />
          <Input
            label={tr('Entreprise', 'Company')}
            value={form.company}
            onChange={(e) => setForm((prev) => ({ ...prev, company: e.target.value }))}
            required
          />
          <Input
            label={tr('Ville', 'City')}
            value={form.location}
            onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
            required
          />
          <Input
            label={tr('Tags (separes par virgule)', 'Tags (comma separated)')}
            value={form.tags}
            onChange={(e) => setForm((prev) => ({ ...prev, tags: e.target.value }))}
          />
          <div className="md:col-span-2 flex justify-end">
            <Button type="submit" size="sm">
              {tr('Publier l offre', 'Publish job')}
            </Button>
          </div>
        </form>
      )}

      <div className="rounded-xl border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">{tr('Titre', 'Title')}</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">{tr('Entreprise', 'Company')}</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">{tr('Localisation', 'Location')}</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">{tr('Statut', 'Status')}</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">{tr('Actions', 'Actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {jobs.length === 0 && (
              <tr>
                <td className="px-4 py-10 text-center text-gray-500" colSpan={5}>
                  {tr('Aucune offre disponible.', 'No job available.')}
                </td>
              </tr>
            )}
            {jobs.map((job) => (
              <tr key={job.id}>
                <td className="px-4 py-3 font-medium text-gray-900">{job.title}</td>
                <td className="px-4 py-3">{job.company}</td>
                <td className="px-4 py-3">{job.location}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      job.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {job.status === 'active' ? tr('Active', 'Active') : tr('Desactivee', 'Disabled')}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      className="px-3 py-1.5 rounded-md bg-slate-800 text-white text-xs font-semibold"
                      onClick={() => onToggleStatus(job.id)}
                    >
                      {job.status === 'active' ? tr('Desactiver', 'Disable') : tr('Activer', 'Activate')}
                    </button>
                    <button
                      className="px-3 py-1.5 rounded-md bg-rose-600 text-white text-xs font-semibold"
                      onClick={() => onDeleteJob(job.id)}
                    >
                      {tr('Supprimer', 'Delete')}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
