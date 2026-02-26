import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useFrontendStore } from '@/hooks/useFrontendStore';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/lib/api';
import { buildCandidateSession, setAuthToken } from '@/lib/auth';

export default function CandidateLogin() {
  const router = useRouter();
  const { patchStore } = useFrontendStore();
  const { tr } = useLanguage();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      setIsSubmitting(true);
      const response = await api.post('/auth/login', {
        email: formData.email,
        password: formData.password,
      });
      const token = response.data?.token;
      if (!token) throw new Error('Token manquant');

      setAuthToken(token, 'candidate');
      const session = buildCandidateSession(formData.email, token);

      patchStore((prev) => ({
        ...prev,
        candidateSession: session,
      }));
      router.push('/candidate/profile');
    } catch (err: any) {
      const message = err?.response?.data?.message || tr('Connexion impossible.', 'Could not login.');
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitLabel = isSubmitting ? tr('Connexion...', 'Logging in...') : tr('Se connecter', 'Login');

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{tr('Connexion', 'Login')}</h1>
          <p className="text-gray-600 mb-6">
            {tr('Connectez-vous pour gerer vos demandes et votre profil.', 'Log in to manage your requests and profile.')}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input
              label={tr('Mot de passe', 'Password')}
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" fullWidth disabled={isSubmitting}>
              {submitLabel}
            </Button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            {tr('Pas encore de compte ?', 'No account yet?')}{' '}
            <Link href="/candidate/register" className="text-primary-600 hover:underline font-semibold">
              {tr('S inscrire', 'Sign up')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
