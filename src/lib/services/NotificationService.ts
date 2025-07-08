import { supabase } from "@/lib/supabase";

export interface Notification {
    id: string;
    user_id: string;
    type: 'contract_proposal' | 'system_message' | string;
    title: string;
    message: string | null;
    is_read: boolean;
    reference_id: string | null;
    reference_table: string | null;
    created_at: string;
    sender_name?: string;
    sender_profile_picture?: string | null;
}

export interface CreateNotificationData {
    user_id: string;
    type: 'contract_proposal' | 'system_message' | string;
    title: string;
    message?: string;
    reference_id?: string;
    reference_table?: string;
}


export const NotificationService = {
    async getNotifications(userId: string): Promise<Notification[]> {
        const { data, error } = await supabase
            .from('notifications')
            .select(`
                *,
                sender:users!notifications_user_id_fkey(
                    name,
                    profile_picture
                )
            `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching notifications:", error);
            throw error;
        }

        return data.map(n => ({
            ...n,
            sender_name: n.sender?.name,
            sender_profile_picture: n.sender?.profile_picture,
        })) as Notification[];
    },

    async createNotification(notificationData: CreateNotificationData): Promise<{ data: any; error: any }> {
        return supabase
            .from('notifications')
            .insert({
                user_id: notificationData.user_id,
                type: notificationData.type,
                title: notificationData.title,
                message: notificationData.message,
                reference_id: notificationData.reference_id,
                reference_table: notificationData.reference_table,
                is_read: false,
            })
            .select()
            .single();
    },

    async markAsRead(notificationId: string): Promise<{ data: any; error: any }> {
        return supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', notificationId)
            .select()
            .single();
    },
    
    async markContractNotificationAsRead(contractId: string, userId: string): Promise<{ data: any; error: any }> {
        const { data, error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('reference_id', contractId)
            .eq('user_id', userId)
            .eq('type', 'contract_proposal');

        return { data, error };
    }
};