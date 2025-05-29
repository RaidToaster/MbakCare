import {useState} from "react";
import NavigationBar from "@/components/InfoBar/NavigationBar.tsx";
import MainFooter from "@/components/InfoBar/MainFooter.tsx";
import EditTaskCard from "@/components/Card/EditTaskCard.tsx";
import {TbArrowBackUp} from "react-icons/tb";
import {useNavigate} from "react-router-dom";

function EditTaskPage() {
    const [defaultTask] = useState<string[]>(["House Cleaning", "Cooking", "Laundry Care", "Pet Care", "Dishwashing"]);
    const [additionalTask] = useState<string[]>(defaultTask)
    const navigate = useNavigate();

    function backTrack (){
        navigate('/task/view');
    }

    return (
        <div className={"min-w-full max-w-screen min-h-screen h-full cursor-default"}>
            <NavigationBar/>
            <div className={"flex flex-col w-full h-full px-8 lg:px-64 py-8 pt-40 gap-8 text-[#492924]"}>
                <div className={"flex flex-col gap-8"}>
                    <div className="flex flex-col items-center justify-center relative">
                        <h1 className={"font-bold text-3xl text-center"}>Edit Main Tasks</h1>
                        <div className="w-24 h-1 bg-[#DA807B] mt-1 rounded-md"></div>
                        <TbArrowBackUp className={"cursor-pointer absolute left-0 hidden lg:block "} size={40} onClick={backTrack}/>
                    </div>
                    <div className={"flex flex-col gap-1 w-full"}>
                        {defaultTask && defaultTask.length > 0 && defaultTask.map((item) => (
                            <EditTaskCard list={defaultTask} type={1}/>
                        ))}
                    </div>

                </div>
                <div className={"flex flex-col gap-8"}>
                    <div className={"w-full flex flex-row items-center justify-center"}>
                        <div className="flex flex-col items-center justify-center relative">
                            <h1 className={"font-bold text-3xl text-center"}>Edit Additional Tasks</h1>
                            <div className="w-48 h-1 bg-[#DA807B] mt-1 rounded-md"></div>
                        </div>
                    </div>
                    <div className={"flex flex-col gap-1 w-full"}>
                        {additionalTask && additionalTask.length > 0 && additionalTask.map((item) => (
                            <EditTaskCard list={additionalTask} type={2}/>
                        ))}
                    </div>
                </div>
            </div>
            <MainFooter/>
        </div>
    );
}

export default EditTaskPage;