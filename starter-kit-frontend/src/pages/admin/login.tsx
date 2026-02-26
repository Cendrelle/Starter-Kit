import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useFrontendStore } from '@/hooks/useFrontendStore';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/lib/api';
import { getRoleFromToken, setAuthToken } from '@/lib/auth';

const ADMIN_COOKIE = 'starterkit_admin_auth_v2';

export default function AdminLoginPage() {
  const router = useRouter();
  const { store, patchStore, isHydrated } = useFrontendStore();
  const { tr } = useLanguage();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  React.useEffect(() => {
    if (!isHydrated) return;

    const hasAdminCookie = document.cookie
      .split(';')
      .some((chunk) => chunk.trim().startsWith(`${ADMIN_COOKIE}=1`));

    if (store.admin.isLoggedIn && !hasAdminCookie) {
      patchStore((prev) => ({
        ...prev,
        admin: { isLoggedIn: false, email: '' },
      }));
      return;
    }

    if (store.admin.isLoggedIn && hasAdminCookie) {
      router.replace('/admin');
    }
  }, [isHydrated, patchStore, router, store.admin.isLoggedIn]);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      setIsSubmitting(true);
      const response = await api.post('/auth/login', {
        email: form.email,
        password: form.password,
      });
      const token = response.data?.token;
      if (!token) throw new Error('Token manquant');

      const role = getRoleFromToken(token);
      if (role !== 'ADMIN') {
        throw new Error(tr('Acces reserve aux admins.', 'Admin role required.'));
      }

      setAuthToken(token, 'admin');
      patchStore((prev) => ({
        ...prev,
        admin: {
          isLoggedIn: true,
          email: form.email,
        },
      }));
      document.cookie = 'starterkit_admin_auth=; Max-Age=0; Path=/; SameSite=Lax';
      document.cookie = `${ADMIN_COOKIE}=1; Path=/; SameSite=Lax`;
      router.push('/admin');
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || tr('Connexion admin impossible.', 'Admin login failed.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isMounted) {
    return <div className="min-h-screen bg-gray-50" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        <div className="max-w-md mx-auto rounded-2xl bg-white shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{tr('Connexion admin', 'Admin login')}</h1>
          <p className="text-sm text-gray-600 mb-6">{tr('Connectez-vous avec un compte ADMIN du backend.', 'Sign in with a backend ADMIN account.')}</p>

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
            <Button type="submit" fullWidth disabled={isSubmitting}>
              {isSubmitting ? tr('Connexion...', 'Signing in...') : tr('Se connecter a l administration', 'Sign in to admin')}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
