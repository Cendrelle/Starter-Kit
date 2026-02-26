import React from 'react';
import { useRouter } from 'next/router';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const isAdminArea = router.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      {!isAdminArea && <Footer />}
    </div>
  );
};
