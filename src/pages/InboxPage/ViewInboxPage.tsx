
import NavigationBar from "@/components/InfoBar/NavigationBar.tsx";
import InboxCard from "@/components/Card/InboxCard.tsx";
import { useEffect, useState } from "react";
import { useAuthCt } from "@/lib/auth-context";
import { Notification, NotificationService } from "@/lib/services/NotificationService.ts";
import { supabase } from "@/lib/supabase";

function ViewInboxPage() {
    const { userRole, isLoading: authIsLoading } = useAuthCt();
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data, error }) => {
            if (data?.user) {
                setCurrentUser(data.user);
            } else {
                setCurrentUser(null);
            }
        });
    }, []);

    useEffect(() => {
        if (currentUser && !authIsLoading) {
            setIsLoading(true);
            setError(null);
            NotificationService.getNotifications(currentUser.id)
                .then(data => {
                    setNotifications(data);
                })
                .catch(err => {
                    console.error("Failed to fetch notifications:", err);
                    setError("Could not load your inbox.");
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else if (!authIsLoading) {
            // No user logged in or auth is still loading
            setNotifications([]);
            setIsLoading(false);
        }
    }, [currentUser, authIsLoading]);

    if (authIsLoading || isLoading) {
        return (
            <div className={"min-h-screen min-w-full max-w-screen h-full"}>
                <NavigationBar />
                <div className={"flex justify-center items-center w-full h-full px-8 lg:px-64 py-8 pt-40 text-[#492924]"}>
                    Loading Inbox...
                </div>
            </div>
        );
    }

    if (!currentUser) {
        return (
            <div className={"min-h-screen min-w-full max-w-screen h-full"}>
                <NavigationBar />
                <div className={"flex flex-col w-full h-full px-8 lg:px-64 py-8 pt-40 gap-8 text-[#492924] items-center"}>
                    <h1 className={"font-bold text-4xl text-center"}>Inbox</h1>
                    <p>Please log in to view your notifications.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={"min-h-screen min-w-full max-w-screen h-full"}>
            <NavigationBar />
            <div className={"flex flex-col w-full h-full px-4 sm:px-8 lg:px-32 xl:px-64 py-8 pt-28 sm:pt-32 md:pt-40 gap-8 text-[#492924]"}>
                <div className="flex flex-col items-center justify-center relative mb-4">
                    <h1 className={"font-bold text-3xl sm:text-4xl text-center"}>Inbox</h1>
                    <div className="w-24 sm:w-32 h-0.5 bg-[#DA807B] mt-1 rounded-md"></div>
                </div>
                {error && <div className="text-center text-red-500 bg-red-100 p-3 rounded-md">{error}</div>}
                <div className={"flex flex-col gap-3 md:gap-4 w-full"}>
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <InboxCard key={notification.id} notification={notification} />
                        ))
                    ) : (
                        !isLoading && <p className="text-center text-gray-500">You have no new notifications.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ViewInboxPage;