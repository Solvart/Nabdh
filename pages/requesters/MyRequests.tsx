// Fix: Created content for MyRequests.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { Request, Requester, Donor } from '../../types';
import { Plus, Edit, Trash2, Users, UserCheck, Eye, Phone } from 'lucide-react';
import Button from '../../components/shared/Button';
import Modal from '../../components/shared/Modal';
import Input from '../../components/shared/Input';
import Select from '../../components/shared/Select';
import { BLOOD_GROUPS, URGENCY_LEVELS } from '../../constants';
import { useI18n } from '../../contexts/I18nContext';
import { formatDate } from '../../utils/helpers';
import Avatar from '../../components/shared/Avatar';

const MyRequests: React.FC = () => {
    const { currentUser, requests, establishments, donors, addRequest, updateRequest, deleteRequest, approveDonor } = useAppContext();
    const { t, language } = useI18n();
    
    // This component is now used by both Donors and Requesters
    if (currentUser?.userType !== 'requester' && currentUser?.userType !== 'donor') {
        return null; 
    }
    const user = currentUser as Requester | Donor;
    
    const myRequests = useMemo(() => requests.filter(r => r.authorId === user.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), [requests, user.id]);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRequest, setEditingRequest] = useState<Request | null>(null);
    const [viewingRequest, setViewingRequest] = useState<Request | null>(null);
    const [formData, setFormData] = useState<Omit<Request, 'id' | 'createdAt' | 'authorId' | 'authorName' | 'responses' | 'approvedDonors'>>({
        bloodGroup: 'A+',
        quantity: 1,
        urgency: 'Normal',
        wilaya: user.wilaya,
        commune: user.commune,
        notes: '',
        status: 'Open',
        establishmentName: '',
        contactName: `${user.firstName} ${user.lastName}`,
        contactPhone: user.phone,
        latitude: undefined,
        longitude: undefined,
    });

    useEffect(() => {
        if (formData.establishmentName) {
            const selectedEst = establishments.find(e => e.name === formData.establishmentName);
            if (selectedEst && selectedEst.latitude && selectedEst.longitude) {
                setFormData(prev => ({
                    ...prev,
                    latitude: selectedEst.latitude,
                    longitude: selectedEst.longitude,
                }));
            }
        }
    }, [formData.establishmentName, establishments]);

    const openModalForCreate = () => {
        setEditingRequest(null);
        setFormData({
            bloodGroup: 'A+',
            quantity: 1,
            urgency: 'Normal',
            wilaya: user.wilaya,
            commune: user.commune,
            notes: '',
            status: 'Open',
            establishmentName: '',
            contactName: `${user.firstName} ${user.lastName}`,
            contactPhone: user.phone,
            latitude: undefined,
            longitude: undefined,
        });
        setIsModalOpen(true);
    };

    const openModalForEdit = (request: Request) => {
        setEditingRequest(request);
        setFormData({
            bloodGroup: request.bloodGroup,
            quantity: request.quantity,
            urgency: request.urgency,
            wilaya: request.wilaya,
            commune: request.commune,
            notes: request.notes,
            status: request.status,
            establishmentName: request.establishmentName,
            contactName: request.contactName,
            contactPhone: request.contactPhone,
            latitude: request.latitude,
            longitude: request.longitude,
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingRequest(null);
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === 'latitude' || name === 'longitude') {
            setFormData(prev => ({ ...prev, [name]: value === '' ? undefined : parseFloat(value) }));
        } else if (name === 'quantity') {
            setFormData(prev => ({ ...prev, [name]: parseInt(value) }));
        }
        else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingRequest) {
            updateRequest({ ...editingRequest, ...formData });
        } else {
            addRequest({
                ...formData,
                authorId: user.id,
                authorName: `${user.firstName} ${user.lastName}`,
            });
        }
        handleCloseModal();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('myRequests.title')}</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('myRequests.subtitleRequester')}</p>
                </div>
                <Button onClick={openModalForCreate} className="flex items-center gap-2">
                    <Plus size={18} /> {t('myRequests.newRequest')}
                </Button>
            </div>

            {myRequests.length > 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                    <ul className="divide-y dark:divide-gray-700">
                        {myRequests.map(req => (
                            <li key={req.id} className="p-4">
                                <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                                    <div className="flex-1 mb-3 sm:mb-0">
                                        <div className="flex items-center gap-3">
                                            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${req.status === 'Open' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>{t(`status.${req.status}`)}</span>
                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${req.urgency === 'Urgent' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'}`}>{t(`urgency.${req.urgency}`)}</span>
                                        </div>
                                        <p className="font-bold text-lg mt-2">{t('findRequests.bloodRequestFor', { group: req.bloodGroup })} - {req.quantity} {t('myRequests.units')}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{req.commune}, {req.wilaya}</p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{t('myRequests.postedOn')} {formatDate(req.createdAt, language.code)}</p>
                                    </div>
                                    <div className="flex gap-2 self-start sm:self-center">
                                        <Button variant="secondary" onClick={() => setViewingRequest(req)}><Eye size={16} /></Button>
                                        <Button variant="secondary" onClick={() => openModalForEdit(req)}><Edit size={16} /></Button>
                                        <Button variant="danger" onClick={() => window.confirm(t('global.confirmDelete')) && deleteRequest(req.id)}><Trash2 size={16} /></Button>
                                    </div>
                                </div>
                                <div className="mt-3 pt-3 border-t dark:border-gray-700 flex items-center text-sm font-semibold">
                                    {req.responses && req.responses.length > 0 && (
                                        <span className="text-green-600 dark:text-green-400 flex items-center">
                                            <Users size={16} className="mr-2 rtl:ml-2 rtl:mr-0" />
                                            {t('myRequests.responsesCount', { count: req.responses.length })}
                                        </span>
                                    )}
                                    {req.approvedDonors && req.approvedDonors.length > 0 && (
                                        <span className="ml-4 rtl:mr-4 rtl:ml-0 text-blue-600 dark:text-blue-400 flex items-center">
                                            <UserCheck size={16} className="mr-2 rtl:ml-2 rtl:mr-0" />
                                            {t('myRequests.approvedCount', { count: req.approvedDonors.length, total: req.quantity })}
                                        </span>
                                    )}
                                </div>
                                {req.responses && req.responses.length > 0 && (
                                    <div className="mt-3">
                                        <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-200 mb-2">{t('myRequests.respondedDonors')}</h4>
                                        <ul className="space-y-2 max-h-40 overflow-y-auto">
                                            {req.responses.map(donorId => {
                                                const donor = donors.find(d => d.id === donorId);
                                                if (!donor) return null;
                                                const isApproved = req.approvedDonors?.includes(donorId);
                                                return (
                                                    <li key={donorId} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700/50 p-2 rounded-md">
                                                        <div className="flex items-center gap-3">
                                                            {donor.profilePictureUrl ? (
                                                                <img src={donor.profilePictureUrl} alt={`${donor.firstName} ${donor.lastName}`} className="w-10 h-10 rounded-full object-cover" />
                                                            ) : (
                                                                <Avatar name={`${donor.firstName} ${donor.lastName}`} className="w-10 h-10" />
                                                            )}
                                                            <div>
                                                                <p className="font-medium text-gray-800 dark:text-gray-100">{donor.firstName} {donor.lastName}</p>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                                                    <span>{donor.bloodGroup}</span>
                                                                    <span className="text-gray-300 dark:text-gray-600">|</span>
                                                                    <a href={`tel:${donor.phone}`} className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline">
                                                                        <Phone size={12} />
                                                                        {donor.phone}
                                                                    </a>
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <Button 
                                                            size="sm"
                                                            onClick={() => approveDonor(req.id, donor.id)}
                                                            disabled={isApproved}
                                                            variant={isApproved ? 'secondary' : 'primary'}
                                                        >
                                                            {isApproved ? t('myRequests.approved') : t('myRequests.approve')}
                                                        </Button>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <p className="text-gray-500 dark:text-gray-400">{t('myRequests.noRequests')}</p>
                </div>
            )}
            
             <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingRequest ? t('myRequests.editRequest') : t('myRequests.newRequest')}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Select id="bloodGroup" name="bloodGroup" label={t('auth.bloodGroupLabel')} value={formData.bloodGroup} onChange={handleInputChange}>
                            {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                        </Select>
                        <Input id="quantity" name="quantity" label={t('myRequests.quantity')} type="number" min="1" value={formData.quantity} onChange={handleInputChange} required />
                    </div>
                     <Select id="urgency" name="urgency" label={t('myRequests.urgency')} value={formData.urgency} onChange={handleInputChange}>
                        {URGENCY_LEVELS.map(level => <option key={level} value={level}>{t(`urgency.${level}`)}</option>)}
                    </Select>
                    
                     <Input 
                        id="establishmentName" 
                        name="establishmentName" 
                        label={t('myRequests.establishmentNameLabel')}
                        value={formData.establishmentName} 
                        onChange={handleInputChange} 
                        list="establishments-list"
                        required 
                    />
                    <datalist id="establishments-list">
                        {establishments.map(est => <option key={est.id} value={est.name} />)}
                    </datalist>

                    <div className="grid grid-cols-2 gap-4">
                        <Input id="latitude" name="latitude" label={t('myRequests.latitude')} type="number" step="any" value={formData.latitude ?? ''} onChange={handleInputChange} />
                        <Input id="longitude" name="longitude" label={t('myRequests.longitude')} type="number" step="any" value={formData.longitude ?? ''} onChange={handleInputChange} />
                    </div>

                    <Input 
                        id="contactName" 
                        name="contactName" 
                        label={t('myRequests.contactNameLabel')}
                        value={formData.contactName} 
                        onChange={handleInputChange} 
                        required 
                    />
                    
                    <Input 
                        id="contactPhone" 
                        name="contactPhone" 
                        label={t('myRequests.contactPhoneLabel')}
                        type="tel"
                        value={formData.contactPhone} 
                        onChange={handleInputChange} 
                        required 
                    />

                     <textarea id="notes" name="notes" placeholder={t('myRequests.notesPlaceholder')} value={formData.notes} onChange={handleInputChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md bg-white dark:bg-gray-700" rows={3}></textarea>
                    {editingRequest && (
                         <Select id="status" name="status" label={t('myRequests.statusLabel')} value={formData.status} onChange={handleInputChange}>
                             <option value="Open">{t('status.Open')}</option>
                             <option value="Closed">{t('status.Closed')}</option>
                             <option value="Fulfilled">{t('status.Fulfilled')}</option>
                         </Select>
                    )}
                     <div className="pt-4 flex justify-end gap-2">
                        <Button type="button" variant="secondary" onClick={handleCloseModal}>{t('global.cancel')}</Button>
                        <Button type="submit">{t('global.save')}</Button>
                    </div>
                </form>
            </Modal>
            
            <Modal isOpen={!!viewingRequest} onClose={() => setViewingRequest(null)} title={t('myRequests.requestDetails')}>
                {viewingRequest && (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2 border-b pb-2">{t('myRequests.requestInfo')}</h3>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                <p><strong>{t('auth.bloodGroupLabel')}:</strong></p><p>{viewingRequest.bloodGroup}</p>
                                <p><strong>{t('myRequests.quantity')}:</strong></p><p>{viewingRequest.quantity}</p>
                                <p><strong>{t('myRequests.urgency')}:</strong></p><p>{t(`urgency.${viewingRequest.urgency}`)}</p>
                                <p><strong>{t('myRequests.statusLabel')}:</strong></p><p>{t(`status.${viewingRequest.status}`)}</p>
                                <p><strong>{t('myRequests.establishmentNameLabel')}:</strong></p><p>{viewingRequest.establishmentName}</p>
                                <p><strong>{t('myRequests.contactNameLabel')}:</strong></p><p>{viewingRequest.contactName}</p>
                                <p><strong>{t('myRequests.contactPhoneLabel')}:</strong></p><p>{viewingRequest.contactPhone}</p>
                                <p className="col-span-2"><strong>{t('myRequests.notes')}:</strong></p>
                                <p className="col-span-2">{viewingRequest.notes || t('global.none')}</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2 border-b pb-2">{t('myRequests.approvedDonorsList')}</h3>
                            {viewingRequest.approvedDonors && viewingRequest.approvedDonors.length > 0 ? (
                                <ul className="space-y-2 max-h-48 overflow-y-auto pr-2">
                                    {viewingRequest.approvedDonors.map(donorId => {
                                        const donor = donors.find(d => d.id === donorId);
                                        if (!donor) return null;
                                        return (
                                            <li key={donorId} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md">
                                                <div className="flex items-center gap-3">
                                                    {donor.profilePictureUrl ? (
                                                        <img src={donor.profilePictureUrl} alt={`${donor.firstName} ${donor.lastName}`} className="w-10 h-10 rounded-full object-cover" />
                                                    ) : (
                                                        <Avatar name={`${donor.firstName} ${donor.lastName}`} className="w-10 h-10" />
                                                    )}
                                                    <div>
                                                        <p className="font-semibold text-gray-800 dark:text-gray-100">{donor.firstName} {donor.lastName}</p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">{donor.bloodGroup}</p>
                                                    </div>
                                                </div>
                                                <a href={`tel:${donor.phone}`} className="flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                                                    <Phone size={16} />
                                                    <span>{donor.phone}</span>
                                                </a>
                                            </li>
                                        );
                                    })}
                                </ul>
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400 text-center py-4">{t('myRequests.noApprovedDonors')}</p>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default MyRequests;