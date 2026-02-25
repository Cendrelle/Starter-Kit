import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useFrontendStore } from '@/hooks/useFrontendStore';
import { useLanguage } from '@/context/LanguageContext';

export default function CandidateRegister() {
  const router = useRouter();
  const { patchStore } = useFrontendStore();
  const { tr } = useLanguage();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError(tr('Les mots de passe ne correspondent pas.', 'Passwords do not match.'));
      return;
    }
    patchStore((prev) => ({
      ...prev,
      candidateSession: {
        id: `cand-${Date.now()}`,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        role: 'candidate',
      },
    }));
    router.push('/candidate/profile');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{tr('Creer un compte', 'Create an account')}</h1>
          <p className="text-gray-600 mb-6">
            {tr('Inscrivez-vous pour demander un PC et suivre vos actions.', 'Sign up to request a PC and track your actions.')}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={tr('Nom complet', 'Full name')}
              value={formData.fullName}
              onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
              required
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              required
            />
            <Input
              label={tr('Telephone', 'Phone')}
              value={formData.phone}
              onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
            />
            <Input
              label={tr('Mot de passe', 'Password')}
              type="password"
              value={formData.password}
              onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
              required
            />
            <Input
              label={tr('Confirmer le mot de passe', 'Confirm password')}
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
              required
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" fullWidth>
              {tr('Creer mon compte', 'Create my account')}
            </Button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            {tr('Deja inscrit ?', 'Already registered?')}{' '}
            <Link href="/candidate/login" className="text-primary-600 hover:underline font-semibold">
              {tr('Se connecter', 'Login')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
