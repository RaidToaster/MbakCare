import { supabase } from "@/lib/supabase";
import { HelperSearchFilters } from "./SearchService";
export interface ContractCreationData {
    customer_id: string;
    helper_id: string;
    start_date: string;
    end_date: string;
    duration_months: number;

    tasks: Array<{ skill_id: string; task_type: 'Main' | 'Additional'; quantity: number; rate_per_task: number }>;
    facilities: string[];
}

export interface ContractDetails extends ContractCreationData {
    id: string;
    contract_number: string | null;
    status: string | null;
    created_at: string;
    agreed_at: string | null;
    customer_name?: string;
    helper_name?: string;
}


export const ContractService = {
    async createContract(
        contractData: Omit<ContractDetails, 'id' | 'contract_number' | 'status' | 'created_at' | 'agreed_at'>,
        tasksData: Array<{ skill_id: string; task_type: 'Main' | 'Additional'; quantity: number; rate_per_task: number }>,
        facilityIds: string[]
    ): Promise<{ contract: ContractDetails | null; error: any }> {
        try {
            // 1. Create the main contract record
            const { data: newContract, error: contractError } = await supabase
                .from('contracts')
                .insert({
                    customer_id: contractData.customer_id,
                    helper_id: contractData.helper_id,
                    start_date: contractData.start_date,
                    end_date: contractData.end_date,
                    duration_months: contractData.duration_months,
                    status: 'Pending',
                })
                .select()
                .single();

            if (contractError) throw contractError;
            if (!newContract) throw new Error("Contract creation failed to return data.");

            const contractId = newContract.id;

            // 2. Insert contract tasks
            if (tasksData && tasksData.length > 0) {
                const tasksToInsert = tasksData.map(task => ({
                    contract_id: contractId,
                    skill_id: task.skill_id,
                    task_type: task.task_type,
                    quantity: task.quantity,
                    rate_per_task: task.rate_per_task,
                }));
                const { error: tasksError } = await supabase.from('contract_tasks').insert(tasksToInsert);
                if (tasksError) {
                    console.error("Error inserting contract tasks:", tasksError);
                    // await supabase.from('contracts').delete().eq('id', contractId);
                    throw tasksError;
                }
            }

            // 3. Insert contract facilities
            if (facilityIds && facilityIds.length > 0) {
                const facilitiesToInsert = facilityIds.map(facilityId => ({
                    contract_id: contractId,
                    facility_id: facilityId,
                }));
                const { error: facilitiesError } = await supabase.from('contract_facilities').insert(facilitiesToInsert);
                if (facilitiesError) {
                    console.error("Error inserting contract facilities:", facilitiesError);
                    // await supabase.from('contracts').delete().eq('id', contractId);
                    throw facilitiesError;
                }
            }

            return { contract: newContract as ContractDetails, error: null };

        } catch (error) {
            console.error("Error in createContract service:", error);
            return { contract: null, error };
        }
    },


    async getContractDetailsById(contractId: string): Promise<ContractDetails | null> {
        const { data, error } = await supabase
            .from('contracts')
            .select(`
                *,
                customer:customers!contracts_customer_id_fkey ( users!inner(name) ),
                helper:helpers!contracts_helper_id_fkey ( users!inner(name) ),
                contract_tasks ( *, skills (name) ),
                contract_facilities ( facilities (name) )
            `)
            .eq('id', contractId)
            .single();

        if (error) {
            console.error("Error fetching contract details:", error);
            if (error.code === 'PGRST116') return null; // Not found
            throw error;
        }

        if (!data) return null;
        return {
            ...data,
            customer_id: data.customer_id,
            helper_id: data.helper_id,
            customer_name: data.customer?.users?.name || "N/A",
            helper_name: data.helper?.users?.name || "N/A",
            tasks: data.contract_tasks.map((task: any) => ({
                id: task.id,
                skill_name: task.skills?.name || "Unknown Skill",
                task_type: task.task_type,
                quantity: task.quantity,
                rate_per_task: task.rate_per_task,
            })),
            facilities: data.contract_facilities.map((cf: any) => cf.facilities?.name).filter(Boolean),
        } as unknown as ContractDetails;
    },

    async updateContractStatus(contractId: string, status: 'Pending' | 'Active' | 'Completed' | 'Terminated'): Promise<{ data: any; error: any }> {
        return supabase
            .from('contracts')
            .update({ status: status, agreed_at: status === 'Active' ? new Date().toISOString() : undefined })
            .eq('id', contractId)
            .select()
            .single();
    },

};