import TaskCard from "@/components/Card/TaskCard.tsx";
import NavigationBar from "@/components/InfoBar/NavigationBar.tsx";
import {Button} from "@/components/InfoComponent/button.tsx";
import {FaEdit} from "react-icons/fa";
import MainFooter from "@/components/InfoBar/MainFooter.tsx";

function TaskPage() {
    return (
        <div className={"min-w-full max-w-screen min-h-screen h-full cursor-default"}>
            <NavigationBar/>
            <div className={"flex flex-col w-full h-full px-8 md:px-64 py-8 pt-40 gap-8 text-[#492924]"}>
                <div className={"flex flex-col gap-8"}>
                    <div className={"w-full flex flex-row items-center justify-center relative"}>
                        <div className="flex flex-col items-center justify-center relative">
                            <h1 className={"font-bold text-3xl text-center"}>Main Tasks</h1>
                            <div className="w-24 h-1 bg-[#DA807B] mt-1 rounded-md"></div>
                        </div>
                        <Button
                            className={"bg-[#EE7C9E] p-6 text-white flex items-center justify-center absolute right-0"}>
                            <FaEdit size={32}/>
                            Edit Tasks
                        </Button>
                    </div>
                    <div className={"flex flex-col gap-1 w-full"}>
                        <TaskCard/>
                        <TaskCard/>
                    </div>
                </div>
                <div className={"flex flex-col gap-8"}>
                    <div className={"w-full flex flex-row items-center justify-center"}>
                        <div className="flex flex-col items-center justify-center relative">
                            <h1 className={"font-bold text-3xl text-center"}>Additional Tasks</h1>
                            <div className="w-24 h-1 bg-[#DA807B] mt-1 rounded-md"></div>
                        </div>
                    </div>
                    <div className={"flex flex-col gap-1 w-full"}>
                        <TaskCard/>
                        <TaskCard/>
                    </div>
                </div>
                <div className={"flex flex-col gap-4"}>
                    <h2>Today's Notes from Your Helper: </h2>
                    <div className={"bg-[#F7F8F1] border-[#996052] border-1 rounded-md p-4 min-w-full min-h-20"}>
                        <p className={"text-justify"}>No notes added</p>
                    </div>
                    <div className={"bg-[#FFF2F3] border-l-2 border-[#EE7C9E] px-8 py-4 rounded-sm"}>
                        <p className={"text-justify"}>
                            Information:<br/><br/>
                            This section contains daily notes written by your helper. It may include important updates such as any incidents that happened (e.g., broken items, things that need replacement), suggestions for additional tools or supplies, or other relevant information from today's work. Please review these notes regularly to stay informed and maintain smooth communication.
                        </p>
                    </div>
                </div>
            </div>
            <MainFooter/>
        </div>
    );
}

export default TaskPage;