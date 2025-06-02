import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
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
    const initialLoad = useRef(true);
    const lastUserId = useRef<string | null>(null);

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
            const currentUser = currentSession?.user ?? null;
            setUser(currentUser);

            if (currentUser) {
                lastUserId.current = currentUser.id;
                try {
                    const role = await AuthService.getUserRole(currentUser.id);
                    console.log("Initial user role:", role);
                    setUserRole(role);
                } catch (roleError) {
                    console.error("Error fetching user role on initial load:", roleError);
                    setUserRole(null);
                }
            } else {
                setUserRole(null);
                lastUserId.current = null;
            }
            setIsRoleLoading(false);
            setIsLoading(false);
            initialLoad.current = false;
        };

        fetchInitialSessionAndRole();

        const { data: authListener } = supabase.auth.onAuthStateChange(
            async (event, newSession) => {
                if (initialLoad.current) {
                    return;
                }

                const newUserId = newSession?.user?.id ?? null;
                if (newUserId === lastUserId.current && (event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN')) {
                    setSession(newSession);
                    return;
                }

                console.log("Auth event:", event, newSession);
                setSession(newSession);
                const currentUser = newSession?.user ?? null;

                if (currentUser) {
                    lastUserId.current = currentUser.id;
                    setUser(currentUser);
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
                    lastUserId.current = null;
                    setUser(null);
                    setUserRole(null);
                    setIsRoleLoading(false);
                }

                if (event === 'SIGNED_OUT') {
                    setUser(null);
                    setUserRole(null);
                    setSession(null);
                    lastUserId.current = null;
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

