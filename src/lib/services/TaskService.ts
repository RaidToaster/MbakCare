import { supabase } from "@/lib/supabase";
import { NotificationService } from "./NotificationService";
import { ProfileService } from "./ProfileService";

export interface DailyTask {
    id: string;
    contract_id: string;
    skill_id: string;
    date: string;
    description: string;
    require_photo: boolean;
    photo_url?: string | null;
    status: 'Pending' | 'Completed' | 'Rejected';
    notes?: string | null;
    created_at: string;
    priority: 'High' | 'Medium' | 'Low';
    xp_value: number;
    due_date?: string | null;
    skill_name?: string;
}

export interface TaskCreationData {
    contract_id: string;
    skill_id: string;
    description: string;
    require_photo?: boolean;
    priority?: 'High' | 'Medium' | 'Low';
    xp_value?: number;
    due_date?: string;
}

export const TaskService = {
    async createDailyTask(taskData: TaskCreationData): Promise<{ task: DailyTask | null, error: any }> {
        const { data: newTask, error } = await supabase
            .from('daily_tasks')
            .insert({
                ...taskData,
                status: 'Pending' 
            })
            .select()
            .single();

        if (error) {
            console.error("Error creating daily task:", error);
            return { task: null, error };
        }
        
        // Notify the helper about the new task
        if (newTask) {
            const { data: contract } = await supabase
                .from('contracts')
                .select('helper_id')
                .eq('id', newTask.contract_id)
                .single();

            if (contract?.helper_id) {
                await NotificationService.createNotification({
                    user_id: contract.helper_id,
                    type: 'new_task',
                    title: 'New Task Assigned',
                    message: `You have a new task: ${newTask.description}`,
                    reference_id: newTask.id,
                    reference_table: 'daily_tasks'
                });
            }
        }

        return { task: newTask as DailyTask, error: null };
    },

    async getDailyTasksForContract(contractId: string, date: string): Promise<DailyTask[]> {
        const { data, error } = await supabase
            .from('daily_tasks')
            .select(`
                *,
                skills (name)
            `)
            .eq('contract_id', contractId)
            .eq('date', date)
            .order('created_at', { ascending: true });

        if (error) {
            console.error("Error fetching daily tasks:", error);
            return [];
        }

        return data.map(task => ({
            ...task,
            skill_name: task.skills?.name || 'N/A'
        })) as DailyTask[];
    },

    async updateTaskStatus(taskId: string, status: 'Completed' | 'Rejected', photo_url?: string): Promise<{ task: DailyTask | null, error: any }> {
        const { data: updatedTask, error } = await supabase
            .from('daily_tasks')
            .update({ status, photo_url: photo_url })
            .eq('id', taskId)
            .select()
            .single();

        if (error) {
            console.error("Error updating task status:", error);
            return { task: null, error };
        }

        if (status === 'Completed' && updatedTask) {
            await this.addExperienceToHelper(updatedTask.id);
        }

        return { task: updatedTask as DailyTask, error: null };
    },

    async addExperienceToHelper(taskId: string): Promise<void> {
        const { data: task, error: taskError } = await supabase
            .from('daily_tasks')
            .select('xp_value, contract_id')
            .eq('id', taskId)
            .single();

        if (taskError || !task) {
            console.error("Error fetching task for XP:", taskError);
            return;
        }

        const { data: contract, error: contractError } = await supabase
            .from('contracts')
            .select('helper_id')
            .eq('id', task.contract_id)
            .single();

        if (contractError || !contract) {
            console.error("Error fetching contract for XP:", contractError);
            return;
        }

        const helperId = contract.helper_id;
        if (helperId) {
            const { error: updateError } = await supabase.rpc('add_experience', {
                p_helper_id: helperId,
                p_xp_to_add: task.xp_value
            });

            if (updateError) {
                console.error("Error adding experience points:", updateError);
                return;
            }
            await this.checkLevelUp(helperId);
        }
    },

    async checkLevelUp(helperId: string): Promise<void> {
        const { data: helper, error: helperError } = await supabase
            .from('helpers')
            .select('level, experience_points')
            .eq('id', helperId)
            .single();

        if (helperError || !helper) {
            console.error("Error fetching helper for level up check:", helperError);
            return;
        }

        const { data: nextLevel, error: levelError } = await supabase
            .from('level_xp_thresholds')
            .select('xp_required')
            .gt('level', helper.level)
            .order('level', { ascending: true })
            .limit(1)
            .single();

        if (levelError || !nextLevel) {
            // No more levels or an error occurred
            return;
        }

        if (helper.experience_points >= nextLevel.xp_required) {
            const { error: updateError } = await supabase
                .from('helpers')
                .update({ level: helper.level + 1 })
                .eq('id', helperId);
            
            if (updateError) {
                console.error("Error leveling up helper:", updateError);
            } else {
                 await NotificationService.createNotification({
                    user_id: helperId,
                    type: 'level_up',
                    title: 'Congratulations! You Leveled Up!',
                    message: `You have reached level ${helper.level + 1}. Keep up the great work!`,
                });
            }
        }
    }
};