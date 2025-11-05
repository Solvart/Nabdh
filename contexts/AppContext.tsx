import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { CurrentUser, Donor, Establishment, Requester, Request, Donation, NewUserData, NewDonorData, NewRequesterData, NewEstablishmentData, Badge } from '../types';
import { getInitialData } from '../services/databaseService';
import { POINTS_PER_DONATION, BADGES } from '../constants/gamification';

interface AppContextType {
    currentUser: CurrentUser;
    donors: Donor[];
    requests: Request[];
    establishments: Establishment[];
    login: (identifier: string, password: string, userType: 'donor' | 'requester' | 'establishment') => boolean;
    signup: (userData: NewUserData, userType: 'donor' | 'requester' | 'establishment') => boolean;
    logout: () => void;
    updateUserProfile: (updatedData: Donor | Requester | Establishment) => { success: boolean, message: string };
    addDonation: (newDonation: Omit<Donation, 'id'>) => void;
    addRequest: (newRequestData: Omit<Request, 'id' | 'createdAt' | 'status'>) => void;
    updateRequest: (updatedRequest: Request) => void;
    deleteRequest: (requestId: string) => void;
    approveDonor: (requestId: string, donorId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const { initialDonors, initialEstablishments, initialRequesters, initialRequests } = getInitialData();

export const AppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [donors, setDonors] = useLocalStorage<Donor[]>('donors', initialDonors);
    const [establishments, setEstablishments] = useLocalStorage<Establishment[]>('establishments', initialEstablishments);
    const [requesters, setRequesters] = useLocalStorage<Requester[]>('requesters', initialRequesters);
    const [requests, setRequests] = useLocalStorage<Request[]>('requests', initialRequests);
    const [currentUser, setCurrentUser] = useLocalStorage<CurrentUser>('currentUser', null);

    const login = (identifier: string, password: string, userType: 'donor' | 'requester' | 'establishment'): boolean => {
        let user: Donor | Requester | Establishment | undefined;
        const identifierLower = identifier.toLowerCase();

        if (userType === 'donor') {
            user = donors.find(d => (d.email.toLowerCase() === identifierLower || d.username.toLowerCase() === identifierLower) && d.password === password);
        } else if (userType === 'requester') {
            user = requesters.find(r => (r.email.toLowerCase() === identifierLower || r.username.toLowerCase() === identifierLower) && r.password === password);
        } else {
            user = establishments.find(e => (e.email.toLowerCase() === identifierLower || e.username.toLowerCase() === identifierLower) && e.password === password);
        }

        if (user) {
            setCurrentUser(user);
            return true;
        }
        return false;
    };

    const signup = (userData: NewUserData, userType: 'donor' | 'requester' | 'establishment'): boolean => {
        const id = `${userType.slice(0, 3)}-${Date.now()}`;
        
        if (userType === 'donor') {
            const newDonor: Donor = {
                id,
                userType: 'donor',
                ...(userData as NewDonorData),
                donationHistory: [],
                points: 0,
                badges: [],
            };
            setDonors(prev => [...prev, newDonor]);
            setCurrentUser(newDonor);
        } else if (userType === 'requester') {
            const newRequester: Requester = {
                id,
                userType: 'requester',
                ...(userData as NewRequesterData),
            };
            setRequesters(prev => [...prev, newRequester]);
            setCurrentUser(newRequester);
        } else {
            const newEstablishment: Establishment = {
                id,
                userType: 'establishment',
                ...(userData as NewEstablishmentData),
            };
            setEstablishments(prev => [...prev, newEstablishment]);
            setCurrentUser(newEstablishment);
        }
        return true;
    };

    const logout = () => {
        setCurrentUser(null);
    };
    
    const updateUserProfile = (updatedData: Donor | Requester | Establishment) => {
        if (!currentUser || currentUser.id !== updatedData.id) {
            return { success: false, message: "Unauthorized action." };
        }
        
        if (updatedData.userType === 'donor') {
            setDonors(prev => prev.map(d => d.id === updatedData.id ? updatedData as Donor : d));
        } else if (updatedData.userType === 'requester') {
            setRequesters(prev => prev.map(r => r.id === updatedData.id ? updatedData as Requester : r));
        } else if (updatedData.userType === 'establishment') {
            setEstablishments(prev => prev.map(e => e.id === updatedData.id ? updatedData as Establishment : e));
        }
        setCurrentUser(updatedData);
        return { success: true, message: "Profile updated successfully." };
    };
    
    const addDonation = (newDonationData: Omit<Donation, 'id'>) => {
        if (currentUser?.userType !== 'donor') return;
        
        const newDonation: Donation = {
            id: `don-${Date.now()}`,
            ...newDonationData,
        };

        const updatedDonors = donors.map(d => {
            if (d.id === currentUser.id) {
                const updatedHistory = [newDonation, ...d.donationHistory];
                const updatedPoints = d.points + POINTS_PER_DONATION;
                
                const earnedBadges = BADGES.filter(b => 
                    updatedHistory.length >= b.milestone && !d.badges.some(db => db.id === b.id)
                );
                
                const updatedBadges: Badge[] = [...d.badges, ...earnedBadges];

                const updatedDonor = { ...d, donationHistory: updatedHistory, points: updatedPoints, badges: updatedBadges };
                setCurrentUser(updatedDonor);
                return updatedDonor;
            }
            return d;
        });

        setDonors(updatedDonors);
    };

    const addRequest = (newRequestData: Omit<Request, 'id' | 'createdAt' | 'status'>) => {
        if (!currentUser) return;
        const newRequest: Request = {
            id: `req-${Date.now()}`,
            createdAt: new Date().toISOString(),
            status: 'Open',
            responses: [],
            approvedDonors: [],
            ...newRequestData,
        };
        setRequests(prev => [newRequest, ...prev]);
    };
    
    const updateRequest = (updatedRequest: Request) => {
        setRequests(prev => prev.map(r => r.id === updatedRequest.id ? updatedRequest : r));
    };

    const deleteRequest = (requestId: string) => {
        if (!currentUser) return;
        const requestToDelete = requests.find(r => r.id === requestId);
        if (!requestToDelete || requestToDelete.authorId !== currentUser.id) return; // Basic authorization
        setRequests(prev => prev.filter(r => r.id !== requestId));
    };

    const approveDonor = (requestId: string, donorId: string) => {
        setRequests(prevRequests =>
            prevRequests.map(req => {
                if (req.id === requestId) {
                    if (req.responses?.includes(donorId) && !req.approvedDonors?.includes(donorId)) {
                        const updatedApproved = [...(req.approvedDonors || []), donorId];
                        return { ...req, approvedDonors: updatedApproved };
                    }
                }
                return req;
            })
        );
    };

    const value = {
        currentUser,
        donors,
        requests,
        establishments,
        login,
        signup,
        logout,
        updateUserProfile,
        addDonation,
        addRequest,
        updateRequest,
        deleteRequest,
        approveDonor,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppContextProvider');
    }
    return context;
};