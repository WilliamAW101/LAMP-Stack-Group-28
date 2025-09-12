// src/context/UserContext.tsx
"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
    first_name: string;
    last_name: string;
}

interface UserContextType {
    user: User | null;
    setUser: (user: User) => void;
    logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUserState] = useState<User | null>(null);

    // Load user from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUserState(JSON.parse(storedUser));
        }
    }, []);

    const setUser = (user: User) => {
        setUserState(user);
        localStorage.setItem('user', JSON.stringify(user));
    };

    const logout = () => {
        setUserState(null);
        localStorage.removeItem('user');
    };

    return (
        <UserContext.Provider value={{ user, setUser, logout }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to use context
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error('useUser must be used within a UserProvider');
    return context;
};
