import SkillBox from "@/components/InfoComponent/SkillBox.tsx";
import {useState} from "react";

function ContractQuestionCard({question,multiple = true, list}:{question:string,multiple:boolean, list:string[]}) {

    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    function handleSelect(skill: string) {
        if (multiple) {
            setSelectedItems(prev =>
                prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
            );
        } else {
            setSelectedItems([skill]);
        }
    }

    return (
        <div className={"bg-[#FFF2F3] px-12 py-8 rounded-md shadow-md flex flex-col gap-4 cursor-default"}>
            <p>{question}</p>
            <div className={"grid grid-cols-5 gap-2"}>
                {list.map((item) => (
                    <SkillBox
                        item={item}
                        fixed={"f"}
                        variant={'white'}
                        option={'y'}
                        canSelected={true}
                        isSelected={selectedItems.includes(item)}
                        onSelect={handleSelect}/>
                ))}
            </div>
        </div>
    );
}

export default ContractQuestionCard;