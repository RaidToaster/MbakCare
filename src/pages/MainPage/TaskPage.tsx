import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "@/components/InfoBar/NavigationBar.tsx";
import MainFooter from "@/components/InfoBar/MainFooter.tsx";
import TaskCard from "@/components/Card/TaskCard.tsx";
import { Button } from "@/components/Inputer/Button.tsx";
import { FaPlus } from "react-icons/fa";
import { useAuthCt } from "@/lib/auth-context.tsx";
import { useToast } from "@/components/InfoComponent/Toast.tsx";
import { ContractService, ContractDetails } from "@/lib/services/ContractService.ts";
import { DailyTask, TaskService, TaskCreationData } from "@/lib/services/TaskService.ts";

function TaskPage() {
    const { user, userRole } = useAuthCt();
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [activeContract, setActiveContract] = useState<ContractDetails | null>(null);
    const [tasks, setTasks] = useState<DailyTask[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchTaskData = async () => {
        if (!user || !userRole) {
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        if (userRole === 'customer' || userRole === 'helper') {
            const contract = await ContractService.getActiveContractForUser(user.id, userRole);
            setActiveContract(contract);

            if (contract) {
                const today = new Date().toISOString().split('T')[0];
                const fetchedTasks = await TaskService.getDailyTasksForContract(contract.id, today);
                setTasks(fetchedTasks);
            }
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchTaskData();
    }, [user, userRole]);

    const handleTaskUpdate = () => {
        fetchTaskData(); // Refetch all data to ensure consistency
    };

    const openCreateTaskModal = () => {
        if (userRole === 'customer') {
            setIsModalOpen(true);
        } else {
            addToast("Only customers can create tasks.", 'error');
        }
    };

    const renderContent = () => {
        if (isLoading) {
            return <div className="text-center">Loading tasks...</div>;
        }
        if (!user) {
            return <div className="text-center text-2xl">You are not logged in.</div>;
        }
        if (!activeContract) {
            return <div className="text-center p-8 bg-yellow-100 rounded-md">You do not have an active contract. Tasks can only be managed within an active contract.</div>;
        }
        if (tasks.length === 0) {
            return <div className="text-center p-8 bg-blue-100 rounded-md">No tasks scheduled for today.</div>;
        }

        const mainTasks = tasks.filter(t => activeContract.tasks.some(ct => ct.skill_id === t.skill_id && ct.task_type === 'Main'));
        const additionalTasks = tasks.filter(t => !mainTasks.includes(t));


        return (
            <>
                <div className={"flex flex-col gap-4"}>
                    <h2 className="font-bold text-2xl text-center">Main Tasks</h2>
                    {mainTasks.length > 0 ? mainTasks.map(task => (
                        <TaskCard key={task.id} task={task} role={userRole as 'customer' | 'helper'} onUpdate={handleTaskUpdate} />
                    )) : <p className="text-center text-gray-500">No main tasks for today.</p>}
                </div>
                <div className={"flex flex-col gap-4"}>
                    <h2 className="font-bold text-2xl text-center">Additional Tasks</h2>
                    {additionalTasks.length > 0 ? additionalTasks.map(task => (
                        <TaskCard key={task.id} task={task} role={userRole as 'customer' | 'helper'} onUpdate={handleTaskUpdate} />
                    )) : <p className="text-center text-gray-500">No additional tasks for today.</p>}
                </div>
            </>
        );
    };

    return (
        <div className={"min-w-full max-w-screen min-h-screen h-full cursor-default flex flex-col"}>
            <NavigationBar />
            <div className={"flex flex-col w-full flex-grow px-8 lg:px-64 py-8 pt-40 gap-8 text-[#492924]"}>
                <div className={"w-full flex flex-row items-center justify-center relative"}>
                    <div className="flex flex-col items-center justify-center">
                        <h1 className={"font-bold text-3xl text-center"}>Daily To-Do List</h1>
                        <div className="w-24 h-1 bg-[#DA807B] mt-1 rounded-md"></div>
                        <p className="mt-2 text-gray-600">{new Date().toDateString()}</p>
                    </div>
                    {userRole === 'customer' && activeContract && (
                        <Button
                            className={"bg-[#EE7C9E] p-4 text-white flex items-center justify-center absolute right-0"}
                            onClick={openCreateTaskModal}
                        >
                            <FaPlus size={24} />
                            <span className="ml-2">New Task</span>
                        </Button>
                    )}
                </div>
                {renderContent()}
            </div>
            <MainFooter />
            {isModalOpen && <CreateTaskModal contract={activeContract!} onClose={() => setIsModalOpen(false)} onTaskCreated={handleTaskUpdate} />}
        </div>
    );
}

interface CreateTaskModalProps {
    contract: ContractDetails;
    onClose: () => void;
    onTaskCreated: () => void;
}

function CreateTaskModal({ contract, onClose, onTaskCreated }: CreateTaskModalProps) {
    console.log("Contract data in modal:", contract);
    const [description, setDescription] = useState('');
    const [skillId, setSkillId] = useState('');
    const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
    const [dueDate, setDueDate] = useState('');
    const [requirePhoto, setRequirePhoto] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { addToast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!skillId || !description) {
            addToast("Please select a skill and provide a description.", 'error');
            return;
        }
        setIsSubmitting(true);

        const taskData: TaskCreationData = {
            contract_id: contract.id,
            skill_id: skillId,
            description,
            priority,
            require_photo: requirePhoto,
            due_date: dueDate || undefined,
        };

        console.log("Submitting task data:", taskData);
        const { error } = await TaskService.createDailyTask(taskData);
        if (error) {
            addToast(`Failed to create task: ${error.message}`, 'error');
        } else {
            addToast("Task created successfully!", 'success');
            onTaskCreated();
            onClose();
        }
        setIsSubmitting(false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-4">Create New Task</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label htmlFor="skill" className="block text-sm font-medium text-gray-700">Task Type (Skill)</label>
                        <select id="skill" value={skillId} onChange={e => setSkillId(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                            <option value="" disabled>Select a skill</option>
                            {contract.tasks.map(task => (
                                <option key={task.skill_id} value={task.skill_id}>{task.skill_name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" required />
                    </div>
                    <div>
                        <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority</label>
                        <select id="priority" value={priority} onChange={e => setPriority(e.target.value as any)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="due-date" className="block text-sm font-medium text-gray-700">Due Date (Optional)</label>
                        <input type="datetime-local" id="due-date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                    </div>
                    <div className="flex items-center">
                        <input type="checkbox" id="require-photo" checked={requirePhoto} onChange={e => setRequirePhoto(e.target.checked)} className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                        <label htmlFor="require-photo" className="ml-2 block text-sm text-gray-900">Require Photo Evidence</label>
                    </div>
                    <div className="flex justify-end gap-4 mt-4">
                        <Button type="button" onClick={onClose} color="white" disabled={isSubmitting}>Cancel</Button>
                        <Button type="submit" color="pink" disabled={isSubmitting}>
                            {isSubmitting ? 'Creating...' : 'Create Task'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TaskPage;