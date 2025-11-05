import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import EstablishmentCard from '../EstablishmentCard';
import Input from './Input';
import Select from './Select';
import { ESTABLISHMENT_TYPES, WILAYAS, COMMUNES } from '../../constants';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { useI18n } from '../../contexts/I18nContext';

const EstablishmentsList: React.FC = () => {
    const { establishments } = useAppContext();
    const { t } = useI18n();
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [wilayaFilter, setWilayaFilter] = useState('');
    const [communeFilter, setCommuneFilter] = useState('');
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    const handleWilayaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setWilayaFilter(e.target.value);
        setCommuneFilter(''); // Reset commune filter when wilaya changes
    };

    const filteredEstablishments = useMemo(() => {
        return establishments.filter(est => {
            const nameMatch = est.name.toLowerCase().includes(searchTerm.toLowerCase());
            const typeMatch = typeFilter ? est.type === typeFilter : true;
            const wilayaMatch = wilayaFilter ? est.wilaya === wilayaFilter : true;
            const communeMatch = communeFilter ? est.commune === communeFilter : true;
            return nameMatch && typeMatch && wilayaMatch && communeMatch;
        });
    }, [establishments, searchTerm, typeFilter, wilayaFilter, communeFilter]);

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                 <button onClick={() => setIsFiltersOpen(!isFiltersOpen)} className="w-full flex justify-between items-center text-left font-semibold text-gray-700 dark:text-gray-200">
                    <span className="flex items-center gap-2"><Filter size={16}/> {t('global.toggleFilters')}</span>
                    <ChevronDown size={20} className={`transition-transform ${isFiltersOpen ? 'rotate-180' : ''}`} />
                 </button>
                 {isFiltersOpen && (
                    <div className="mt-4 border-t pt-4 dark:border-gray-700">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Input 
                                id="search"
                                label={t('auth.estNameLabel')}
                                placeholder={t('establishmentsPage.searchByName')}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                icon={<Search size={20} />}
                            />
                            <Select id="typeFilter" label={t('establishmentsPage.filterByType')} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                                <option value="">{t('global.all')}</option>
                                {ESTABLISHMENT_TYPES.map(type => <option key={type} value={type}>{t(`establishmentTypes.${type}`)}</option>)}
                            </Select>
                            <Select id="wilayaFilter" label={t('establishmentsPage.filterByWilaya')} value={wilayaFilter} onChange={handleWilayaChange}>
                                <option value="">{t('global.all')}</option>
                                {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
                            </Select>
                            <Select id="communeFilter" label={t('establishmentsPage.filterByCommune')} value={communeFilter} onChange={e => setCommuneFilter(e.target.value)} disabled={!wilayaFilter}>
                                <option value="">{t('global.all')}</option>
                                {wilayaFilter && COMMUNES[wilayaFilter]?.map(c => <option key={c} value={c}>{c}</option>)}
                            </Select>
                        </div>
                    </div>
                 )}
            </div>

            {filteredEstablishments.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredEstablishments.map(est => (
                        <EstablishmentCard key={est.id} establishment={est} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <p className="text-gray-500 dark:text-gray-400">{t('establishmentsPage.noResults')}</p>
                </div>
            )}
        </div>
    );
};

export default EstablishmentsList;