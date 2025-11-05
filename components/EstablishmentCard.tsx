import React from 'react';
import { Establishment } from '../types';
import { Hospital, MapPin, Phone, Building, Map } from 'lucide-react';
import { useI18n } from '../contexts/I18nContext';

interface EstablishmentCardProps {
  establishment: Establishment;
}

const EstablishmentCard: React.FC<EstablishmentCardProps> = ({ establishment }) => {
  const { t } = useI18n();

  const handleDirectionClick = () => {
    if (establishment.googleMapsUrl) {
      window.open(establishment.googleMapsUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    if (!establishment?.latitude || !establishment?.longitude) return;
    const address = `${establishment.name}, ${establishment.address}, ${establishment.commune}, ${establishment.wilaya}`;
    const query = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${query}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 h-full flex flex-col">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Hospital className="text-primary" size={28}/>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">{establishment.name}</h3>
            {(establishment.latitude && establishment.longitude) &&
              <button onClick={handleDirectionClick} className="text-primary hover:text-primary-dark p-1">
                <Map size={20} />
              </button>
            }
          </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t(`establishmentTypes.${establishment.type}`)}</p>
        </div>
      </div>

      <div className="border-t my-3 dark:border-gray-700"></div>

      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 flex-grow">
        <div className="flex items-center"><MapPin size={16} className="mr-2 rtl:ml-2 rtl:mr-0 text-primary" /> {establishment.commune}, {establishment.wilaya}</div>
        <div className="flex items-center"><Building size={16} className="mr-2 rtl:ml-2 rtl:mr-0 text-primary" /> {establishment.address}</div>
        <div className="flex items-center"><Phone size={16} className="mr-2 rtl:ml-2 rtl:mr-0 text-primary" /> <a href={`tel:${establishment.phone}`} className="text-primary hover:underline">{establishment.phone}</a></div>
      </div>
    </div>
  );
};

export default EstablishmentCard;