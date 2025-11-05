import React from 'react';
import { Donor, Donation, Badge } from '../../types';
import { useAppContext } from '../../contexts/AppContext';
import Input from '../../components/shared/Input';
import Select from '../../components/shared/Select';
import Button from '../../components/shared/Button';
import Modal from '../../components/shared/Modal';
import { BLOOD_GROUPS, WILAYAS, COMMUNES } from '../../constants';
import { calculateAge, formatDate, isEligibleToDonate, getNextDonationDate } from '../../utils/helpers';
import { Edit, Save, X, Award, Droplet, Calendar, MapPin, Phone, Plus, UploadCloud, Gem } from 'lucide-react';
import Avatar from '../../components/shared/Avatar';
import DonationHistoryChart from '../../components/charts/DonationHistoryChart';
import { useI18n } from '../../contexts/I18nContext';
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

const DonorProfile: React.FC = () => {
    const { currentUser, updateUserProfile, addDonation, establishments } = useAppContext();
    const { t, language } = useI18n();
    const donor = currentUser as Donor;

    const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
    const [isAddDonationModalOpen, setIsAddDonationModalOpen] = React.useState(false);
    const [formData, setFormData] = React.useState<Donor>(donor);
    const [newDonation, setNewDonation] = React.useState<Omit<Donation, 'id'>>({
      establishmentName: establishments[0]?.name || '',
      date: new Date().toISOString().split('T')[0],
      quantity: 1,
      reason: ''
    });
    const [imagePreview, setImagePreview] = React.useState<string | null>(donor.profilePictureUrl || null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    if (!donor) return null;

    const handleEditModalOpen = () => {
        setFormData(donor);
        setImagePreview(donor.profilePictureUrl || null);
        setIsEditModalOpen(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleNewDonationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewDonation(prev => ({ ...prev, [name]: name === 'quantity' ? parseInt(value) : value }));
    };

    const handleWilayaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newWilaya = e.target.value;
        setFormData(prev => ({
            ...prev,
            wilaya: newWilaya,
            commune: COMMUNES[newWilaya]?.[0] || '',
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setImagePreview(base64String);
                setFormData(prev => ({...prev, profilePictureUrl: base64String}));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        const result = updateUserProfile(formData);
        if(result.success) {
          alert(t('profile.updateSuccess'));
          setIsEditModalOpen(false);
        } else {
          alert(result.message);
        }
    };

    const handleAddDonation = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newDonation.establishmentName) {
        alert(t('profile.selectEstablishment'));
        return;
      }
      addDonation(newDonation);
      setIsAddDonationModalOpen(false);
       setNewDonation({
          establishmentName: establishments[0]?.name || '',
          date: new Date().toISOString().split('T')[0],
          quantity: 1,
          reason: ''
       });
    }
    
    const fullName = `${donor.firstName} ${donor.lastName}`;
    const eligible = isEligibleToDonate(donor.donationHistory?.[0]?.date);

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative">
                         {donor.profilePictureUrl ? (
                            <img src={donor.profilePictureUrl} alt={fullName} className="w-24 h-24 rounded-full object-cover ring-4 ring-primary/20" />
                         ) : (
                            <Avatar name={fullName} className="w-24 h-24 text-4xl ring-4 ring-primary/20" />
                         )}
                    </div>
                    <div className="text-center sm:text-left">
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{fullName}</h1>
                        <p className="text-gray-600 dark:text-gray-400">@{donor.username} / {donor.email}</p>
                        <div className={`mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${eligible ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300'}`}>
                            {eligible ? t('profile.eligible') : t('profile.notEligible')}
                        </div>
                        {!eligible && donor.donationHistory.length > 0 && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {t('profile.nextDonation')}: {getNextDonationDate(donor.donationHistory[0].date, language.code)}
                            </p>
                        )}
                    </div>
                    <div className="sm:ml-auto">
                         <Button onClick={handleEditModalOpen} variant="secondary" className="p-2 sm:px-4 sm:py-2 flex items-center">
                            <Edit size={16}/>
                            <span className="hidden sm:inline sm:ml-2 rtl:sm:mr-2 rtl:ml-0">{t('global.edit')}</span>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">{t('profile.personalInfo')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
                    <div className="flex items-center"><Award size={18} className="mr-3 rtl:ml-3 rtl:mr-0 text-primary"/><strong>{t('profile.age')}:</strong><span className="ml-2 rtl:mr-2 rtl:ml-0">{calculateAge(donor.dateOfBirth)}</span></div>
                    <div className="flex items-center"><Droplet size={18} className="mr-3 rtl:ml-3 rtl:mr-0 text-primary"/><strong>{t('auth.bloodGroupLabel')}:</strong><span className="ml-2 rtl:mr-2 rtl:ml-0">{donor.bloodGroup}</span></div>
                    <div className="flex items-center"><Phone size={18} className="mr-3 rtl:ml-3 rtl:mr-0 text-primary"/><strong>{t('auth.phoneLabel')}:</strong><span className="ml-2 rtl:mr-2 rtl:ml-0">{donor.phone}</span></div>
                    <div className="flex items-center"><MapPin size={18} className="mr-3 rtl:ml-3 rtl:mr-0 text-primary"/><strong>{t('auth.addressLabel')}:</strong><span className="ml-2 rtl:mr-2 rtl:ml-0">{donor.commune}, {donor.wilaya}</span></div>
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
                    <Button onClick={() => setIsAddDonationModalOpen(true)} variant="secondary" className="!p-2 h-8 w-8 rounded-full">
                        <Plus size={16}/>
                    </Button>
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
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(donation.date, language.code)} - {donation.reason}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-gray-700 dark:text-gray-300">{donation.quantity} {donation.quantity > 1 ? t('myRequests.units') : t('myRequests.units')}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </>
                ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">{t('profile.noDonations')}</p>
                )}
            </div>

            {/* Edit Profile Modal */}
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={t('global.edit') + ' ' + t('global.profile')}>
                 <div className="space-y-4">
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                           {imagePreview ? (
                              <img src={imagePreview} alt="Aperçu" className="w-24 h-24 rounded-full object-cover" />
                           ) : (
                              <Avatar name={fullName} className="w-24 h-24 text-4xl" />
                           )}
                           <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-2 -right-2 bg-white dark:bg-gray-600 p-1.5 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-500">
                             <UploadCloud size={16} className="text-primary"/>
                           </button>
                           <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input id="firstName" name="firstName" label={t('auth.firstNameLabel')} value={formData.firstName} onChange={handleInputChange} />
                        <Input id="lastName" name="lastName" label={t('auth.lastNameLabel')} value={formData.lastName} onChange={handleInputChange} />
                        <Input id="username" name="username" label={t('profile.username')} value={formData.username} onChange={handleInputChange} />
                        <Input id="phone" name="phone" label={t('auth.phoneLabel')} type="tel" value={formData.phone} onChange={handleInputChange} />
                        <Select id="wilaya" name="wilaya" label={t('auth.wilayaLabel')} value={formData.wilaya} onChange={handleWilayaChange}>
                            {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
                        </Select>
                         <Select id="commune" name="commune" label={t('auth.communeLabel')} value={formData.commune} onChange={handleInputChange}>
                            {COMMUNES[formData.wilaya]?.map(c => <option key={c} value={c}>{c}</option>)}
                        </Select>
                         <Select id="bloodGroup" name="bloodGroup" label={t('auth.bloodGroupLabel')} value={formData.bloodGroup} onChange={handleInputChange} disabled>
                            {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                        </Select>
                    </div>
                    <div className="pt-4 flex justify-end gap-2">
                        <Button type="button" variant="secondary" onClick={() => setIsEditModalOpen(false)}>{t('global.cancel')}</Button>
                        <Button onClick={handleSave}>{t('global.save')}</Button>
                    </div>
                 </div>
            </Modal>

            {/* Add Donation Modal */}
            <Modal isOpen={isAddDonationModalOpen} onClose={() => setIsAddDonationModalOpen(false)} title={t('profile.addDonationTitle')}>
                <form onSubmit={handleAddDonation} className="space-y-4">
                    <Input 
                        id="establishmentName" 
                        name="establishmentName" 
                        label={t('profile.establishmentLabel')} 
                        value={newDonation.establishmentName} 
                        onChange={handleNewDonationChange}
                        list="establishments-list-profile"
                        required
                    />
                    <datalist id="establishments-list-profile">
                        {establishments.map(est => <option key={est.id} value={est.name} />)}
                    </datalist>
                    <Input id="date" name="date" label={t('profile.donationDateLabel')} type="date" value={newDonation.date} onChange={handleNewDonationChange} required />
                    <Input id="reason" name="reason" label={t('profile.donationReasonLabel')} value={newDonation.reason || ''} onChange={handleNewDonationChange} />
                    <div className="pt-4 flex justify-end gap-2">
                        <Button type="button" variant="secondary" onClick={() => setIsAddDonationModalOpen(false)}>{t('global.cancel')}</Button>
                        <Button type="submit">{t('profile.addDonation')}</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default DonorProfile;