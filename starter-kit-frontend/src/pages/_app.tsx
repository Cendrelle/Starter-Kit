import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { setAuthScope } from '@/lib/auth';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.location.hostname !== 'localhost') return;

    // Prevent stale localhost service workers from hijacking Next assets.
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister();
        });
      });
    }

    // Clear cache storage that may serve stale /_next static files.
    if ('caches' in window) {
      caches.keys().then((keys) => {
        keys.forEach((key) => {
          caches.delete(key);
        });
      });
    }
  }, []);

  useEffect(() => {
    if (router.pathname.startsWith('/admin')) {
      setAuthScope('admin');
      return;
    }
    if (router.pathname.startsWith('/candidate')) {
      setAuthScope('candidate');
    }
  }, [router.pathname]);

  return (
    <LanguageProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </LanguageProvider>
  );
}
