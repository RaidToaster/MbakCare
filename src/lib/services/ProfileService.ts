import { supabase } from "@/lib/supabase";

export interface HelperProfileData {
    id: string;
    name: string | null;
    email: string | null;
    role: string | null;
    address: string | null;
    phone: string | null;
    profile_picture: string | null;
    created_at: string | null;
    age: number | null;
    religion: string | null;
    base_location_name: string | null;
    level: number | null;
    about_me: string | null;
    salary_expectation: number | null;
    available_from: string | null;
    contract_status: string | null;
    rating: number | null;
    experience_points: number | null;
    skills: string[];
}

interface RawHelperData {
    id: string;
    age: number | null;
    religion: string | null;
    level: number | null;
    about_me: string | null;
    salary_expectation: number | null;
    available_from: string | null;
    contract_status: string | null;
    rating: number | null;
    experience_points: number | null;
    users: {
        name: string | null;
        email: string | null;
        role: string | null;
        address: string | null;
        phone: string | null;
        profile_picture: string | null;
        created_at: string | null;
    } | null;
    locations: {
        name: string | null;
    } | null;
    helper_skills: Array<{
        skills: {
            name: string | null;
        } | null;
    }>;
}


export const ProfileService = {
    async getHelperProfileById(helperId: string): Promise<HelperProfileData | null> {
        const { data, error } = await supabase
            .from('helpers')
            .select(`
                id,
                age,
                religion,
                level,
                about_me,
                salary_expectation,
                available_from,
                contract_status,
                rating,
                experience_points,
                users!inner (
                    name,
                    email,
                    role,
                    address,
                    phone,
                    profile_picture,
                    created_at
                ),
                locations ( name ),
                helper_skills (
                    skills ( name )
                )
            `)
            .eq('id', helperId)
            .single<RawHelperData>();

        if (error) {
            console.error("Error fetching helper profile:", error.message, error.details, error.hint);
            if (error.code === 'PGRST116') return null;
            throw error;
        }

        if (!data) return null;

        // Access nested properties assuming they are single objects
        const userData = data.users;
        const locationData = data.locations;

        return {
            id: data.id,
            name: userData?.name || null,
            email: userData?.email || null,
            role: userData?.role || null,
            address: userData?.address || null,
            phone: userData?.phone || null,
            profile_picture: userData?.profile_picture || null,
            created_at: userData?.created_at || null,
            age: data.age,
            religion: data.religion,
            base_location_name: locationData?.name || null,
            level: data.level,
            about_me: data.about_me,
            salary_expectation: data.salary_expectation,
            available_from: data.available_from,
            contract_status: data.contract_status,
            rating: data.rating,
            experience_points: data.experience_points,
            skills: data.helper_skills?.map((hs: any) => hs.skills?.name).filter(Boolean) || [],
        };
    },

    // async getCustomerProfileById(customerId: string): Promise<any | null> {
    //     // Similar explicit typing can be applied here if needed
    //     const { data, error } = await supabase
    //         .from('customers')
    //         .select(`
    //             id,
    //             family_description,
    //             num_family_members,
    //             has_pets,
    //             preferred_helper_level,
    //             users!inner (
    //                 name,
    //                 email,
    //                 role,
    //                 address, 
    //                 phone,
    //                 profile_picture,
    //                 created_at
    //             )
    //         `)
    //         .eq('id', customerId)
    //         .single(); // Add specific type here too if needed: .single<RawCustomerData>()

    //     if (error) {
    //         console.error("Error fetching customer profile:", error.message, error.details, error.hint);
    //         if (error.code === 'PGRST116') return null;
    //         throw error;
    //     }
    //     if (!data) return null;

    //     const userData = data.users;

    //     return {
    //         id: data.id,
    //         name: userData?.name || null,
    //         email: userData?.email || null,
    //         role: userData?.role || null,
    //         profile_picture: userData?.profile_picture || null,
    //         family_description: data.family_description,
    //         num_family_members: data.num_family_members,
    //         has_pets: data.has_pets,
    //         preferred_helper_level: data.preferred_helper_level,
    //     };
    // }
};