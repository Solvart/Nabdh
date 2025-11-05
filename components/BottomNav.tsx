import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { LayoutDashboard, User, Search, Trophy, Hospital, Info, Handshake, Users } from 'lucide-react';
import { useI18n } from '../contexts/I18nContext';

const BottomNav: React.FC = () => {
    const { currentUser } = useAppContext();
    const { t } = useI18n();

    if (!currentUser) return null;

    const baseLinkClass = "flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light transition-colors w-full pt-2 pb-1";
    const activeLinkClass = "!text-primary dark:!text-primary-light";

    const getLinkClass = ({ isActive }: { isActive: boolean }) =>
        `${baseLinkClass} ${isActive ? activeLinkClass : ''}`;

    const donorLinks = [
        { path: '/dashboard', icon: LayoutDashboard, label: t('nav.dashboard') },
        { path: '/find-requests', icon: Search, label: t('nav.findRequests') },
        { path: '/my-requests', icon: Handshake, label: t('nav.myRequests') },
        { path: '/leaderboard', icon: Trophy, label: t('nav.leaderboard') },
        { path: '/profile', icon: User, label: t('nav.profile') },
    ];

    const establishmentLinks = [
        { path: '/dashboard', icon: LayoutDashboard, label: t('nav.dashboard') },
        { path: '/manage-requests', icon: Handshake, label: t('nav.requests') },
        { path: '/find-donors', icon: Users, label: t('nav.donors') },
        { path: '/about', icon: Info, label: t('nav.about') },
        { path: '/establishment-profile', icon: User, label: t('nav.profile') },
    ];

    const requesterLinks = [
        { path: '/dashboard', icon: LayoutDashboard, label: t('nav.dashboard') },
        { path: '/my-requests', icon: Handshake, label: t('nav.myRequests') },
        { path: '/search-donors', icon: Users, label: t('nav.findDonors') },
        { path: '/about', icon: Info, label: t('nav.about') },
        { path: '/requester-profile', icon: User, label: t('nav.profile') },
    ];

    let links;
    switch (currentUser.userType) {
        case 'donor':
            links = donorLinks;
            break;
        case 'establishment':
            links = establishmentLinks;
            break;
        case 'requester':
            links = requesterLinks;
            break;
        default:
            links = [];
    }

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-[0_-2px_5px_-1px_rgba(0,0,0,0.1)] z-20">
            <div className="max-w-4xl mx-auto flex justify-around">
                {links.map(link => (
                    <NavLink to={link.path} key={link.path} className={getLinkClass}>
                        <link.icon size={24} />
                        <span className="text-xs mt-1">{link.label}</span>
                    </NavLink>
                ))}
            </div>
        </nav>
    );
};

export default BottomNav;