import React, { createContext, useState, useEffect } from 'react';
import AuthService from '../services/auth.service';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (user) {
            setCurrentUser(user);
        }
        setLoading(false);
    }, []);

    const login = async (universityId, password) => {
        const data = await AuthService.login(universityId, password);
        setCurrentUser(data);
        return data;
    };

    const register = async (universityId, name, contactInfo, password, role) => {
        return AuthService.register(universityId, name, contactInfo, password, role);
    };

    const logout = () => {
        AuthService.logout();
        setCurrentUser(undefined);
    };

    return (
        <AuthContext.Provider value={{ currentUser, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
