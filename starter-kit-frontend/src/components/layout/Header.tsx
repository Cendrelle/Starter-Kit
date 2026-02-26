import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { Button } from '../ui/Button';
import { useLanguage } from '@/context/LanguageContext';
import { useFrontendStore } from '@/hooks/useFrontendStore';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const router = useRouter();
  const isAdminArea = router.pathname.startsWith('/admin');
  const { language, setLanguage, tx } = useLanguage();
  const { store } = useFrontendStore();
  const candidateSession = isHydrated ? store.candidateSession : null;

  React.useEffect(() => {
    setIsHydrated(true);
  }, []);

  const navigation = [
    { name: tx('header.home'), href: '/' },
    { 
      name: tx('header.donate'),
      href: '/donation',
      submenu: [
        { name: tx('header.commonFund'), href: '/donation?category=common' },
        { name: tx('header.donateBasic'), href: '/donation?category=basic' },
        { name: tx('header.donateStandard'), href: '/donation?category=standard' },
        { name: tx('header.donatePremium'), href: '/donation?category=premium' },
      ]
    },
    { name: tx('header.jobs'), href: '/jobs' },
    { name: tx('header.requestPc'), href: '/candidate/pc-request' },
    { name: tx('header.impact'), href: '/impact' },
  ];

  const isActive = (path: string) => router.pathname === path;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-xl">SK</span>
            </div>
            <span className="font-bold text-xl text-gray-900">
              Starter<span className="text-primary-600">Kit</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <div key={item.name} className="relative group">
                {item.submenu ? (
                  <>
                    <button
                      className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary-600 ${
                        isActive(item.href) ? 'text-primary-600' : 'text-gray-700'
                      }`}
                    >
                      <span>{item.name}</span>
                      <ChevronDownIcon className="h-4 w-4" />
                    </button>
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 first:rounded-t-lg last:rounded-b-lg"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={`text-sm font-medium transition-colors hover:text-primary-600 ${
                      isActive(item.href) ? 'text-primary-600' : 'text-gray-700'
                    }`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Language + Auth */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="inline-flex rounded-lg border border-gray-200 p-1">
              <button
                onClick={() => setLanguage('fr')}
                className={`px-2 py-1 text-xs font-semibold rounded ${
                  language === 'fr' ? 'bg-primary-600 text-white' : 'text-gray-600'
                }`}
              >
                {tx('common.languageFr')}
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 text-xs font-semibold rounded ${
                  language === 'en' ? 'bg-primary-600 text-white' : 'text-gray-600'
                }`}
              >
                {tx('common.languageEn')}
              </button>
            </div>
            {!isAdminArea && (
              <>
            <Link href={candidateSession ? '/candidate/profile' : '/candidate/login'}>
              <Button variant="ghost" size="sm">
                {candidateSession ? tx('footer.profile') : tx('common.login')}
              </Button>
            </Link>
            {!candidateSession && (
              <Link href="/candidate/register">
                <Button size="sm">
                  {tx('common.register')}
                </Button>
              </Link>
            )}
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {isMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.submenu ? (
                  <>
                    <div className="py-2 text-base font-medium text-gray-700">
                      {item.name}
                    </div>
                    <div className="pl-4 space-y-1">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="block py-2 text-sm text-gray-600 hover:text-primary-600"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={`block py-2 text-base font-medium ${
                      isActive(item.href) ? 'text-primary-600' : 'text-gray-700'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
            <div className="mt-4 space-y-2 pt-4 border-t">
              <div className="flex gap-2">
                <Button
                  variant={language === 'fr' ? 'primary' : 'outline'}
                  fullWidth
                  onClick={() => setLanguage('fr')}
                >
                  {tx('common.languageFr')}
                </Button>
                <Button
                  variant={language === 'en' ? 'primary' : 'outline'}
                  fullWidth
                  onClick={() => setLanguage('en')}
                >
                  {tx('common.languageEn')}
                </Button>
              </div>
              {!isAdminArea && (
              <>
              <Link href={candidateSession ? '/candidate/profile' : '/candidate/login'} className="block">
                <Button variant="outline" fullWidth>
                  {candidateSession ? tx('footer.profile') : tx('common.login')}
                </Button>
              </Link>
              {!candidateSession && (
                <Link href="/candidate/register" className="block">
                  <Button fullWidth>
                    {tx('common.register')}
                  </Button>
                </Link>
              )}
              </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
