import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useFrontendStore } from '@/hooks/useFrontendStore';
import { useLanguage } from '@/context/LanguageContext';

const DEFAULT_ADMIN_EMAIL = 'admin@starterkit.bj';
const DEFAULT_ADMIN_PASSWORD = 'Admin123!';

export default function AdminLoginPage() {
  const router = useRouter();
  const { store, patchStore } = useFrontendStore();
  const { tr } = useLanguage();
  const [form, setForm] = useState({ email: DEFAULT_ADMIN_EMAIL, password: DEFAULT_ADMIN_PASSWORD });
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (store.admin.isLoggedIn) {
      router.replace('/admin');
    }
  }, [router, store.admin.isLoggedIn]);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (form.email !== DEFAULT_ADMIN_EMAIL || form.password !== DEFAULT_ADMIN_PASSWORD) {
      setError(tr('Identifiants invalides. Utilisez les identifiants admin par defaut affiches.', 'Invalid credentials. Use the default admin credentials shown.'));
      return;
    }

    patchStore((prev) => ({
      ...prev,
      admin: {
        isLoggedIn: true,
        email: form.email,
      },
    }));
    // Session cookie: expires when browser session ends.
    document.cookie = 'starterkit_admin_auth=1; Path=/; SameSite=Lax';
    router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        <div className="max-w-md mx-auto rounded-2xl bg-white shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{tr('Connexion admin', 'Admin login')}</h1>
          <p className="text-sm text-gray-600 mb-6">
            {tr('Compte par defaut', 'Default account')}: <span className="font-semibold">{DEFAULT_ADMIN_EMAIL}</span> /{' '}
            <span className="font-semibold">{DEFAULT_ADMIN_PASSWORD}</span>
          </p>

          <form onSubmit={onSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              required
            />
            <Input
              label={tr('Mot de passe', 'Password')}
              type="password"
              value={form.password}
              onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
              required
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" fullWidth>
              {tr('Se connecter a l administration', 'Sign in to admin')}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
