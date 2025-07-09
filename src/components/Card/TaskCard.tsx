import { useState } from "react";
import { LuBellRing } from "react-icons/lu";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { Button } from "@/components/Inputer/Button.tsx";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { DailyTask, TaskService } from "@/lib/services/TaskService.ts";

type UserRole = 'customer' | 'helper';

interface TaskCardProps {
    task: DailyTask;
    role: UserRole;
    onUpdate: () => void;
}

function TaskCard({ task, role, onUpdate }: TaskCardProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const size = 32;

    function toggleExpand() {
        setIsOpen(!isOpen);
    }

    const handleStatusUpdate = async (status: 'Completed' | 'Rejected') => {
        setIsUpdating(true);
        const { error } = await TaskService.updateTaskStatus(task.id, status);

        if (error) {
            alert(`Failed to update task: ${error.message}`);
        } else {
            alert(`Task marked as ${status}.`);
            onUpdate();
            setIsOpen(false);
        }
        setIsUpdating(false);
    };

    const getPriorityClass = (priority: 'High' | 'Medium' | 'Low') => {
        switch (priority) {
            case 'High': return 'border-l-4 border-red-500';
            case 'Medium': return 'border-l-4 border-yellow-500';
            case 'Low': return 'border-l-4 border-green-500';
            default: return '';
        }
    };

    return (
        <div className={`flex flex-col gap-0.5 ${getPriorityClass(task.priority)}`}>
            <div className={"flex flex-row justify-between bg-[#FFF2F3] rounded-md p-6 items-center text-[#492924]"}>
                <div className={"flex flex-row gap-5 items-center"}>
                    <h3 className={"text-[#EE7C9E]"}>Task:</h3>
                    <h3 className="font-semibold">{task.skill_name || 'General Task'}</h3>
                    <p className="text-sm text-gray-600 truncate ">{task.description}</p>
                </div>
                <div className={"flex flex-row gap-3 items-center"}>
                    {task.status === 'Completed' ? (
                        <FaCheckCircle size={size} className={"text-green-500"} />
                    ) : task.status === 'Rejected' ? (
                        <FaTimesCircle size={size} className={"text-red-500"} />
                    ) : (
                        <LuBellRing size={size} className={'hover:text-[#EE7C9E]'} />
                    )}
                    {isOpen ? (
                        <MdKeyboardArrowUp onClick={toggleExpand} size={size} className="cursor-pointer" />
                    ) : (
                        <MdKeyboardArrowDown onClick={toggleExpand} size={size} className="cursor-pointer" />
                    )}
                </div>
            </div>
            {isOpen && (
                <div className={"flex flex-col justify-center rounded-md shadow-md overflow-hidden w-full"}>
                    <div className={"w-full flex items-center justify-between bg-[#F3ABAC] px-8 py-4 border-b-2 border-[#492924]"}>
                        <h1 className={"text-md font-bold"}>Task Details</h1>
                        {task.due_date && <span className="text-sm">Due: {new Date(task.due_date).toLocaleString()}</span>}
                    </div>
                    <div className={"flex flex-col p-6 gap-6 bg-[#F7F8F1]"}>
                        <p><span className="font-semibold">Description:</span> {task.description}</p>
                        
                        {task.photo_url && (
                             <div className="flex flex-col gap-2">
                                <h4 className="font-semibold">Evidence Photo:</h4>
                                <img src={task.photo_url} className={"w-full max-w-md h-auto rounded-md object-cover"} alt="Task Evidence" />
                            </div>
                        )}

                        {role === 'helper' && task.status === 'Pending' && (
                            <div className={"flex flex-row gap-5 justify-end w-full"}>
                                <Button size={'lg'} color={'white'} rounded={'med'} onClick={() => handleStatusUpdate('Rejected')} disabled={isUpdating}>
                                    {isUpdating ? 'Rejecting...' : 'Reject Task'}
                                </Button>
                                <Button size={'lg'} color={'pink'} rounded={'med'} onClick={() => handleStatusUpdate('Completed')} disabled={isUpdating}>
                                    {isUpdating ? 'Saving...' : 'Mark as Done'}
                                </Button>
                            </div>
                        )}
                         {role === 'customer' && task.status !== 'Pending' && (
                             <div className="flex flex-col gap-2">
                                <h4 className="font-semibold">Helper's Notes:</h4>
                                <p>{task.notes || "No notes provided."}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default TaskCard;