import { MdLocationOn } from "react-icons/md";
import { GiSevenPointedStar } from "react-icons/gi";
import { FaCalendar, FaCircle } from "react-icons/fa";
import defaultProfileIcon from "@/assets/images/profile/Default.png";
import { useNavigate } from "react-router-dom";
import { HelperSearchResult } from "@/lib/services/SearchService";

interface HelperCardProps {
    helper: HelperSearchResult;
}

function HelperCard({ helper }: HelperCardProps) {
    const navigate = useNavigate();

    function getStatusColor(status: string | null): string {
        if (status === "Available") {
            return "green";
        } else if (status === "On Contract") {
            return "orange";
        } else if (status === "Unavailable") {
            return "gray";
        }
        return "red";
    }

    function showInformation() {
        navigate(`/helper-profile/${helper.id}`);
    }


    // const formatAvailableDate = (dateString: string | null | undefined) => {
    //     if (!dateString) return "Not specified";
    //     try {
    //         return new Date(dateString).toLocaleDateString('en-GB', {
    //             day: '2-digit', month: 'short', year: 'numeric'
    //         });
    //     } catch (e) {
    //         return "Invalid date";
    //     }
    // };


    const getJobTypeDisplay = (status: string | null): string => {
        if (status === "Available") return "Seeking Job";
        if (status === "On Contract") return "On Contract";
        return status || "N/A";
    };

    return (
        <div
            className={"flex flex-row bg-[#F7F8F1] gap-5 py-5 rounded-md shadow-sm cursor-pointer hover:shadow-lg transition-shadow"}
            onClick={showInformation}
        >
            <div className={"flex flex-col relative w-1/3 items-center gap-3 sm:gap-4"}>
                <div className={"w-full flex justify-center relative"}>
                    <img
                        src={helper.profile_picture || defaultProfileIcon}
                        className={"h-20 w-20 sm:h-24 sm:w-24 rounded-full border-2 border-[#492924] object-cover"}
                        alt={`${helper.name}'s profile`}
                    />
                    {helper.level !== null && (
                        <div className={"absolute -right-3 top-[-8px] sm:-right-5 sm:top-[-12px]"}>
                            <GiSevenPointedStar className={"absolute right-0 text-[#EE7C9E] w-9 h-9 sm:w-10 sm:h-10"} />
                            <p className={"absolute right-[16px] top-[9px] sm:right-[16px] sm:top-[9px] text-white text-xs sm:text-sm font-semibold"}>
                                {helper.level}
                            </p>
                        </div>
                    )}
                </div>

                <div className={`w-full py-1 ${helper.contract_status === "Available" ? "bg-green-500" : "bg-[#EE7C9E]"} rounded-br-2xl rounded-bl-2xl sm:rounded-br-3xl sm:rounded-bl-none flex justify-center text-center`}>
                    <p className={"text-white text-xs sm:text-sm font-medium px-2"}>{getJobTypeDisplay(helper.contract_status)}</p>
                </div>
            </div>


            <div className={"flex flex-col gap-1.5 sm:gap-2 justify-start text-[#492924] w-2/3 pr-2"}>
                <h2 className={"font-bold text-md sm:text-lg truncate"}>
                    {helper.name} {helper.age !== null ? `- ${helper.age} Yrs Old` : ''}
                </h2>

                <p className="text-xs sm:text-sm text-gray-600 truncate">
                    {helper.about_me ? (helper.about_me.substring(0, 30) + (helper.about_me.length > 30 ? "..." : "")) : "Helper"}
                </p>

                {helper.base_location_name && (
                    <div className={"flex flex-row gap-2 sm:gap-3 items-center"}>
                        <MdLocationOn className={"text-[#EE7C9E] flex-shrink-0"} size={16} />
                        <p className={"text-xs sm:text-sm truncate"}>{helper.base_location_name}</p>
                    </div>
                )}


                <div className={"flex flex-row gap-2 sm:gap-3 items-center"}>
                    <GiSevenPointedStar className={"text-[#EE7C9E] flex-shrink-0"} size={16} />
                    <p className={"text-xs sm:text-sm"}>
                        {helper.rating !== null ? `${helper.rating.toFixed(1)} Rating` : (helper.level !== null ? `Level ${helper.level}` : "Experience N/A")}
                    </p>
                </div>



                {helper.skills && helper.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                        {helper.skills.slice(0, 2).map(skill => (
                            <span key={skill} className="bg-pink-100 text-pink-600 text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full">
                                {skill}
                            </span>
                        ))}
                        {helper.skills.length > 2 && <span className="text-[10px] sm:text-xs text-gray-500">+{helper.skills.length - 2} more</span>}
                    </div>
                )}


                <div className={"flex flex-row gap-2 sm:gap-3 items-center mt-1"}>
                    <FaCircle color={getStatusColor(helper.contract_status)} size={10} />
                    <p className={"text-xs sm:text-sm font-medium"}>{helper.contract_status || "Status Unknown"}</p>
                </div>
            </div>
        </div>
    );
}

export default HelperCard;