import { useNavigate } from "react-router-dom";
import defaultUserIcon from "@/assets/images/profile/Default.png";
import { BasicContractInfo } from "@/lib/services/ContractService";

interface InboxCardProps {
    contract: BasicContractInfo;
}

function InboxCard({ contract }: InboxCardProps) {
    const navigate = useNavigate();

    function viewContractDetail() {

        navigate(`/inbox/detail/${contract.id}`);
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


    return (
        <div
            onClick={viewContractDetail}
            className={`w-full flex flex-row gap-4 p-4 rounded-md shadow hover:shadow-lg transition-shadow cursor-pointer ${contract.status === 'Pending' ? 'bg-yellow-50 border-l-4 border-yellow-400' : 'bg-white'
                }`}
        >
            <img
                src={contract.customer_profile_picture || defaultUserIcon}
                alt={contract.customer_name || "Customer"}
                className={"h-12 w-12 rounded-full object-cover self-center"}
            />
            <div className={"flex flex-col w-full gap-0.5"}>
                <div className={"flex flex-row justify-between items-center"}>
                    <h3 className={"font-semibold text-md text-[#492924]"}>
                        Contract Proposal from {contract.customer_name}
                    </h3>
                    <p className={"text-xs text-gray-500"}>{timeAgo(contract.created_at)}</p>
                </div>
                <p className={"text-xs text-gray-600"}>
                    Contract No: {contract.contract_number || "N/A"}
                </p>
                <p className={"text-xs text-gray-600"}>
                    Proposed Start Date: {new Date(contract.start_date).toLocaleDateString('en-GB')}
                </p>
                <p className={`text-xs font-medium mt-1 ${contract.status === 'Pending' ? 'text-yellow-600' : 'text-gray-500'
                    }`}>
                    Status: {contract.status}
                </p>
            </div>
        </div>
    );
}

export default InboxCard;