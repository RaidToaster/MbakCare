import { supabase } from "@/lib/supabase";
import { NotificationService } from "./NotificationService";
import { ProfileService } from "./ProfileService";

export interface ContractCreationData {
    customer_id: string;
    helper_id: string;
    start_date: string;
    end_date: string;
    duration_months: number;

    tasks: Array<{ id?: string; skill_id: string; task_type: 'Main' | 'Additional'; quantity: number; rate_per_task: number; skill_name?: string }>;
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


export interface BasicContractInfo {
    id: string;
    contract_number: string | null;
    customer_name: string;
    customer_profile_picture: string | null;
    start_date: string;
    status: string | null;
    created_at: string;
}

interface RawPendingContractData {
    id: string;
    contract_number: string | null;
    customer: {
        users: {
            name: string | null;
            profile_picture: string | null;
        } | null;
    } | null;
    start_date: string;
    status: string;
    created_at: string;
}

export const ContractService = {
    async isHelperAvailable(helperId: string): Promise<boolean> {
        const { data, error } = await supabase
            .from('contracts')
            .select('id')
            .eq('helper_id', helperId)
            .eq('status', 'Active')
            .limit(1);

        if (error) {
            console.error("Error checking helper availability:", error);
            return false; // Assume not available on error
        }

        return data.length === 0;
    },

    async createContract(
        contractData: Omit<ContractDetails, 'id' | 'contract_number' | 'status' | 'created_at' | 'agreed_at'>,
        tasksData: Array<{ skill_id: string; task_type: 'Main' | 'Additional'; quantity: number; rate_per_task: number }>,
        facilityIds: string[]
    ): Promise<{ contract: ContractDetails | null; error: any }> {
        try {
            const available = await this.isHelperAvailable(contractData.helper_id);
            if (!available) {
                throw new Error("This helper is currently in an active contract and cannot be hired at the moment.");
            }

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

            // Notify the helper
            if (newContract.helper_id) {
                await NotificationService.createNotification({
                    user_id: newContract.helper_id,
                    type: 'contract_proposal',
                    title: 'New Contract Proposal',
                    message: 'You have received a new contract proposal.',
                    reference_id: contractId,
                    reference_table: 'contracts'
                });
            }

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
                customer:customers!contracts_customer_id_fkey ( users(name) ),
                helper:helpers!contracts_helper_id_fkey ( users(name) ),
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
                skill_id: task.skill_id,
                skill_name: task.skills?.name || "Unknown Skill",
                task_type: task.task_type,
                quantity: task.quantity,
                rate_per_task: task.rate_per_task,
            })),
            facilities: data.contract_facilities.map((cf: any) => cf.facilities?.name).filter(Boolean),
        } as unknown as ContractDetails;
    },

    async getPendingContractsForHelper(helperId: string): Promise<BasicContractInfo[]> {
        const { data, error } = await supabase
            .from('contracts')
            .select(`
                id,
                contract_number,
                customer:customers!contracts_customer_id_fkey (
                    users (
                        name,
                        profile_picture
                    )
                ),
                start_date,
                status,
                created_at
            `)
            .eq('helper_id', helperId)
            .eq('status', 'Pending')
            .order('created_at', { ascending: false })
            .returns<RawPendingContractData[]>();

        if (error) {
            console.error("Error fetching pending contracts for helper:", error.message, error.details, error.hint);
            return [];
        }
        if (!data) {
            return [];
        }

        return data.map(contract => {
            const customerUser = contract.customer?.users;

            return {
                id: contract.id,
                contract_number: contract.contract_number,
                customer_name: customerUser?.name || "Unknown Customer",
                customer_profile_picture: customerUser?.profile_picture || null,
                start_date: contract.start_date,
                status: contract.status,
                created_at: contract.created_at,
            };
        });
    },

    async updateContractStatus(contractId: string, status: 'Active' | 'Terminated'): Promise<{ data: any; error: any }> {
        const { data: updatedContract, error: updateError } = await supabase
            .from('contracts')
            .update({
                status: status,
                agreed_at: status === 'Active' ? new Date().toISOString() : null
            })
            .eq('id', contractId)
            .select('id, customer_id, helper_id')
            .single();

        if (updateError) {
            console.error("Error updating contract status:", updateError);
            return { data: null, error: updateError };
        }
        if (!updatedContract) {
            return { data: null, error: new Error("Failed to update contract or contract not found.") };
        }

        // Update helper's contract status
        if (updatedContract.helper_id) {
            const helperStatus = status === 'Active' ? 'On Contract' : 'Available';
            await ProfileService.updateHelperContractStatus(updatedContract.helper_id, helperStatus);
        }

        // Notify the customer about the helper's decision
        if (updatedContract.customer_id) {
            const title = status === 'Active' ? 'Contract Accepted' : 'Contract Declined';
            const message = `The contract proposal has been ${status === 'Active' ? 'accepted' : 'declined'} by the helper.`;
            await NotificationService.createNotification({
                user_id: updatedContract.customer_id,
                type: 'system_message',
                title: title,
                message: message,
                reference_id: contractId,
                reference_table: 'contracts'
            });
        }

        return { data: updatedContract, error: null };
    },
    async getActiveContractForUser(userId: string, role: 'customer' | 'helper'): Promise<ContractDetails | null> {
        const userRoleColumn = role === 'customer' ? 'customer_id' : 'helper_id';

        const { data, error } = await supabase
            .from('contracts')
            .select(`
                *,
                customer:customers!contracts_customer_id_fkey ( users(name) ),
                helper:helpers!contracts_helper_id_fkey ( users(name) ),
                contract_tasks ( *, skills (name) ),
                contract_facilities ( facilities (name) )
            `)
            .eq(userRoleColumn, userId)
            .eq('status', 'Active')
            .limit(1)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null; // No active contract found, which is not an error
            console.error("Error fetching active contract:", error);
            return null;
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
                skill_id: task.skill_id,
                skill_name: task.skills?.name || "Unknown Skill",
                task_type: task.task_type,
                quantity: task.quantity,
                rate_per_task: task.rate_per_task,
            })),
            facilities: data.contract_facilities.map((cf: any) => cf.facilities?.name).filter(Boolean),
        } as unknown as ContractDetails;
    },

};