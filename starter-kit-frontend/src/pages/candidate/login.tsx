import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useFrontendStore } from '@/hooks/useFrontendStore';
import { useLanguage } from '@/context/LanguageContext';

export default function CandidateLogin() {
  const router = useRouter();
  const { patchStore } = useFrontendStore();
  const { tr } = useLanguage();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    patchStore((prev) => ({
      ...prev,
      candidateSession: {
        id: `cand-${Date.now()}`,
        fullName: formData.email.split('@')[0] || tr('Candidat', 'Candidate'),
        email: formData.email,
        phone: '',
        role: 'candidate',
      },
    }));
    router.push('/candidate/profile');
  };

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
            <Button type="submit" fullWidth>
              {tr('Se connecter', 'Login')}
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
