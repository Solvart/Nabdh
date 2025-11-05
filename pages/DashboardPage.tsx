import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Donor, Requester, Establishment, Request } from '../types';
import { useI18n } from '../contexts/I18nContext';
import { Link } from 'react-router-dom';

// Icons
import { Gem, Droplet, Calendar, Award, User, Handshake, Users, ArrowRight } from 'lucide-react';
import Button from '../components/shared/Button';
import { calculateAge, isEligibleToDonate, getNextDonationDate, formatDate } from '../utils/helpers';
import BloodRequestChart from '../components/charts/BloodRequestChart';
import EstablishmentsList from '../components/shared/EstablishmentsList';

// Donor Dashboard
const DonorDashboard: React.FC<{ donor: Donor }> = ({ donor }) => {
    const { t, language } = useI18n();
    const eligible = isEligibleToDonate(donor.donationHistory?.[0]?.date);
    const lastDonation = donor.donationHistory[0];

    return (
        <div className="space-y-6">
            <div className="text-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('dashboard.donor.welcome', { name: donor.firstName })}</h1>
                <p className="text-gray-600 dark:text-gray-400">{t('dashboard.donor.subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-full text-primary"><Gem size={24}/></div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t('dashboard.donor.totalPoints')}</p>
                        <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{donor.points}</p>
                    </div>
                </div>
                 <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-full text-primary"><Droplet size={24}/></div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t('dashboard.donor.totalDonations')}</p>
                        <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{donor.donationHistory.length}</p>
                    </div>
                </div>
                 <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-full text-primary"><Award size={24}/></div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t('dashboard.donor.badgesEarned')}</p>
                        <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{donor.badges.length}</p>
                    </div>
                </div>
            </div>

            <div className={`p-6 rounded-lg shadow-sm ${eligible ? 'bg-green-50 dark:bg-green-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'}`}>
                <h2 className="font-bold text-lg mb-2 text-primary">{t('dashboard.donor.donationStatus')}</h2>
                <p className={`font-semibold ${eligible ? 'text-green-700 dark:text-green-300' : 'text-yellow-700 dark:text-yellow-300'}`}>
                    {eligible ? t('profile.eligible') : t('profile.notEligible')}
                </p>
                {lastDonation && (
                     <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {t('dashboard.donor.lastDonation')}: {formatDate(lastDonation.date, language.code)}
                    </p>
                )}
                {!eligible && lastDonation && (
                     <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {t('profile.nextDonation')}: {getNextDonationDate(lastDonation.date, language.code)}
                    </p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <Link to="/find-requests" className="block bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-lg transition-shadow">
                    <h3 className="font-bold text-lg">{t('nav.findRequests')}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('dashboard.donor.findRequestsDesc')}</p>
                </Link>
                 <Link to="/my-requests" className="block bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-lg transition-shadow">
                    <h3 className="font-bold text-lg">{t('nav.myRequests')}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('dashboard.donor.myRequestsDesc')}</p>
                </Link>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                 <div className="flex justify-between items-center">
                     <div>
                         <h2 className="text-lg font-semibold">{t('nav.leaderboard')}</h2>
                         <p className="text-gray-500 dark:text-gray-400">{t('dashboard.donor.leaderboardDesc')}</p>
                     </div>
                     <Link to="/leaderboard" className="flex items-center gap-1 text-primary font-semibold">
                         {t('global.viewAll')} <ArrowRight size={16} />
                     </Link>
                 </div>
             </div>

            <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">{t('establishmentsPage.title')}</h2>
                <EstablishmentsList />
            </div>
        </div>
    );
};

// Establishment Dashboard
const EstablishmentDashboard: React.FC<{ establishment: Establishment }> = ({ establishment }) => {
    const { t } = useI18n();
    const { requests, donors } = useAppContext();
    const myOpenRequests = requests.filter(r => r.authorId === establishment.id && r.status === 'Open');

    return (
        <div className="space-y-6">
            <div className="text-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('dashboard.est.welcome', { name: establishment.name })}</h1>
                <p className="text-gray-600 dark:text-gray-400">{t('dashboard.est.subtitle')}</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/10 rounded-full text-blue-500"><Handshake size={24}/></div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('dashboard.est.openRequests')}</p>
                            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{myOpenRequests.length}</p>
                        </div>
                    </div>
                     <Link to="/manage-requests">
                        <Button variant="secondary" fullWidth className="mt-4">{t('dashboard.est.manageRequests')}</Button>
                    </Link>
                </div>
                 <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-500/10 rounded-full text-green-500"><Users size={24}/></div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('dashboard.est.totalDonors')}</p>
                            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{donors.length}</p>
                        </div>
                    </div>
                     <Link to="/find-donors">
                        <Button variant="secondary" fullWidth className="mt-4">{t('dashboard.est.findDonors')}</Button>
                    </Link>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                 <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">{t('dashboard.est.allOpenRequests')}</h2>
                 <BloodRequestChart requests={requests.filter(r => r.status === 'Open')} />
            </div>
        </div>
    );
};


// Requester Dashboard
const RequesterDashboard: React.FC<{ requester: Requester }> = ({ requester }) => {
    const { t } = useI18n();
    const { requests } = useAppContext();
    const myRequests = requests.filter(r => r.authorId === requester.id);

    return (
        <div className="space-y-6">
            <div className="text-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('dashboard.req.welcome', { name: requester.firstName })}</h1>
                <p className="text-gray-600 dark:text-gray-400">{t('dashboard.req.subtitle')}</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-semibold">{t('dashboard.req.yourRequests')}</h2>
                        <p className="text-gray-500 dark:text-gray-400">{t('dashboard.req.yourRequestsCount', { count: myRequests.length })}</p>
                    </div>
                    <Link to="/my-requests" className="flex items-center gap-1 text-primary font-semibold">
                        {t('global.viewAll')} <ArrowRight size={16} />
                    </Link>
                </div>
            </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <Link to="/my-requests" className="block bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-lg transition-shadow">
                    <h3 className="font-bold text-lg">{t('nav.myRequests')}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('dashboard.req.myRequestsDesc')}</p>
                </Link>
                 <Link to="/search-donors" className="block bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-lg transition-shadow">
                    <h3 className="font-bold text-lg">{t('nav.findDonors')}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('dashboard.req.findDonorsDesc')}</p>
                </Link>
            </div>
        </div>
    );
};


const DashboardPage: React.FC = () => {
    const { currentUser } = useAppContext();

    if (!currentUser) {
        return <div>Loading...</div>; // Or a redirect
    }

    switch (currentUser.userType) {
        case 'donor':
            return <DonorDashboard donor={currentUser as Donor} />;
        case 'establishment':
            return <EstablishmentDashboard establishment={currentUser as Establishment} />;
        case 'requester':
            return <RequesterDashboard requester={currentUser as Requester} />;
        default:
            return <div>Invalid user type</div>;
    }
};

export default DashboardPage;