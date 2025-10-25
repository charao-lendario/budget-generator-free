import React, { useState, useEffect } from 'react';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { BudgetGeneratorApp } from './pages/BudgetGeneratorApp';
import { authService } from './services/authService';
import type { User } from './types';

type Page = 'landing' | 'login' | 'signup' | 'app';

const App: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<Page>('landing');
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const user = authService.getCurrentUser();
        if (user) {
            setCurrentUser(user);
            setCurrentPage('app');
        }
        setIsLoading(false);
    }, []);

    const handleLoginSuccess = (user: User) => {
        setCurrentUser(user);
        setCurrentPage('app');
    };

    const handleLogout = () => {
        authService.logout();
        setCurrentUser(null);
        setCurrentPage('landing');
    };

    if (isLoading) {
        // You might want a proper loading screen here
        return <div className="min-h-screen bg-brand-bg"></div>;
    }

    switch (currentPage) {
        case 'login':
            return <LoginPage onLoginSuccess={handleLoginSuccess} onGoToSignup={() => setCurrentPage('signup')} />;
        case 'signup':
            return <SignupPage onSignupSuccess={handleLoginSuccess} onGoToLogin={() => setCurrentPage('login')} />;
        case 'app':
            // currentUser should not be null here, but we check just in case
            return currentUser ? <BudgetGeneratorApp user={currentUser} onLogout={handleLogout} /> : <LoginPage onLoginSuccess={handleLoginSuccess} onGoToSignup={() => setCurrentPage('signup')} />;
        case 'landing':
        default:
            return <LandingPage onGoToLogin={() => setCurrentPage('login')} onGoToSignup={() => setCurrentPage('signup')} />;
    }
};

export default App;