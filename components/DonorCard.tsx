import React from 'react';
import { Link } from 'react-router-dom';
import { Donor } from '../types';
import { MapPin, Phone, Calendar, Eye } from 'lucide-react';
import { calculateAge, isEligibleToDonate, formatDate } from '../utils/helpers';
import Avatar from './shared/Avatar';
import { useI18n } from '../contexts/I18nContext';

interface DonorCardProps {
  donor: Donor;
  showViewButton?: boolean;
}

const DonorCard: React.FC<DonorCardProps> = ({ donor, showViewButton = false }) => {
  const { t, language } = useI18n();
  const eligible = isEligibleToDonate(donor.donationHistory?.[0]?.date);
  const fullName = `${donor.firstName} ${donor.lastName}`;

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 h-full flex flex-col">
      <div className="flex items-start gap-4">
        <div className="relative">
             {donor.profilePictureUrl ? (
                <img src={donor.profilePictureUrl} alt={fullName} className="w-16 h-16 rounded-full object-cover" />
             ) : (
                <Avatar name={fullName} className="w-16 h-16 text-2xl" />
             )}
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800">
                <span className="font-extrabold text-sm text-primary dark:text-red-300">{donor.bloodGroup}</span>
            </div>
        </div>
        <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">{fullName}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{calculateAge(donor.dateOfBirth)}</p>
        </div>
        {showViewButton && (
            <Link to={`/donor/${donor.id}`} title="Voir le profil" className="p-2 text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary-light rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <Eye size={20} />
            </Link>
        )}
      </div>

      <div className="border-t my-3 dark:border-gray-700"></div>

      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 flex-grow">
        <div className="flex items-center"><MapPin size={16} className="mr-2 rtl:ml-2 rtl:mr-0 text-primary" /> {donor.commune}, {donor.wilaya}</div>
        <div className="flex items-center"><Phone size={16} className="mr-2 rtl:ml-2 rtl:mr-0 text-primary" /> <a href={`tel:${donor.phone}`} className="text-blue-600 dark:text-blue-400 hover:underline">{donor.phone}</a></div>
        <div className="flex items-center"><Calendar size={16} className="mr-2 rtl:ml-2 rtl:mr-0 text-primary" /> 
            {t('dashboard.donor.lastDonation')}: {donor.donationHistory?.[0]?.date ? formatDate(donor.donationHistory[0].date, language.code) : t('global.none')}
        </div>
      </div>
      
       <div className={`mt-4 text-center px-3 py-1.5 rounded-full text-xs font-semibold ${eligible ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300'}`}>
        {eligible ? 'Éligible au don' : 'Non éligible actuellement'}
      </div>
    </div>
  );
};

export default DonorCard;