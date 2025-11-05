import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/shared/Button';
import { useI18n } from '../contexts/I18nContext';
import ThemeSwitcher from '../components/shared/ThemeSwitcher';
import LanguageSwitcher from '../components/shared/LanguageSwitcher';
import Logo from '../components/shared/Logo';


const HomePage: React.FC = () => {
  const { t } = useI18n();
  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-red-100 to-white dark:from-red-900/20 dark:to-gray-900 p-4 relative">
      
      <header className="absolute top-4 right-4 flex items-center gap-2 z-10">
        <LanguageSwitcher displayMode="full" />
        <ThemeSwitcher />
      </header>

      <main className="flex flex-col items-center justify-center flex-grow w-full">
        <div className="text-center max-w-lg">
          
          <h1 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100 sm:text-5xl">
            {t('home.welcome')}
          </h1>
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
            {t('home.tagline')}
          </p>
        </div>

        <div className="mt-12 w-full max-w-xs space-y-4">
          <Link to="/donor-auth" className="block">
            <Button fullWidth variant="primary">
              {t('home.donorSpace')}
            </Button>
          </Link>
          <Link to="/establishment-auth" className="block">
            <Button fullWidth variant="secondary">
              {t('home.establishmentSpace')}
            </Button>
          </Link>
          <Link to="/requester-auth" className="block">
            <Button fullWidth className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600">
              {t('home.requesterSpace')}
            </Button>
          </Link>
        </div>
      </main>

      <footer className="w-full py-8 flex flex-col items-center justify-center gap-4">
        <Logo className="h-16 w-auto opacity-75" />
        <p className="text-center text-gray-500 dark:text-gray-400 text-sm">{t('home.copyright')}</p>
      </footer>
    </div>
  );
};

export default HomePage;