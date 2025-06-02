import { MdLocationOn, MdFamilyRestroom } from "react-icons/md";
import { GiHeartPlus, GiStairsGoal } from "react-icons/gi";
import defaultProfileIcon from "@/assets/images/profile/Default.png";
import { useNavigate } from "react-router-dom";
import { CustomerSearchResult } from "@/lib/services/SearchService";

interface CustomerCardProps {
    customer: CustomerSearchResult;
}

function CustomerCard({ customer }: CustomerCardProps) {
    const navigate = useNavigate();

    function showCustomerInformation() {
        navigate(`/customer-profile/${customer.id}`);
    }

    return (
        <div
            className={"flex flex-row bg-[#F7F8F1] gap-5 py-5 rounded-md shadow-sm cursor-pointer hover:shadow-lg transition-shadow"}
            onClick={showCustomerInformation}
        >
            <div className={"flex flex-col relative w-1/3 items-center gap-3 sm:gap-4"}>
                <div className={"w-full flex justify-center relative"}>
                    <img
                        src={customer.profile_picture || defaultProfileIcon}
                        className={"h-20 w-20 sm:h-24 sm:w-24 rounded-full border-2 border-[#492924] object-cover"}
                        alt={`${customer.name}'s profile`}
                    />
                </div>
                <div className={`w-full py-1 bg-blue-500 rounded-br-2xl rounded-bl-2xl sm:rounded-br-3xl sm:rounded-bl-none flex justify-center text-center`}>
                    <p className={"text-white text-xs sm:text-sm font-medium px-2"}>Seeking Helper</p>
                </div>
            </div>

            <div className={"flex flex-col gap-1.5 sm:gap-2 justify-start text-[#492924] w-2/3 pr-2"}>
                <h2 className={"font-bold text-md sm:text-lg truncate"}>
                    {customer.name}
                </h2>

                <p className="text-xs sm:text-sm text-gray-600 truncate">
                    {customer.family_description ? (customer.family_description.substring(0, 30) + (customer.family_description.length > 30 ? "..." : "")) : "Household"}
                </p>

                {customer.address && (
                    <div className={"flex flex-row gap-2 sm:gap-3 items-center"}>
                        <MdLocationOn className={"text-blue-500 flex-shrink-0"} size={16} />
                        <p className={"text-xs sm:text-sm truncate"}>{customer.address}</p>
                    </div>
                )}

                <div className={"flex flex-row gap-2 sm:gap-3 items-center"}>
                    <MdFamilyRestroom className={"text-blue-500 flex-shrink-0"} size={16} />
                    <p className={"text-xs sm:text-sm"}>
                        {customer.num_family_members !== null ? `${customer.num_family_members} Member${customer.num_family_members !== 1 ? 's' : ''}` : "Family Size N/A"}
                    </p>
                </div>

                <div className={"flex flex-row gap-2 sm:gap-3 items-center"}>
                    <GiHeartPlus className={"text-blue-500 flex-shrink-0"} size={16} />
                    <p className={"text-xs sm:text-sm"}>{customer.has_pets ? "Has Pets" : "No Pets"}</p>
                </div>

                <div className={"flex flex-row gap-2 sm:gap-3 items-center"}>
                    <GiStairsGoal className={"text-blue-500 flex-shrink-0"} size={16} />
                    <p className={"text-xs sm:text-sm"}>Prefers Level: {customer.preferred_helper_level !== null ? `${customer.preferred_helper_level}+` : "Any"}</p>
                </div>
            </div>
        </div>
    );
}

export default CustomerCard;