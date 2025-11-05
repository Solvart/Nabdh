import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import DonorCard from '../../components/DonorCard';
import Input from '../../components/shared/Input';
import Select from '../../components/shared/Select';
import { BLOOD_GROUPS, WILAYAS } from '../../constants';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { useI18n } from '../../contexts/I18nContext';

const DonorsList: React.FC = () => {
    const { donors } = useAppContext();
    const { t } = useI18n();
    const [searchTerm, setSearchTerm] = useState('');
    const [bloodGroupFilter, setBloodGroupFilter] = useState('');
    const [wilayaFilter, setWilayaFilter] = useState('');
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    const filteredDonors = useMemo(() => {
        return donors.filter(donor => {
            const nameMatch = `${donor.firstName} ${donor.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
            const bloodGroupMatch = bloodGroupFilter ? donor.bloodGroup === bloodGroupFilter : true;
            const wilayaMatch = wilayaFilter ? donor.wilaya === wilayaFilter : true;
            return nameMatch && bloodGroupMatch && wilayaMatch;
        });
    }, [donors, searchTerm, bloodGroupFilter, wilayaFilter]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('donorsList.title')}</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('donorsList.subtitle')}</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm sticky top-[73px] z-10">
                 <button onClick={() => setIsFiltersOpen(!isFiltersOpen)} className="w-full flex justify-between items-center text-left font-semibold text-gray-700 dark:text-gray-200">
                    <span className="flex items-center gap-2"><Filter size={16}/> {t('global.toggleFilters')}</span>
                    <ChevronDown size={20} className={`transition-transform ${isFiltersOpen ? 'rotate-180' : ''}`} />
                 </button>
                 {isFiltersOpen && (
                    <div className="mt-4 border-t pt-4 dark:border-gray-700">
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-1">
                                <Input 
                                    id="search"
                                    label={t('donorsList.searchByNameLabel')}
                                    placeholder={t('donorsList.searchByNamePlaceholder')}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    icon={<Search size={20} />}
                                />
                            </div>
                            <div className="md:col-span-1">
                                <Select id="bloodGroup" label={t('auth.bloodGroupLabel')} value={bloodGroupFilter} onChange={e => setBloodGroupFilter(e.target.value)}>
                                    <option value="">{t('donorsList.allGroups')}</option>
                                    {BLOOD_GROUPS.map(group => <option key={group} value={group}>{group}</option>)}
                                </Select>
                            </div>
                            <div className="md:col-span-1">
                                <Select id="wilaya" label={t('auth.wilayaLabel')} value={wilayaFilter} onChange={e => setWilayaFilter(e.target.value)}>
                                    <option value="">{t('donorsList.allWilayas')}</option>
                                    {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
                                </Select>
                            </div>
                        </div>
                    </div>
                 )}
            </div>

            {filteredDonors.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredDonors.map(donor => (
                        <DonorCard key={donor.id} donor={donor} showViewButton={true} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <p className="text-gray-500 dark:text-gray-400">{t('donorsList.noResults')}</p>
                </div>
            )}
        </div>
    );
};

export default DonorsList;