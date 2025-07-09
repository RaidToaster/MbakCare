// src/lib/services/ProfileService.ts
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

export interface HelperProfileData {
    id: string;
    name: string | null;
    email: string | null;
    role: string | null;
    address: string | null;
    phone: string | null;
    profile_picture: string | null;
    // created_at: string | null; // Usually not part of editable form data
    age: number | null;
    religion: string | null;
    base_location_id: string | null; // Store ID
    base_location_name?: string | null; // For display
    level: number | null;
    about_me: string | null;
    salary_expectation: number | null;
    available_from: string | null; // YYYY-MM-DD
    contract_status: string | null;
    rating: number | null; // Usually system-managed
    experience_points: number | null; // Usually system-managed
    skills: string[]; // Handled via helper_skills table, manage separately if editable here
    marital_status: string | null;
    number_of_kids: number | null;
    preferred_job_type: string | null;
    education_level: string | null;
    day_off_preference: string | null;
    languages: string[] | null;
    personality_traits: string[] | null;
    professional_title: string | null;
    // OnJobMoments (photo URLs) would be TEXT[] if added to helpers table
    // looking_for_job: boolean | null; // For the OnOffToggle
}

export interface CustomerProfileData {
    id: string;
    name: string | null;
    email: string | null;
    role: string | null;
    address: string | null;
    phone: string | null;
    profile_picture: string | null;
    family_description: string | null;
    num_family_members: number | null;
    has_pets: boolean | null;
    preferred_helper_level: number | null;
    // looking_for_helper: boolean | null; // For the OnOffToggle
}

interface RawHelperDataFromDB {
    id: string;
    age: number | null;
    religion: string | null;
    base_location_id: string | null;
    level: number | null;
    about_me: string | null;
    salary_expectation: number | null;
    available_from: string | null;
    contract_status: string | null;
    rating: number | null;
    experience_points: number | null;
    marital_status: string | null;
    number_of_kids: number | null;
    preferred_job_type: string | null;
    education_level: string | null;
    day_off_preference: string | null;
    languages: string[] | null;
    personality_traits: string[] | null;
    professional_title: string | null;
    users: {
        name: string | null;
        email: string | null;
        role: string | null;
        address: string | null;
        phone: string | null;
        profile_picture: string | null;
    } | null;
    locations: {
        id: string; // Include ID for setting base_location_id
        name: string | null;
    } | null;
}

interface RawCustomerDataFromDB {
    id: string;
    family_description: string | null;
    num_family_members: number | null;
    has_pets: boolean | null;
    preferred_helper_level: number | null;
    users: {
        name: string | null;
        email: string | null;
        role: string | null;
        address: string | null;
        phone: string | null;
        profile_picture: string | null;
    } | null;
}


type UserTableUpdateData = Partial<Pick<HelperProfileData | CustomerProfileData, 'name' | 'address' | 'phone' | 'profile_picture'>>;

type HelperTableUpdateData = Partial<Omit<HelperProfileData, 'id' | 'email' | 'role' | 'profile_picture' | 'name' | 'address' | 'phone' | 'base_location_name'>>;

type CustomerTableUpdateData = Partial<Omit<CustomerProfileData, 'id' | 'email' | 'role' | 'profile_picture' | 'name' | 'address' | 'phone'>>;


