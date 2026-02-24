import React from 'react';
import Link from 'next/link';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaYoutube } from 'react-icons/fa';
import { useLanguage } from '@/context/LanguageContext';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { tx } = useLanguage();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">StarterKit</h3>
            <p className="text-gray-400 mb-4">{tx('footer.pitch')}</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaLinkedin size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaYoutube size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">{tx('footer.quickLinks')}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  {tx('header.home')}
                </Link>
              </li>
              <li>
                <Link href="/donation" className="text-gray-400 hover:text-white transition-colors">
                  {tx('header.donate')}
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="text-gray-400 hover:text-white transition-colors">
                  {tx('header.jobs')}
                </Link>
              </li>
              <li>
                <Link href="/impact" className="text-gray-400 hover:text-white transition-colors">
                  {tx('header.impact')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">{tx('footer.candidates')}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/candidate/register" className="text-gray-400 hover:text-white transition-colors">
                  {tx('header.requestPc')}
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="text-gray-400 hover:text-white transition-colors">
                  {tx('footer.applyInternship')}
                </Link>
              </li>
              <li>
                <Link href="/candidate/profile" className="text-gray-400 hover:text-white transition-colors">
                  {tx('footer.profile')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">{tx('footer.donors')}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/donation" className="text-gray-400 hover:text-white transition-colors">
                  {tx('footer.howToDonate')}
                </Link>
              </li>
              <li>
                <Link href="/impact" className="text-gray-400 hover:text-white transition-colors">
                  {tx('footer.transparency')}
                </Link>
              </li>
              <li>
                <Link href="/impact" className="text-gray-400 hover:text-white transition-colors">
                  {tx('footer.ourImpact')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>
            &copy; {currentYear} StarterKit. {tx('footer.rights')}
          </p>
          <p className="mt-2 text-sm">
            {tx('footer.signature')}
          </p>
        </div>
      </div>
    </footer>
  );
};
