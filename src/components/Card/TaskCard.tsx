import {useState} from "react";
import {LuBellRing} from "react-icons/lu";
import {MdKeyboardArrowDown, MdKeyboardArrowUp} from "react-icons/md";
import {Button} from "@/components/Inputer/Button.tsx";
import test from "@/assets/images/profile/test.jpg"
import {FaCheckCircle} from "react-icons/fa";

function TaskCard({title, description, pictures, isDone } : {title: string, description: string, pictures?: string[], isDone:boolean}) {

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
                    <h3>{title}</h3>
                </div>
                <div className={"flex flex-row gap-3 items-center"}>
                    {isDone ? (
                        <FaCheckCircle size={size} className={"text-[#EE7C9E]"}/>
                    ):(
                        <LuBellRing size={size} className={'hover:text-[#EE7C9E]'}/>
                    )}
                    {isOpen ? (
                        <MdKeyboardArrowUp onClick={toggleExpand} size={size}/>
                    ):(
                        <MdKeyboardArrowDown onClick={toggleExpand} size={size}/>
                    )}
                </div>
            </div>
            {isOpen && (
                <div className={"flex flex-col justify-center rounded-md shadow-md overflow-hidden w-full"}>
                    <div className={"w-full flex items-center bg-[#F3ABAC] px-8 py-4 border-b-2 border-[#492924]"}>
                        <h1 className={"text-md"}>Your task</h1>
                    </div>
                    <div className={"flex flex-col p-6 gap-20 bg-[#F7F8F1]"}>
                        <div className={"flex flex-col gap-5"}>
                            <div className={"flex flex-nowrap gap-5 overflow-x-auto p-5"}>

                                {/*delete this if already fetched*/}
                                {Array.from(Array(10).keys()).map((i) => (
                                    <img src={test} className={"w-64 h-48 flex-shrink-0 rounded-md object-cover"} alt="" key={i}/>
                                ))}

                                {pictures && pictures.length > 0 && pictures.map((i) => (
                                    <img src={i} className={"w-64 h-48 flex-shrink-0 rounded-md object-cover"} alt="" key={i}/>
                                ))}
                            </div>
                            <p>{description}</p>
                        </div>
                        {!isDone && (
                            <div className={"flex flex-row gap-5 justify-end w-full"}>
                                <Button size={'lg'} color={'white'} rounded={'med'}>
                                    Reject Task
                                </Button>
                                <Button size={'lg'} color={'pink'} rounded={'med'}>
                                    Mark as done
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default TaskCard;