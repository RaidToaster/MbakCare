import {MdLocationOn} from "react-icons/md";
import {GiSevenPointedStar} from "react-icons/gi";
import {FaCalendar, FaCircle} from "react-icons/fa";
import test from "@/assets/images/profile/test.jpg"
import {useNavigate} from "react-router-dom";

function HelperCard() {

    const navigate = useNavigate();

    function statusDisplay(status:string):string{
        if(status === "Active"){
            return "green"
        }else if(status === "Resigned"){
            return "yellow"
        }
        return "red"
    }

    function showInformation(){
        navigate("/helper-profile")
    }

    return (
        <div className={"flex flex-row bg-[#F7F8F1] gap-5 py-5 rounded-md shadow-sm cursor-default"} onClick={showInformation}>
            <div className={"flex flex-col relative w-1/3 gap-5"}>
                <div className={"w-full flex justify-center relative"}>
                    <img src={test} className={"h-24 w-24 rounded-full border-1 border-[#492924] object-cover"} alt={"Pictures"}/>
                    <div className={"right-15 top-3"}>
                        <GiSevenPointedStar className={"absolute right-10 -top-3 text-[#EE7C9E]"} size={40}/>
                        <p className={"absolute right-14 text-white -top-1"}>1</p>
                    </div>
                </div>
                <div className={"bg-[#EE7C9E] rounded-br-3xl flex justify-center"}>
                    <p className={"text-white"}>Full Time</p>
                </div>
            </div>


            <div className={"flex flex-col gap-2 justify-start text-[#492924]"}>
                <h2 className={"font-bold"}>Kevin Pramudya Mahardika - 20 Years Old</h2>
                <p>New Worker</p>
                <div className={"flex flex-row gap-5 items-center"}>
                    <MdLocationOn className={"text-[#EE7C9E]"}/>
                    <p className={"text-sm"}>Bekasi</p>
                </div>
                <div className={"flex flex-row gap-5 items-center"}>
                    <GiSevenPointedStar className={"text-[#EE7C9E]"}/>
                    <p className={"text-sm"}>0 Experience</p>
                </div>
                <div className={"flex flex-row gap-5 items-center"}>
                    <FaCalendar className={"text-[#EE7C9E]"}/>
                    <p className={"text-sm"}>From 01 March 2025</p>
                </div>
                <div className={"flex flex-row gap-5 items-center"}>
                    <FaCircle color={statusDisplay("")}/>
                    <p className={"text-sm"}>Inactive</p>
                </div>
            </div>
        </div>
    );
}

export default HelperCard;