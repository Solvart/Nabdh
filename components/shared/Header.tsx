import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import ThemeSwitcher from './ThemeSwitcher';
import LanguageSwitcher from './LanguageSwitcher';
import { LogOut } from 'lucide-react';
import Avatar from './Avatar';
import { useI18n } from '../../contexts/I18nContext';
import { Donor, Requester, Establishment } from '../../types';

const Header: React.FC = () => {
    const { currentUser, logout } = useAppContext();
    const { t } = useI18n();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };
    
    const getUserName = () => {
        if (!currentUser) return '';
        if (currentUser.userType === 'donor' || currentUser.userType === 'requester') {
            return (currentUser as Donor | Requester).firstName;
        }
        if (currentUser.userType === 'establishment') {
            return (currentUser as Establishment).name;
        }
        return '';
    };

    const getAvatarName = () => {
        if (!currentUser) return '';
        
        if (currentUser.profilePictureUrl) {
            return currentUser.profilePictureUrl;
        }

        if (currentUser.userType === 'donor' || currentUser.userType === 'requester') {
            const user = currentUser as Donor | Requester;
            return `${user.firstName} ${user.lastName}`;
        }
        if (currentUser.userType === 'establishment') {
            return (currentUser as Establishment).name;
        }
        return '';
    };

    const isImageUrl = (name: string) => name.startsWith('data:image') || name.startsWith('http');

    const getProfileLink = () => {
        if (!currentUser) return '/dashboard';
        switch (currentUser.userType) {
            case 'donor':
                return '/profile';
            case 'establishment':
                return '/establishment-profile';
            case 'requester':
                return '/requester-profile';
            default:
                return '/dashboard';
        }
    };


    return (
        <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-20">
            <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
                {currentUser && (
                    <Link to={getProfileLink()} className="flex items-center gap-2">
                        {isImageUrl(getAvatarName()) ? 
                            <img src={getAvatarName()} alt="Profile" className="w-10 h-10 rounded-full object-cover" /> :
                            <Avatar name={getAvatarName()} className="w-10 h-10 text-lg" />
                        }
                    </Link>
                )}

                <div className="flex items-center gap-2">
                    <LanguageSwitcher displayMode="short" />
                    <ThemeSwitcher />
                    {currentUser && (
                        <div className="flex items-center gap-3">
                             <div className="hidden sm:flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {t('header.greeting', { name: getUserName() })}
                                </span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                aria-label={t('header.logout')}
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
