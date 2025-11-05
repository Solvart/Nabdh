import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { useI18n } from '../../contexts/I18nContext';
import { Donor, Badge } from '../../types';
import { calculateAge, formatDate } from '../../utils/helpers';
import { Award, Droplet, Calendar, MapPin, Phone, Gem, ArrowLeft } from 'lucide-react';
import Avatar from '../../components/shared/Avatar';
import DonationHistoryChart from '../../components/charts/DonationHistoryChart';
import BadgeIcon from '../../components/gamification/BadgeIcon';

const BadgeDisplay: React.FC<{ badge: Badge }> = ({ badge }) => {
    const { t } = useI18n();
    return (
        <div className="group relative flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-amber-500 mb-2">
                <BadgeIcon name={badge.icon} size={32} />
            </div>
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">{t(badge.nameKey)}</p>
             <div className="absolute bottom-full mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {t(badge.descriptionKey)}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800"></div>
            </div>
        </div>
    );
}

const DonorPublicProfilePage: React.FC = () => {
    const { donorId } = useParams<{ donorId: string }>();
    const { donors } = useAppContext();
    const { t, language } = useI18n();

    const donor = donors.find(d => d.id === donorId);

    if (!donor) {
        return (
            <div className="text-center py-10">
                <h1 className="text-2xl font-bold text-red-500">{t('publicProfile.notFound')}</h1>
                <Link to="/leaderboard" className="text-primary hover:underline mt-4 inline-block">
                    {t('publicProfile.backToLeaderboard')}
                </Link>
            </div>
        );
    }
    
    const fullName = `${donor.firstName} ${donor.lastName}`;

    return (
        <div className="space-y-6">
            <div className="relative">
                <Link 
                    to="/leaderboard" 
                    className="absolute top-0 left-0 rtl:right-0 rtl:left-auto flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light transition-colors p-2 rounded-full sm:px-3 sm:py-1.5 sm:rounded-lg sm:font-semibold sm:bg-gray-100 sm:dark:bg-gray-700 sm:hover:bg-gray-200 sm:dark:hover:bg-gray-600"
                >
                    <ArrowLeft size={16} />
                    <span className="hidden sm:inline">{t('publicProfile.backToLeaderboard')}</span>
                </Link>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md pt-12">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative">
                         {donor.profilePictureUrl ? (
                            <img src={donor.profilePictureUrl} alt={fullName} className="w-24 h-24 rounded-full object-cover ring-4 ring-primary/20" />
                         ) : (
                            <Avatar name={fullName} className="w-24 h-24 text-4xl ring-4 ring-primary/20" />
                         )}
                    </div>
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{fullName}</h1>
                        <p className="text-gray-600 dark:text-gray-400">@{donor.username}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">{t('profile.personalInfo')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
                    <div className="flex items-center"><Award size={18} className="mr-3 rtl:ml-3 rtl:mr-0 text-gray-400"/><strong>{t('profile.age')}:</strong><span className="ml-2 rtl:mr-2 rtl:ml-0">{calculateAge(donor.dateOfBirth)}</span></div>
                    <div className="flex items-center"><Droplet size={18} className="mr-3 rtl:ml-3 rtl:mr-0 text-gray-400"/><strong>{t('auth.bloodGroupLabel')}:</strong><span className="ml-2 rtl:mr-2 rtl:ml-0">{donor.bloodGroup}</span></div>
                    <div className="flex items-center"><MapPin size={18} className="mr-3 rtl:ml-3 rtl:mr-0 text-gray-400"/><strong>{t('auth.addressLabel')}:</strong><span className="ml-2 rtl:mr-2 rtl:ml-0">{donor.commune}, {donor.wilaya}</span></div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">{t('profile.pointsAndBadges')}</h2>
                 <div className="text-center bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg mb-6">
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t('profile.totalPoints')}</p>
                    <p className="text-4xl font-bold text-primary flex items-center justify-center gap-2">{donor.points} <Gem size={28}/></p>
                </div>
                {donor.badges.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {donor.badges.map(badge => (
                           <BadgeDisplay key={badge.id} badge={badge} />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">{t('profile.noBadges')}</p>
                )}
            </div>

             <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{t('profile.donationHistory')}</h2>
                </div>
                {donor.donationHistory.length > 0 ? (
                    <>
                        <div className="mb-6">
                            <DonationHistoryChart donations={donor.donationHistory} />
                        </div>
                        <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
                            {donor.donationHistory.map(donation => (
                                <li key={donation.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <div className="flex items-center">
                                        <Calendar size={20} className="mr-3 rtl:ml-3 rtl:mr-0 text-primary"/>
                                        <div>
                                            <p className="font-semibold text-gray-800 dark:text-gray-200">{donation.establishmentName}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(donation.date, language.code)}</p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </>
                ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">{t('profile.noDonations')}</p>
                )}
            </div>
        </div>
    );
};

export default DonorPublicProfilePage;