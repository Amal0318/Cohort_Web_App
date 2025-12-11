import React, { createContext, useContext, useState } from 'react';
import authService from '../services/auth';

const AuthContext = createContext();

// Role-based access control configuration
const ROLE_ACCESS = {
    student: ['/', '/clt', '/sri', '/cfc', '/iipc', '/scd', '/profile-settings'],
    mentor: ['/mentor-dashboard'],
    floorwing: ['/floorwing-dashboard'],
    admin: ['/admin-dashboard'],
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        // Initialize state from localStorage
        return authService.getCurrentUser();
    });
    const [loading, setLoading] = useState(false);

    const login = async (username, password, role) => {
        try {
            setLoading(true);
            const response = await authService.login(username, password);
            
            const userWithRole = {
                ...response.user,
                role: role || response.user.role || 'student',
                timestamp: new Date().toISOString(),
            };
            
            setUser(userWithRole);
            localStorage.setItem('user', JSON.stringify(userWithRole));
            return userWithRole;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const hasAccess = (path) => {
        if (!user) return false;
        const allowedPaths = ROLE_ACCESS[user.role] || [];
        return allowedPaths.includes(path) || path === '/login';
    };

    const getToken = () => {
        return authService.getAccessToken();
    };

    const value = {
        user,
        login,
        logout,
        hasAccess,
        loading,
        isAuthenticated: authService.isAuthenticated(),
        getToken,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
