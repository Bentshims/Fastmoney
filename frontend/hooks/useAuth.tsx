'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import api from '@/lib/api';

interface User {
    id: string;
    email: string;
    role: 'OWNER' | 'CAISSIER' | 'GERANT';
    businessId: string;
}

interface Business {
    id: string;
    name: string;
    type: 'MAGASIN' | 'PRESSING';
}

interface AuthContextType {
    user: User | null;
    business: Business | null;
    token: string | null;
    login: (token: string, user: User, business: Business) => void;
    logout: () => void;
    isAuthenticated: boolean;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [business, setBusiness] = useState<Business | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        const storedBusiness = localStorage.getItem('business');

        // Only set if all are present
        if (storedToken && storedUser && storedBusiness) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            setBusiness(JSON.parse(storedBusiness));
        }
        setLoading(false);
    }, []);

    // Protect routes effect
    useEffect(() => {
        if (!loading) {
            const isAuthPage = pathname.startsWith('/auth');
            if (!token && !isAuthPage) {
                router.push('/auth/login');
            } else if (token && isAuthPage) {
                router.push('/dashboard');
            }
        }
    }, [loading, token, pathname, router]);


    const login = (newToken: string, newUser: User, newBusiness: Business) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
        localStorage.setItem('business', JSON.stringify(newBusiness));

        setToken(newToken);
        setUser(newUser);
        setBusiness(newBusiness);

        router.push('/dashboard');
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('business');
        setToken(null);
        setUser(null);
        setBusiness(null);
        router.push('/auth/login');
    };

    return (
        <AuthContext.Provider value={{ user, business, token, login, logout, isAuthenticated: !!token, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
