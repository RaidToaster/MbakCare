import BoxInput from "@/components/Inputer/BoxInput.tsx";
import {Input} from "@/components/Inputer/Input.tsx";
import OnOffToggle from "@/components/Inputer/OnOffToggle.tsx";
import {Button} from "@/components/Inputer/Button.tsx";
import {useState} from "react";

function EditTaskCard({list, type = 1} : {list?:string[], type:number}) {

    const [isOpen, setIsOpen] = useState<boolean>(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // setForm({ ...form, [e.target.name]: e.target.value });
    };

    function toggleExpand(){
        setIsOpen(!isOpen)
    }

    const handleOnOffToggle = () => {

    }

    return (
        <div className={"bg-[#F7F8F1] p-8 rounded-md shadow-md flex flex-col gap-8 w-full"}>
            <div className={"flex flex-col gap-2 w-full items-start justify-center"}>
                <h3 className={"text-md font-semibold text-[#EE7C9E]"}>Task Title</h3>
                <div className={"flex flex-row gap-2.5 w-full items-center"}>
                    <Input value={'Kevin Pramudya'} onChange={handleChange} disabled={!isOpen}/>
                    {!isOpen && (
                        <Button size={'sm'} color={'white'} rounded={'med'} onClick={toggleExpand}>
                            Change
                        </Button>
                    )}
                </div>
            </div>
            {isOpen && (
                <>
                    {list && list.length > 0 && (
                        <BoxInput list={list}/>
                    )}
                    <div className={"flex flex-col gap-2 w-full items-start justify-center"}>
                        <h3 className={"text-md font-semibold text-[#EE7C9E]"}>Description</h3>
                        <textarea value={'Kevin Pramudya'} className={"bg-white border-2 focus:border-gray-700 focus:ring-[#EE7C9E] p-10 text-justify w-full px-4 py-1 rounded-lg "}
                                  placeholder={'Add more details about the task, instructions, or special notes here...'}/>
                    </div>
                    <OnOffToggle caption={'Require Photo Evidence'} value={false} handleValue={handleOnOffToggle}/>
                    {type == 2 && (
                        <OnOffToggle caption={'Set as Additional Task for Today'} value={false} handleValue={handleOnOffToggle}/>
                    )}

                    <div className={"flex flex-row gap-5 justify-end w-full"}>
                        <Button size={'lg'} color={'white'} rounded={'med'} onClick={toggleExpand}>
                            Cancel
                        </Button>
                        <Button size={'lg'} color={'pink'} rounded={'med'}>
                            Save
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}

export default EditTaskCard;