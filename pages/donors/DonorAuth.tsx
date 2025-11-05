import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import Input from '../../components/shared/Input';
import Button from '../../components/shared/Button';
import Select from '../../components/shared/Select';
import { GENDERS, BLOOD_GROUPS, WILAYAS, COMMUNES } from '../../constants';
import { useI18n } from '../../contexts/I18nContext';
import PasswordStrengthIndicator from '../../components/shared/PasswordStrengthIndicator';
import Logo from '../../components/shared/Logo';

const DonorAuth: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();
    const { login, signup } = useAppContext();
    const { t } = useI18n();
    
    // Login state
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');

    // Signup state
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        dateOfBirth: '',
        gender: 'male' as 'male' | 'female',
        bloodGroup: 'A+',
        phone: '',
        wilaya: 'Alger',
        commune: 'Alger Centre',
    });
    
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
    
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (login(identifier, password, 'donor')) {
            navigate('/dashboard');
        } else {
            alert(t('auth.loginError'));
        }
    };

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert(t('auth.passwordMismatch'));
            return;
        }
        const { confirmPassword, ...signupData } = formData;
        // Fix: Add username to the signup data object to satisfy the type requirement. The username is derived from the email.
        if (signup({ ...signupData, username: formData.email.split('@')[0] }, 'donor')) {
            navigate('/dashboard');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <Logo className="mx-auto h-20 w-auto" />
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-gray-100">{t('auth.donorSpaceTitle')}</h2>
                </div>

                <div className="bg-white dark:bg-gray-800 p-8 shadow-lg rounded-lg">
                    <div className="flex border-b border-gray-200 dark:border-gray-700">
                        <button onClick={() => setIsLogin(true)} className={`w-1/2 py-4 text-center font-medium ${isLogin ? 'text-primary border-b-2 border-primary' : 'text-gray-500 dark:text-gray-400'}`}>{t('auth.login')}</button>
                        <button onClick={() => setIsLogin(false)} className={`w-1/2 py-4 text-center font-medium ${!isLogin ? 'text-primary border-b-2 border-primary' : 'text-gray-500 dark:text-gray-400'}`}>{t('auth.signup')}</button>
                    </div>

                    {isLogin ? (
                        <form className="space-y-6 mt-6" onSubmit={handleLogin}>
                            <Input id="identifier" label={t('auth.identifierLabel')} type="text" value={identifier} onChange={e => setIdentifier(e.target.value)} required />
                            <Input id="password" label={t('auth.passwordLabel')} type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                            <Button fullWidth type="submit">{t('auth.loginButton')}</Button>
                        </form>
                    ) : (
                        <form className="space-y-4 mt-6" onSubmit={handleSignup}>
                            <div className="grid grid-cols-2 gap-4">
                                <Input id="firstName" name="firstName" label={t('auth.firstNameLabel')} value={formData.firstName} onChange={handleInputChange} required />
                                <Input id="lastName" name="lastName" label={t('auth.lastNameLabel')} value={formData.lastName} onChange={handleInputChange} required />
                            </div>
                            <Input id="email" name="email" label={t('auth.emailLabel')} type="email" value={formData.email} onChange={handleInputChange} required />
                            <div>
                                <Input id="password-signup" name="password" label={t('auth.passwordLabel')} type="password" value={formData.password} onChange={handleInputChange} required />
                                <PasswordStrengthIndicator password={formData.password} />
                            </div>
                            <Input id="confirmPassword" name="confirmPassword" label={t('auth.confirmPasswordLabel')} type="password" value={formData.confirmPassword} onChange={handleInputChange} required />
                            <Input id="dateOfBirth" name="dateOfBirth" label={t('auth.dobLabel')} type="date" value={formData.dateOfBirth} onChange={handleInputChange} required />
                            <Select id="gender" name="gender" label={t('auth.genderLabel')} value={formData.gender} onChange={handleInputChange}>
                                {GENDERS.map(g => <option key={g} value={g}>{t(`auth.gender.${g}`)}</option>)}
                            </Select>
                            <Select id="bloodGroup" name="bloodGroup" label={t('auth.bloodGroupLabel')} value={formData.bloodGroup} onChange={handleInputChange}>
                                {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                            </Select>
                            <Input id="phone" name="phone" label={t('auth.phoneLabel')} type="tel" value={formData.phone} onChange={handleInputChange} required />
                            <Select id="wilaya" name="wilaya" label={t('auth.wilayaLabel')} value={formData.wilaya} onChange={handleWilayaChange}>
                                {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
                            </Select>
                            <Select id="commune" name="commune" label={t('auth.communeLabel')} value={formData.commune} onChange={handleInputChange}>
                                {COMMUNES[formData.wilaya]?.map(c => <option key={c} value={c}>{c}</option>)}
                            </Select>
                            <Button fullWidth type="submit">{t('auth.signupButton')}</Button>
                        </form>
                    )}
                </div>
                 <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                    <Link to="/" className="font-medium text-primary hover:text-primary-dark">{t('auth.backToHome')}</Link>
                </p>
            </div>
        </div>
    );
};

export default DonorAuth;
