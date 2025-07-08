import { useNavigate } from "react-router-dom";
import defaultUserIcon from "@/assets/images/profile/Default.png";
import { Notification } from "@/lib/services/NotificationService";

interface InboxCardProps {
    notification: Notification;
}

function InboxCard({ notification }: InboxCardProps) {
    const navigate = useNavigate();

    function handleClick() {
        if (notification.type === 'contract_proposal' && notification.reference_id) {
            navigate(`/inbox/detail/${notification.reference_id}`);
        }
    }

    const timeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
        const minutes = Math.round(seconds / 60);
        const hours = Math.round(minutes / 60);
        const days = Math.round(hours / 24);

        if (seconds < 60) return `${seconds}s ago`;
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    const isClickable = notification.type === 'contract_proposal';

    return (
        <div
            onClick={isClickable ? handleClick : undefined}
            className={`w-full flex flex-row gap-4 p-4 rounded-md shadow hover:shadow-lg transition-shadow ${isClickable ? 'cursor-pointer' : ''} ${!notification.is_read ? 'bg-yellow-50 border-l-4 border-yellow-400' : 'bg-white'
                }`}
        >
            <img
                src={notification.sender_profile_picture || defaultUserIcon}
                alt={notification.sender_name || "Sender"}
                className={"h-12 w-12 rounded-full object-cover self-center"}
            />
            <div className={"flex flex-col w-full gap-1"}>
                <div className={"flex flex-row justify-between items-center"}>
                    <h3 className={"font-semibold text-md text-[#492924]"}>
                        {notification.title}
                    </h3>
                    <p className={"text-xs text-gray-500"}>{timeAgo(notification.created_at)}</p>
                </div>
                <p className={"text-sm text-gray-700"}>
                    {notification.message}
                </p>
                <p className={`text-xs font-medium mt-1 ${!notification.is_read ? 'text-yellow-600' : 'text-gray-500'
                    }`}>
                    {!notification.is_read ? 'Unread' : 'Read'}
                </p>
            </div>
        </div>
    );
}

export default InboxCard;