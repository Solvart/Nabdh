import React, { useState, useMemo, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { BLOOD_GROUPS, URGENCY_LEVELS, WILAYAS, BLOOD_COMPATIBILITY_MAP } from '../../constants';
import { Request, Donor, Establishment } from '../../types';
import { formatDate, calculateDistance } from '../../utils/helpers';
import { Droplet, Calendar, MapPin, AlertTriangle, Map, ChevronDown, Filter, AlertCircle, Phone, Check, UserCheck } from 'lucide-react';
import { useI18n } from '../../contexts/I18nContext';
import Button from '../../components/shared/Button';
import Select from '../../components/shared/Select';

interface UserLocation {
    lat: number;
    lon: number;
}

interface RequestCardProps {
    request: Request;
    establishment?: Establishment;
    userLocation: UserLocation | null;
    donor: Donor;
    languageCode: string;
}


const RequestCard: React.FC<RequestCardProps> = ({ request, establishment, userLocation, donor, languageCode }) => {
    const { t } = useI18n();
    const { updateRequest } = useAppContext();
    const isUrgent = request.urgency === 'Urgent';

    const isCompatible = useMemo(() => {
        if (!donor?.bloodGroup) return false;
        return BLOOD_COMPATIBILITY_MAP[request.bloodGroup]?.includes(donor.bloodGroup);
    }, [request.bloodGroup, donor?.bloodGroup]);

    const distance = useMemo(() => {
        const reqLat = request.latitude ?? establishment?.latitude;
        const reqLon = request.longitude ?? establishment?.longitude;
        if (reqLat && reqLon && userLocation) {
            return calculateDistance(userLocation.lat, userLocation.lon, reqLat, reqLon);
        }
        return null;
    }, [establishment, userLocation, request]);
    
    const handleDirectionClick = () => {
        let url = '';
        if (request.latitude && request.longitude) {
            url = `https://www.google.com/maps/search/?api=1&query=${request.latitude},${request.longitude}`;
        } else if (establishment?.googleMapsUrl) {
            url = establishment.googleMapsUrl;
        } else if (establishment?.latitude && establishment.longitude) {
            url = `https://www.google.com/maps/search/?api=1&query=${establishment.latitude},${establishment.longitude}`;
        }
        if (url) {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };

    const hasResponded = useMemo(() => {
        return request.responses?.includes(donor.id);
    }, [request.responses, donor.id]);

    const handleRespond = () => {
        if (hasResponded) return;
        const updatedResponses = [...(request.responses || []), donor.id];
        updateRequest({ ...request, responses: updatedResponses });
    };

    return (
        <div className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-l-4 ${isUrgent ? 'border-red-500' : 'border-blue-500'}`}>
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2">
                         <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${isUrgent ? 'bg-red-500' : 'bg-blue-500'}`}>
                            {request.bloodGroup}
                         </div>
                         <div>
                            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">{t('findRequests.bloodRequestFor', { group: request.bloodGroup })}</h3>
                             <p className="text-sm text-gray-500 dark:text-gray-400">{request.authorName}</p>
                         </div>
                    </div>
                </div>
                 <div className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1 ${isUrgent ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'}`}>
                     {isUrgent && <AlertTriangle size={12} />} {t(`urgency.${request.urgency}`)}
                </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 my-3">{request.notes}</p>
             <div className="border-t dark:border-gray-700 my-3"></div>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center"><Droplet size={14} className="mr-2 rtl:ml-2 rtl:mr-0 text-primary" /> {t('myRequests.quantity')}: {request.quantity} {t('myRequests.units')}</div>
                <div className="flex items-center"><UserCheck size={14} className="mr-2 rtl:ml-2 rtl:mr-0 text-primary" />{t('findRequests.approvedDonors')}: {request.approvedDonors?.length || 0} / {request.quantity}</div>
                <div className="flex items-center"><Calendar size={14} className="mr-2 rtl:ml-2 rtl:mr-0 text-primary" /> {formatDate(request.createdAt, languageCode)}</div>
                <div className="flex items-center"><MapPin size={14} className="mr-2 rtl:ml-2 rtl:mr-0 text-primary" /> {request.commune}, {request.wilaya}
                 {distance !== null && <span className="ml-auto rtl:mr-auto rtl:ml-0 text-xs font-semibold text-gray-500 dark:text-gray-400">{t('findRequests.distanceAway', { distance: distance.toFixed(1) })}</span>}
                </div>
                 <div className="flex items-center"><Phone size={14} className="mr-2 rtl:ml-2 rtl:mr-0 text-primary" /> <span className='font-medium'>{request.contactName}:</span><a href={`tel:${request.contactPhone}`} className="ml-2 rtl:mr-2 rtl:ml-0 text-blue-600 dark:text-blue-400 hover:underline">{request.contactPhone}</a></div>
            </div>
            <div className="mt-4 flex gap-2">
                 <Button fullWidth onClick={handleRespond} disabled={!isCompatible || hasResponded} className="flex items-center justify-center gap-2">
                    {hasResponded && <Check size={16} />}
                    {hasResponded ? t('findRequests.alreadyResponded') : t('findRequests.iCanDonate')}
                 </Button>
                 { (request.latitude && request.longitude) || (establishment && (establishment.latitude || establishment.googleMapsUrl)) ? (
                     <Button variant="secondary" onClick={handleDirectionClick} className="!p-3 whitespace-nowrap">
                        <Map size={16} />
                     </Button>
                 ) : null}
            </div>
        </div>
    );
};


const DonorRequests: React.FC = () => {
    const { currentUser, requests, establishments } = useAppContext();
    const { t, language } = useI18n();
    const donor = currentUser as Donor;

    const [bloodGroupFilter, setBloodGroupFilter] = useState('');
    const [wilayaFilter, setWilayaFilter] = useState('');
    const [urgencyFilter, setUrgencyFilter] = useState('');
    const [showCompatibleOnly, setShowCompatibleOnly] = useState(false);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
    const [locationErrorKey, setLocationErrorKey] = useState<string | null>(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude,
                    });
                    setLocationErrorKey(null);
                },
                (error) => {
                    let errorKey = '';
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            errorKey = 'findRequests.locationPermissionDenied';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorKey = 'findRequests.locationUnavailable';
                            break;
                        case error.TIMEOUT:
                            errorKey = 'findRequests.locationTimeout';
                            break;
                        default:
                            errorKey = 'findRequests.locationError';
                            break;
                    }
                    setLocationErrorKey(errorKey);
                    console.error(`Error getting user location (Code: ${error.code}): ${error.message}`);
                }
            );
        } else {
             setLocationErrorKey('findRequests.locationNotSupported');
        }
    }, []);
    
    const establishmentMap = useMemo(() => {
        return establishments.reduce((acc, est) => {
            acc[est.id] = est;
            return acc;
        }, {} as { [key: string]: Establishment });
    }, [establishments]);

    const filteredRequests = useMemo(() => {
        return requests.filter(req => {
            const bloodGroupMatch = bloodGroupFilter ? req.bloodGroup === bloodGroupFilter : true;
            const wilayaMatch = wilayaFilter ? req.wilaya === wilayaFilter : true;
            const urgencyMatch = urgencyFilter ? req.urgency === urgencyFilter : true;
            const compatibleMatch = showCompatibleOnly
              ? donor?.bloodGroup && BLOOD_COMPATIBILITY_MAP[req.bloodGroup]?.includes(donor.bloodGroup)
              : true;
            
            return req.status === 'Open' && bloodGroupMatch && wilayaMatch && urgencyMatch && compatibleMatch;
        });
    }, [requests, bloodGroupFilter, wilayaFilter, urgencyFilter, showCompatibleOnly, donor]);

    const locationError = locationErrorKey ? t(locationErrorKey) : null;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('findRequests.title')}</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('findRequests.subtitle')}</p>
            </div>

            {locationError && (
                <div className="bg-yellow-100 dark:bg-yellow-900/30 border-l-4 border-yellow-500 text-yellow-800 dark:text-yellow-300 p-4" role="alert">
                    <div className="flex">
                        <div className="py-1">
                            <AlertCircle className="h-5 w-5 text-yellow-500 mr-3 rtl:ml-3 rtl:mr-0" />
                        </div>
                        <div>
                            <p className="font-bold">{t('findRequests.locationErrorTitle')}</p>
                            <p>{locationError}</p>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm sticky top-[73px] z-10">
                 <button onClick={() => setIsFiltersOpen(!isFiltersOpen)} className="w-full flex justify-between items-center text-left font-semibold text-gray-700 dark:text-gray-200">
                    <span className="flex items-center gap-2"><Filter size={16}/> {t('global.toggleFilters')}</span>
                    <ChevronDown size={20} className={`transition-transform ${isFiltersOpen ? 'rotate-180' : ''}`} />
                 </button>
                 {isFiltersOpen && (
                    <div className="mt-4 border-t pt-4 dark:border-gray-700">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Select id="bloodGroup" label={t('auth.bloodGroupLabel')} value={bloodGroupFilter} onChange={e => setBloodGroupFilter(e.target.value)}>
                                <option value="">{t('global.all')}</option>
                                {BLOOD_GROUPS.map(group => <option key={group} value={group}>{group}</option>)}
                            </Select>
                            <Select id="wilaya" label={t('auth.wilayaLabel')} value={wilayaFilter} onChange={e => setWilayaFilter(e.target.value)}>
                                <option value="">{t('global.all')}</option>
                                {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
                            </Select>
                            <Select id="urgency" label={t('myRequests.urgency')} value={urgencyFilter} onChange={e => setUrgencyFilter(e.target.value)}>
                                <option value="">{t('global.all')}</option>
                                {URGENCY_LEVELS.map(level => <option key={level} value={level}>{t(`urgency.${level}`)}</option>)}
                            </Select>
                        </div>
                         <div className="mt-4 pt-4 border-t dark:border-gray-600">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="compatibleOnly"
                                    checked={showCompatibleOnly}
                                    onChange={(e) => setShowCompatibleOnly(e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300 dark:border-gray-500 text-primary focus:ring-primary"
                                />
                                <label htmlFor="compatibleOnly" className="ml-3 rtl:mr-3 rtl:ml-0 block text-sm font-medium text-gray-700 dark:text-gray-200">
                                    {t('findRequests.showCompatibleOnly')}
                                </label>
                            </div>
                        </div>
                    </div>
                 )}
            </div>

            {filteredRequests.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredRequests.map(req => {
                        const establishment = req.authorId.startsWith('est-') ? establishmentMap[req.authorId] : undefined;
                        return <RequestCard key={req.id} request={req} establishment={establishment} userLocation={userLocation} donor={donor} languageCode={language.code} />;
                    })}
                </div>
            ) : (
                <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <p className="text-gray-500 dark:text-gray-400">{t('findRequests.noRequests')}</p>
                </div>
            )}
        </div>
    );
};

export default DonorRequests;