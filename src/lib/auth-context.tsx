import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { AuthService } from '@/lib/services/AuthService';

type UserRole = 'customer' | 'helper' | 'admin' | null;

interface AuthContextType {
    user: User | null;
    session: Session | null;
    userRole: UserRole;
    isLoading: boolean;
    isRoleLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [userRole, setUserRole] = useState<UserRole>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRoleLoading, setIsRoleLoading] = useState(false); 

    useEffect(() => {
        const fetchInitialSessionAndRole = async () => {
            setIsLoading(true);
            setIsRoleLoading(true);

            const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();

            if (sessionError) {
                console.error("Error fetching initial session:", sessionError.message);
                setIsLoading(false);
                setIsRoleLoading(false);
                return;
            }
            
            setSession(currentSession);
            const currentUser = currentSession?.user || null;
            setUser(currentUser);

            if (currentUser) {
                try {
                    const role = await AuthService.getUserRole(currentUser.id);
                    setUserRole(role);
                } catch (roleError) {
                    console.error("Error fetching user role on initial load:", roleError);
                    setUserRole(null);
                }
            } else {
                setUserRole(null);
            }
            setIsRoleLoading(false);
            setIsLoading(false);
        };

        fetchInitialSessionAndRole();

        const { data: authListener } = supabase.auth.onAuthStateChange(
            async (_event, newSession) => {
                setSession(newSession);
                const currentUser = newSession?.user ?? null;
                setUser(currentUser);

                if (currentUser) {
                    setIsRoleLoading(true);
                    try {
                        const role = await AuthService.getUserRole(currentUser.id);
                        setUserRole(role);
                    } catch (roleError) {
                        console.error("Error fetching user role on auth change:", roleError);
                        setUserRole(null);
                    }
                    setIsRoleLoading(false);
                } else {
                    setUserRole(null);
                    setIsRoleLoading(false);
                }
                 if (_event === 'INITIAL_SESSION') {
                    setIsLoading(false);
                }
            }
        );

        return () => {
            authListener?.subscription.unsubscribe();
        };
    }, []);

    const value = { user, session, userRole, isLoading, isRoleLoading };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthCt = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};