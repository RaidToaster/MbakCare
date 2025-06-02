import { supabase } from "@/lib/supabase";

export interface HelperSearchResult {
    id: string;
    name: string;
    profile_picture: string | null;
    age: number | null;
    base_location_name: string | null;
    level: number | null;
    about_me: string | null;
    salary_expectation: number | null;
    rating: number | null;
    skills: string[];
    contract_status: string | null;
}

export interface HelperSearchFilters {
    name?: string;
    locationId?: string;
    minAge?: number;
    maxAge?: number;
    minLevel?: number;
    maxLevel?: number;
    minSalary?: number;
    maxSalary?: number;
    minRating?: number;
    skills?: string[];
    availableFrom?: string;
    contractStatus?: string;
    page?: number;
    limit?: number;
}

export interface CustomerSearchResult {
    id: string; // users.id
    name: string;
    profile_picture: string | null;
    address: string | null; // users.address
    family_description: string | null;
    num_family_members: number | null;
    has_pets: boolean | null;
    preferred_helper_level: number | null;
}

export interface CustomerSearchFilters {
    name?: string;
    locationId?: string;
    minFamilyMembers?: number;
    maxFamilyMembers?: number;
    hasPets?: boolean;
    preferredHelperLevel?: number;
    page?: number;
    limit?: number;
}

export const SearchService = {
    async fetchHelpers(filters: HelperSearchFilters = {}): Promise<HelperSearchResult[]> {
        let query = supabase
            .from('helpers')
            .select(`
                id,
                users!inner (
                    name,
                    profile_picture,
                    role
                ),
                age,
                locations ( name ), 
                level,
                about_me,
                salary_expectation,
                rating,
                contract_status,
                helper_skills (
                    skills( name )
                )
            `)
            .eq('users.role', 'helper');

        if (filters.name) {
            query = query.ilike('users.name', `%${filters.name}%`);
        }

        if (filters.locationId) {
            query = query.eq('base_location_id', filters.locationId);
        }

        if (filters.minAge) {
            query = query.gte('age', filters.minAge);
        }
        if (filters.maxAge) {
            query = query.lte('age', filters.maxAge);
        }

        if (filters.minLevel) {
            query = query.gte('level', filters.minLevel);
        }
        if (filters.maxLevel) {
            query = query.lte('level', filters.maxLevel);
        }

        if (filters.minSalary) {
            query = query.gte('salary_expectation', filters.minSalary);
        }
        if (filters.maxSalary) {
            query = query.lte('salary_expectation', filters.maxSalary);
        }

        if (filters.minRating) {
            query = query.gte('rating', filters.minRating);
        }

        if (filters.contractStatus) {
            query = query.eq('contract_status', filters.contractStatus);
        }

        const page = filters.page || 1;
        const limit = filters.limit || 10;
        const offset = (page - 1) * limit;
        query = query.range(offset, offset + limit - 1);

        const { data, error } = await query;
        console.log("Fetching helpers with filters:", filters, "Result count:", data?.length);

        if (error) {
            console.error("Error fetching helpers:", error);
            throw error;
        }

        return data.map((helper: any) => ({
            id: helper.id,
            name: helper.users.name,
            profile_picture: helper.users.profile_picture,
            age: helper.age,
            base_location_name: helper.locations.name,
            level: helper.level,
            about_me: helper.about_me,
            salary_expectation: helper.salary_expectation,
            rating: helper.rating,
            contract_status: helper.contract_status,
            skills: helper.helper_skills.map((hs: any) => hs.skills.name),
        })) || [];
    },

    async fetchCustomers(filters: Partial<CustomerSearchFilters> = {}): Promise<CustomerSearchResult[]> {
        let query = supabase
            .from('customers')
            .select(`
                id,
                family_description,
                num_family_members,
                has_pets,
                preferred_helper_level,
                users!inner (
                    name,
                    profile_picture,
                    address,
                    role
                )
            `)
            .eq('users.role', 'customer');

        if (filters.name) {
            query = query.ilike('users.name', `%${filters.name}%`);
        }
        if (filters.hasPets !== undefined) {
            query = query.eq('has_pets', filters.hasPets);
        }
        if (filters.preferredHelperLevel) {
            query = query.gte('preferred_helper_level', filters.preferredHelperLevel);
        }


        const page = filters.page || 1;
        const limit = filters.limit || 10;
        const offset = (page - 1) * limit;
        query = query.range(offset, offset + limit - 1);

        const { data, error } = await query;

        if (error) {
            console.error("Error fetching customers:", error);
            throw error;
        }
        if (!data) return [];

        return data.map((customer: any) => ({
            id: customer.id,
            name: customer.users?.name ?? "N/A",
            profile_picture: customer.users?.profile_picture ?? null,
            address: customer.users?.address ?? null,
            family_description: customer.family_description,
            num_family_members: customer.num_family_members,
            has_pets: customer.has_pets,
            preferred_helper_level: customer.preferred_helper_level,
        }));
    },

    async fetchFilterOptions() {
        const { data: locations, error: locationsError } = await supabase
            .from('locations')
            .select('id, name')
            .order('name');

        const { data: skills, error: skillsError } = await supabase
            .from('skills')
            .select('id, name, category')
            .order('category')
            .order('name');

        if (locationsError) console.error("Error fetching locations:", locationsError);
        if (skillsError) console.error("Error fetching skills:", skillsError);

        return {
            locations: locations || [],
            skills: skills || [],
        };
    }
};
