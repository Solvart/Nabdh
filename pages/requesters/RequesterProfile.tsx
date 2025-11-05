import React, { useState, useRef } from 'react';
import { Requester } from '../../types';
import { useAppContext } from '../../contexts/AppContext';
import Input from '../../components/shared/Input';
import Select from '../../components/shared/Select';
import Button from '../../components/shared/Button';
import Modal from '../../components/shared/Modal';
import { WILAYAS, COMMUNES } from '../../constants';
import { Edit, Save, X, MapPin, Phone, User, UploadCloud } from 'lucide-react';
import Avatar from '../../components/shared/Avatar';
import { useI18n } from '../../contexts/I18nContext';

const RequesterProfile: React.FC = () => {
    const { currentUser, updateUserProfile } = useAppContext();
    const { t } = useI18n();
    const requester = currentUser as Requester;

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [formData, setFormData] = useState<Requester>(requester);
    const [imagePreview, setImagePreview] = useState<string | null>(requester.profilePictureUrl || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!requester) return null;
    
    const fullName = `${requester.firstName} ${requester.lastName}`;

    const handleEditModalOpen = () => {
        setFormData(requester);
        setImagePreview(requester.profilePictureUrl || null);
        setIsEditModalOpen(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative">
                         {requester.profilePictureUrl ? (
                            <img src={requester.profilePictureUrl} alt={fullName} className="w-24 h-24 rounded-full object-cover ring-4 ring-primary/20" />
                         ) : (
                            <Avatar name={fullName} className="w-24 h-24 text-4xl ring-4 ring-primary/20" />
                         )}
                    </div>
                    <div className="text-center sm:text-left">
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{fullName}</h1>
                        <p className="text-gray-600 dark:text-gray-400">@{requester.username} / {requester.email}</p>
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
                    <div className="flex items-center"><User size={18} className="mr-3 rtl:ml-3 rtl:mr-0 text-primary"/><strong>{t('auth.fullNameLabel')}:</strong><span className="ml-2 rtl:mr-2 rtl:ml-0">{fullName}</span></div>
                    <div className="flex items-center"><Phone size={18} className="mr-3 rtl:ml-3 rtl:mr-0 text-primary"/><strong>{t('auth.phoneLabel')}:</strong><span className="ml-2 rtl:mr-2 rtl:ml-0">{requester.phone}</span></div>
                    <div className="flex items-center col-span-full"><MapPin size={18} className="mr-3 rtl:ml-3 rtl:mr-0 text-primary"/><strong>{t('auth.addressLabel')}:</strong><span className="ml-2 rtl:mr-2 rtl:ml-0">{requester.commune}, {requester.wilaya}</span></div>
                </div>
            </div>
            
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={`${t('global.edit')} ${t('global.profile')}`}>
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
                    </div>
                    <div className="pt-4 flex justify-end gap-2">
                        <Button type="button" variant="secondary" onClick={() => setIsEditModalOpen(false)}>{t('global.cancel')}</Button>
                        <Button onClick={handleSave}>{t('global.save')}</Button>
                    </div>
                 </div>
            </Modal>
        </div>
    );
};

export default RequesterProfile;
