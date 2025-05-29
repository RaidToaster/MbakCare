import icon from "@/assets/images/profile/Default.png";
import {useNavigate} from "react-router-dom";

function InboxCard({sender, senderOrigin, title, description, time, isRead} :
                       {sender:string, senderOrigin:string,title:string, description:string, time:string, isRead:boolean}) {

    const navigate = useNavigate();

    function handleNavigate(){
        navigate('/inbox/detail');
    }

    return (
        <div className={`${isRead ? "bg-[#FFE5E7]" : "bg-[#F7F8F1]"} rounded-md shadow-md px-6 py-2 flex flex-row items-center justify-between`} onClick={handleNavigate}>
            <div className={"flex flex-row items-center gap-2"}>
                <img src={icon} alt={"Profile"}
                     className={"h-8 w-8 overflow-hidden rounded-full object-fit object-center border-2 border-[#492924]"}/>
                <div className={"flex flex-col justify-center gap-0.5 "}>
                    <p className={"text-sm font-semibold"}>{sender}</p>
                    <p className={"text-sm text-[#EE7C9E]"}>{senderOrigin}</p>
                </div>
            </div>
            <div className={"w-2/3 flex flex-row gap-1 items-center"}>
                <p className={"truncate whitespace-nowrap overflow-hidden text-ellipsis font-semibold w-full text-sm"}>{title}</p>
                <p>—</p>
                <p className={'truncate whitespace-nowrap overflow-hidden text-ellipsis text-sm'}>{description}</p>
            </div>
            <p>{time}</p>
        </div>
    );
}

export default InboxCard;