export const ProfileService = {
    async getCustomerProfileById(customerId: string): Promise<CustomerProfileData | null> {
        const { data, error } = await supabase
            .from('customers')
            .select(`
                id, family_description, num_family_members, has_pets, preferred_helper_level,
                users (
                    name, email, role, address, phone, profile_picture
                )
            `)
            .eq('id', customerId)
            .single<RawCustomerDataFromDB>();

        if (error) {
            console.error("Error fetching customer profile by id:", error);
            if (error.code === 'PGRST116') return null;
            throw error;
        }
        if (!data) return null;

        return {
            id: data.id,
            name: data.users?.name ?? null,
            email: data.users?.email ?? null,
            role: data.users?.role ?? null,
            address: data.users?.address ?? null,
            phone: data.users?.phone ?? null,
            profile_picture: data.users?.profile_picture ?? null,
            family_description: data.family_description,
            num_family_members: data.num_family_members,
            has_pets: data.has_pets,
            preferred_helper_level: data.preferred_helper_level,
        } as CustomerProfileData;
    },
    async getHelperProfileById(helperId: string): Promise<HelperProfileData | null> {
        const { data, error } = await supabase
            .from('helpers')
            .select(`
            id, age, religion, base_location_id, level, about_me,
            salary_expectation, available_from, contract_status,
            marital_status, number_of_kids, preferred_job_type,
            education_level, day_off_preference, languages,
            personality_traits, professional_title,
            users (
                name, email, role, address, phone, profile_picture
            ),
            locations (id, name)
        `)
            .eq('id', helperId)
            .single<RawHelperDataFromDB>();

        if (error) {
            console.error("Error fetching helper profile by id:", error);
            if (error.code === 'PGRST116') return null;
            throw error;
        }
        if (!data) return null;

        return {
            id: data.id,
            name: data.users?.name ?? null,
            email: data.users?.email ?? null,
            role: data.users?.role ?? null,
            address: data.users?.address ?? null,
            phone: data.users?.phone ?? null,
            profile_picture: data.users?.profile_picture ?? null,
            age: data.age,
            religion: data.religion,
            base_location_id: data.locations?.id || data.base_location_id || null,
            base_location_name: data.locations?.name || null,
            level: data.level,
            about_me: data.about_me,
            salary_expectation: data.salary_expectation,
            available_from: data.available_from,
            contract_status: data.contract_status,
            marital_status: data.marital_status,
            number_of_kids: data.number_of_kids,
            preferred_job_type: data.preferred_job_type,
            education_level: data.education_level,
            rating: data.rating || 0,
            day_off_preference: data.day_off_preference,
            languages: data.languages,
            personality_traits: data.personality_traits,
            professional_title: data.professional_title,
        } as HelperProfileData;
    },

    async getCurrentUserProfile(userId: string, userRole: string): Promise<HelperProfileData | CustomerProfileData | null> {
        if (userRole === 'helper') {
            const { data, error } = await supabase
                .from('users')
                .select(`
                    id, name, email, role, address, phone, profile_picture,
                    helpers!inner (
                        age, religion, base_location_id, level, about_me,
                        salary_expectation, available_from, contract_status,
                        marital_status, number_of_kids, preferred_job_type,
                        education_level, day_off_preference, languages,
                        personality_traits, professional_title,
                        locations (id, name)
                    )
                `)
                .eq('id', userId)
                .single<{
                    id: string;
                    name: string | null;
                    email: string | null;
                    role: string | null;
                    address: string | null;
                    phone: string | null;
                    profile_picture: string | null;
                    helpers: RawHelperDataFromDB | RawHelperDataFromDB[] | null;
                }>();

            if (error) {
                console.error("Error fetching helper profile:", error);
                if (error.code === 'PGRST116') return null;
                throw error;
            }
            if (!data || !data.helpers) return null;
            const helperSpecificData = Array.isArray(data.helpers) ? data.helpers[0] : data.helpers;

            return {
                id: data.id,
                name: data.name,
                email: data.email,
                role: data.role,
                address: data.address,
                phone: data.phone,
                profile_picture: data.profile_picture,
                age: helperSpecificData.age,
                religion: helperSpecificData.religion,
                base_location_id: helperSpecificData.locations?.id || helperSpecificData.base_location_id || null,
                base_location_name: helperSpecificData.locations?.name || null,
                level: helperSpecificData.level,
                about_me: helperSpecificData.about_me,
                salary_expectation: helperSpecificData.salary_expectation,
                available_from: helperSpecificData.available_from,
                contract_status: helperSpecificData.contract_status,
                marital_status: helperSpecificData.marital_status,
                number_of_kids: helperSpecificData.number_of_kids,
                preferred_job_type: helperSpecificData.preferred_job_type,
                education_level: helperSpecificData.education_level,
                day_off_preference: helperSpecificData.day_off_preference,
                languages: helperSpecificData.languages,
                personality_traits: helperSpecificData.personality_traits,
                professional_title: helperSpecificData.professional_title,
            } as HelperProfileData;

        } else if (userRole === 'customer') {
            const { data, error } = await supabase
                .from('users')
                .select(`
                    id, name, email, role, address, phone, profile_picture,
                    customers!inner (
                        family_description, num_family_members, has_pets, preferred_helper_level
                    )
                `)
                .eq('id', userId)
                .single<{
                    id: string;
                    name: string | null;
                    email: string | null;
                    role: string | null;
                    address: string | null;
                    phone: string | null;
                    profile_picture: string | null;
                    customers: RawCustomerDataFromDB | RawCustomerDataFromDB[] | null;
                }>();

            if (error) {
                console.error("Error fetching customer profile:", error);
                if (error.code === 'PGRST116') return null;
                throw error;
            }
            if (!data || !data.customers) return null;
            const customerSpecificData = Array.isArray(data.customers) ? data.customers[0] : data.customers;

            return {
                id: data.id,
                name: data.name,
                email: data.email,
                role: data.role,
                address: data.address,
                phone: data.phone,
                profile_picture: data.profile_picture,
                family_description: customerSpecificData.family_description,
                num_family_members: customerSpecificData.num_family_members,
                has_pets: customerSpecificData.has_pets,
                preferred_helper_level: customerSpecificData.preferred_helper_level,
            } as CustomerProfileData;
        }
        return null;
    },

    async updateUserTable(userId: string, userData: UserTableUpdateData): Promise<{ data: any, error: any }> {
        console.log(userData)
        const { data, error } = await supabase
            .from('users')
            .update(userData)
            .eq('id', userId)
            .select()

        if (error) {
            console.error("Error updating user table:", error);
            throw error; // Rethrow or handle as needed
        }

        return { data, error };
    },

    async updateHelperTable(helperId: string, helperData: HelperTableUpdateData): Promise<{ data: any, error: any }> {
        const { data, error } = await supabase
            .from('helpers')
            .update(helperData)
            .eq('id', helperId)
            .select()

        if (error) {
            console.error("Error updating helper table:", error);
            throw error;
        }

        return { data, error };
    },

    async updateCustomerTable(customerId: string, customerData: CustomerTableUpdateData): Promise<{ data: any, error: any }> {
        const { data, error } = await supabase
            .from('customers')
            .update(customerData)
            .eq('id', customerId)
            .select()

        if (error) {
            console.error("Error updating customer table:", error);
            throw error;
        }

        return { data, error };
    },


    async uploadProfilePicture(userId: string, file: File): Promise<{ publicUrl: string | null, error: Error | null }> {
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}_${Date.now()}.${fileExt}`;
        const filePath = `profile_pictures/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('avatars') // Bucket name
            .upload(filePath, file, { upsert: true });

        if (uploadError) {
            console.error('Error uploading profile picture:', uploadError);
            return { publicUrl: null, error: uploadError as Error };
        }

        const { data } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);

        return { publicUrl: data.publicUrl, error: null };
    },

    async getLocations(): Promise<{ id: string, name: string }[]> {
        const { data, error } = await supabase.from('locations').select('id, name').order('name');
        if (error) {
            console.error("Error fetching locations:", error);
            return [];
        }
        return data || [];
    },

    async getSkillsForHelperEdit(): Promise<{ id: string, name: string }[]> {
        const { data, error } = await supabase.from('skills').select('id, name').order('name');
        if (error) {
            console.error("Error fetching skills:", error);
            return [];
        }
        return data || [];
    },

    async getHelperSkills(helperId: string): Promise<string[]> { // Returns array of skill IDs
        const { data, error } = await supabase
            .from('helper_skills')
            .select('skill_id')
            .eq('helper_id', helperId);
        if (error) {
            console.error("Error fetching helper skills:", error);
            return [];
        }
        return data?.map(hs => hs.skill_id) || [];
    },

    async updateHelperSkills(helperId: string, newSkillIds: string[]): Promise<{ error: any }> {
        await supabase.from('helper_skills').delete().eq('helper_id', helperId);
        if (newSkillIds.length > 0) {
            const skillsToInsert = newSkillIds.map(skill_id => ({ helper_id: helperId, skill_id }));
            const { error } = await supabase.from('helper_skills').insert(skillsToInsert);
            return { error };
        }
        return { error: null };
    },
    async getLevelThresholds(): Promise<{ level: number, xp_required: number }[]> {
        const { data, error } = await supabase
            .from('level_xp_thresholds')
            .select('level, xp_required')
            .order('level', { ascending: true });

        if (error) {
            console.error("Error fetching level thresholds:", error);
            return [];
        }
        return data || [];
    },

    async updateHelperContractStatus(helperId: string, status: 'Available' | 'On Contract'): Promise<{ error: any }> {
        const { error } = await supabase
            .from('helpers')
            .update({ contract_status: status })
            .eq('id', helperId);
        
        if (error) {
            console.error("Error updating helper contract status:", error);
        }
        
        return { error };
    }
};