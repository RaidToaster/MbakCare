import {useState} from "react";
import {LuBellRing} from "react-icons/lu";
import {MdKeyboardArrowDown, MdKeyboardArrowUp} from "react-icons/md";
import {Button} from "@/components/InfoComponent/Button.tsx";


function TaskCard() {

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const size = 32

    function toggleExpand(){
        setIsOpen(!isOpen)
    }
    return (
        <div className={"flex flex-col gap-0.5"}>
            <div className={"flex flex-row justify-between bg-[#FFF2F3] rounded-md p-6 items-center text-[#492924]"}>
                <div className={"flex flex-row gap-5"}>
                    <h3 className={"text-[#EE7C9E]"}>Task Title: </h3>
                    <h3>Babysitting</h3>
                </div>
                <div className={"flex flex-row gap-3 items-center"}>
                    <LuBellRing />
                    {isOpen ? (
                        <MdKeyboardArrowUp onClick={toggleExpand} size={size}/>
                    ):(
                        <MdKeyboardArrowDown onClick={toggleExpand} size={size}/>
                    )}
                </div>
            </div>
            {isOpen && (
                <div className={"flex flex-col justify-center rounded-md shadow-md overflow-hidden"}>
                    <div className={"w-full flex items-center bg-[#F3ABAC] px-8 py-4 border-b-2 border-[#492924]"}>
                        <h1 className={"text-md"}>Your task</h1>
                    </div>
                    <div className={"flex flex-row items-center p-6 gap-20 bg-[#F7F8F1]"}>
                        <div className={"flex flex-row gap-5"}>

                        </div>
                        <div className={"flex flex-row gap-5 justify-end"}>
                            <Button size={'lg'} color={'white'} rounded={'med'} >
                                Reject Task
                            </Button>
                            <Button size={'lg'} color={'pink'} rounded={'med'} >
                                Mark as done
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TaskCard;