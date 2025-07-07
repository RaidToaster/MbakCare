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
    profileImageUrl: string | null;
    setProfileImageUrl: (url: string | null) => void;
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
    const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
    const initialLoad = useRef(true);
    const lastUserId = useRef<string | null>(null);

    useEffect(() => {
        const fetchProfilePicture = async (userId: string) => {
            try {
                const { data, error } = await supabase
                    .from('users')
                    .select('profile_picture')
                    .eq('id', userId)
                    .single();
                if (error && error.code !== 'PGRST116') throw error;
                if (data?.profile_picture) {
                    setProfileImageUrl(data.profile_picture);
                } else {
                    setProfileImageUrl(null);
                }
            } catch (e) {
                console.error("Failed to fetch profile picture:", e);
                setProfileImageUrl(null); 
            }
        };

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
                await Promise.all([
                    (async () => {
                        try {
                            const role = await AuthService.getUserRole(currentUser.id);
                            console.log("Initial user role:", role);
                            setUserRole(role);
                        } catch (roleError) {
                            console.error("Error fetching user role on initial load:", roleError);
                            setUserRole(null);
                        }
                    })(),
                    fetchProfilePicture(currentUser.id)
                ]);
            } else {
                setUserRole(null);
                setProfileImageUrl(null);
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
                        fetchProfilePicture(currentUser.id);
                    } catch (roleError) {
                        console.error("Error fetching user role on auth change:", roleError);
                        setUserRole(null);
                    }
                    setIsRoleLoading(false);
                } else {
                    lastUserId.current = null;
                    setUser(null);
                    setUserRole(null);
                    setProfileImageUrl(null);
                    setIsRoleLoading(false);
                }

                if (event === 'SIGNED_OUT') {
                    setUser(null);
                    setUserRole(null);
                    setSession(null);
                    setProfileImageUrl(null);
                    lastUserId.current = null;
                }
            }
        );

        return () => {
            authListener?.subscription.unsubscribe();
        };
    }, []);

    const value = { user, session, userRole, isLoading, isRoleLoading, profileImageUrl, setProfileImageUrl };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthCt = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

