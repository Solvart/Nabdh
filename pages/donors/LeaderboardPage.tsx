import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { useI18n } from '../../contexts/I18nContext';
import { Trophy, Gem, Eye, Filter, ChevronDown, Search } from 'lucide-react';
import Avatar from '../../components/shared/Avatar';
import BadgeIcon from '../../components/gamification/BadgeIcon';
import { Donor } from '../../types';
import Input from '../../components/shared/Input';
import Select from '../../components/shared/Select';
import { BLOOD_GROUPS, WILAYAS } from '../../constants';

const LeaderboardCard: React.FC<{ donor: Donor; rank: number; isCurrentUser: boolean }> = ({ donor, rank, isCurrentUser }) => {
    const { t } = useI18n();
    const fullName = `${donor.firstName} ${donor.lastName}`;

    const rankIndicator = () => {
        if (rank <= 3) {
            const colors = ['bg-amber-400', 'bg-slate-300 dark:bg-slate-400', 'bg-amber-600/80 dark:bg-amber-700'];
            const shadow = ['shadow-amber-500/50', 'shadow-slate-500/50', 'shadow-amber-800/50']
            return (
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg ${colors[rank - 1]} ${shadow[rank - 1]}`}>
                    <Trophy size={20} />
                </div>
            );
        }
        return (
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold text-lg">
                {rank}
            </div>
        );
    };

    return (
        <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-3 sm:p-4 flex items-center gap-3 sm:gap-4 transition-all ${isCurrentUser ? 'ring-2 ring-primary' : ''}`}>
            {rankIndicator()}
            {donor.profilePictureUrl ? (
                <img src={donor.profilePictureUrl} alt={fullName} className="w-12 h-12 rounded-full object-cover" />
            ) : (
                <Avatar name={fullName} className="w-12 h-12 text-lg" />
            )}
            <div className="flex-1">
                <p className="font-semibold text-gray-800 dark:text-gray-100">{fullName} {isCurrentUser && <span className="text-xs text-primary">({t('leaderboard.you')})</span>}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">@{donor.username}</p>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex items-center gap-1.5 font-bold text-primary text-sm sm:text-base">
                    <span>{donor.points}</span>
                    <Gem size={16} />
                </div>
                <div className="hidden sm:flex items-center gap-1.5 pl-3 sm:pl-4 border-l dark:border-gray-700">
                    {donor.badges.slice(0, 3).map(badge => (
                        <div key={badge.id} className="group relative">
                            <BadgeIcon name={badge.icon} size={20} className="text-gray-500 dark:text-gray-400"/>
                            <div className="absolute bottom-full mb-2 w-40 p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                {t(badge.nameKey)}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800"></div>
                            </div>
                        </div>
                    ))}
                </div>
                <Link to={`/donor/${donor.id}`} title={t('leaderboard.viewProfile')} className="p-2 text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary-light rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                    <Eye size={20} />
                </Link>
            </div>
        </div>
    );
};


const LeaderboardPage: React.FC = () => {
    const { donors, currentUser } = useAppContext();
    const { t } = useI18n();
    const [searchTerm, setSearchTerm] = useState('');
    const [bloodGroupFilter, setBloodGroupFilter] = useState('');
    const [wilayaFilter, setWilayaFilter] = useState('');
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    const filteredAndSortedDonors = useMemo(() => {
        return donors
            .filter(donor => {
                const nameMatch = `${donor.firstName} ${donor.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
                const bloodGroupMatch = bloodGroupFilter ? donor.bloodGroup === bloodGroupFilter : true;
                const wilayaMatch = wilayaFilter ? donor.wilaya === wilayaFilter : true;
                return nameMatch && bloodGroupMatch && wilayaMatch;
            })
            .sort((a, b) => (b.points || 0) - (a.points || 0));
    }, [donors, searchTerm, bloodGroupFilter, wilayaFilter]);

    return (
        <div className="space-y-6">
            <div className="text-center">
                <Trophy size={48} className="mx-auto text-amber-400" />
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-2">{t('leaderboard.title')}</h1>
                <p className="text-md text-gray-500 dark:text-gray-400 max-w-lg mx-auto">{t('leaderboard.subtitle')}</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm sticky top-[73px] z-10">
                 <button onClick={() => setIsFiltersOpen(!isFiltersOpen)} className="w-full flex justify-between items-center text-left font-semibold text-gray-700 dark:text-gray-200">
                    <span className="flex items-center gap-2"><Filter size={16}/> {t('global.toggleFilters')}</span>
                    <ChevronDown size={20} className={`transition-transform ${isFiltersOpen ? 'rotate-180' : ''}`} />
                 </button>
                 {isFiltersOpen && (
                    <div className="mt-4 border-t pt-4 dark:border-gray-700">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                           <Input 
                                id="search"
                                label={t('donorsList.searchByNameLabel')}
                                placeholder={t('donorsList.searchByNamePlaceholder')}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                icon={<Search size={20} />}
                            />
                            <Select id="bloodGroup" label={t('auth.bloodGroupLabel')} value={bloodGroupFilter} onChange={e => setBloodGroupFilter(e.target.value)}>
                                <option value="">{t('donorsList.allGroups')}</option>
                                {BLOOD_GROUPS.map(group => <option key={group} value={group}>{group}</option>)}
                            </Select>
                            <Select id="wilaya" label={t('auth.wilayaLabel')} value={wilayaFilter} onChange={e => setWilayaFilter(e.target.value)}>
                                <option value="">{t('donorsList.allWilayas')}</option>
                                {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
                            </Select>
                        </div>
                    </div>
                 )}
            </div>
             <div className="space-y-3">
                {filteredAndSortedDonors.map((donor, index) => (
                    <LeaderboardCard 
                        key={donor.id} 
                        donor={donor} 
                        rank={index + 1}
                        isCurrentUser={donor.id === currentUser?.id}
                    />
                ))}
            </div>
        </div>
    );
};

export default LeaderboardPage;