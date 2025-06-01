import { supabase } from "@/lib/supabase";

type UserRole = 'customer' | 'helper' | 'admin';

export const AuthService = {
    async registerHelper(fullName: string, email: string, password: string) {
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    role: "helper"
                }
            }
        });

        if (authError) {
            throw new Error(authError.message);
        }

        const { error: userProfileError } = await supabase
            .from("users")
            .insert({
                id: authData.user?.id,
                name: fullName,
                email: email,
                role: "helper"
            });

        if (userProfileError) {
            throw new Error(userProfileError.message);
        }

        const { error: helperProfileError } = await supabase
            .from("helpers")
            .insert({
                id: authData.user?.id
            });

        if (helperProfileError) {
            throw new Error(helperProfileError.message);
        }

        return authData;
    },
    async registerCustomer(name: string, email: string, password: string) {
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name: name,
                    role: "customer"
                }
            }
        });
        if (authError) {
            throw new Error(authError.message);
        }
        const { error: userProfileError } = await supabase
            .from("users")
            .insert({
                id: authData.user?.id,
                name: name,
                email: email,
                role: "customer",
                address: "",
                phone: "",
                profile_picture: "",
                created_at: new Date().toISOString()
            });
        if (userProfileError) {
            throw new Error(userProfileError.message);
        }
        return authData;
    },

    async loginWithEmailPassword(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw new Error(error.message);
        return data;
    },

    async signInWithGoogle() {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
                // NOTE TO JOSE MAYBE CHANGE THIS
                // IMPORTANT: Update if needed
                // You might want to pass queryParams for role intention if Google sign-in is on a generic page
                // queryParams: { role: 'customer' } or { role: 'helper' }
            },
        });
        if (error) throw new Error(error.message);
        return data;
    },

    async getUserRole(userId: string): Promise<UserRole | null> {
        const { data, error } = await supabase
            .from('users')
            .select('role')
            .eq('id', userId)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116: 0 rows, not an error for this check
            console.error("Error fetching user role:", error.message);
            return null;
        }
        return data?.role as UserRole || null;
    },

    async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) throw new Error(error.message);
    }
};
