import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { I18nProvider } from './contexts/I18nContext';
import { AppContextProvider, useAppContext } from './contexts/AppContext';

// Pages
import HomePage from './pages/HomePage';
import DonorAuth from './pages/donors/DonorAuth';
import EstablishmentAuth from './pages/establishments/EstablishmentAuth';
import RequesterAuth from './pages/requesters/RequesterAuth';
import DashboardPage from './pages/DashboardPage';
import AboutPage from './pages/AboutPage';

// Layout
import Header from './components/shared/Header';
import BottomNav from './components/BottomNav';

// Donor Pages
import DonorProfile from './pages/donors/DonorProfile';
import DonorRequests from './pages/donors/DonorRequests';
import LeaderboardPage from './pages/donors/LeaderboardPage';
import DonorPublicProfilePage from './pages/donors/DonorPublicProfilePage';

// Establishment Pages
import EstablishmentProfile from './pages/establishments/EstablishmentProfile';
import DonorsList from './pages/establishments/DonorsList';
import RequestsList from './pages/establishments/RequestsList';

// Requester Pages
import RequesterProfile from './pages/requesters/RequesterProfile';
import FindDonorsPage from './pages/requesters/FindDonorsPage';
import MyRequests from './pages/requesters/MyRequests';


const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <ThemeProvider>
        <I18nProvider>
            <AppContextProvider>
                {children}
            </AppContextProvider>
        </I18nProvider>
    </ThemeProvider>
);

const PrivateRoute: React.FC = () => {
    const { currentUser } = useAppContext();
    return currentUser ? (
        <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
            <Header />
            <main className="flex-grow max-w-4xl mx-auto w-full px-4 pt-6 pb-20">
                <Outlet />
            </main>
            <BottomNav />
        </div>
    ) : <Navigate to="/" />;
};

const App: React.FC = () => {
    return (
        <AppProviders>
            <Router>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/donor-auth" element={<DonorAuth />} />
                    <Route path="/establishment-auth" element={<EstablishmentAuth />} />
                    <Route path="/requester-auth" element={<RequesterAuth />} />

                    <Route element={<PrivateRoute />}>
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/my-requests" element={<MyRequests />} />

                        {/* Donor Routes */}
                        <Route path="/profile" element={<DonorProfile />} />
                        <Route path="/donor/:donorId" element={<DonorPublicProfilePage />} />
                        <Route path="/find-requests" element={<DonorRequests />} />
                        <Route path="/leaderboard" element={<LeaderboardPage />} />
                        
                        {/* Establishment Routes */}
                        <Route path="/establishment-profile" element={<EstablishmentProfile />} />
                        <Route path="/find-donors" element={<DonorsList />} />
                        <Route path="/manage-requests" element={<RequestsList />} />
                        
                        {/* Requester Routes */}
                        <Route path="/requester-profile" element={<RequesterProfile />} />
                        <Route path="/search-donors" element={<FindDonorsPage />} />

                    </Route>
                </Routes>
            </Router>
        </AppProviders>
    );
};

export default App;