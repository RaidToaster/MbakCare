import {useState} from 'react';
import SkillBox from "@/components/InfoComponent/SkillBox.tsx";

function BoxInput(
    {list, choosenItem = [], onlyOne, multipleAns,multiple = true}:
        {list:string[],choosenItem?:string|string[], onlyOne?:(arg0:string)=>void, multipleAns?:(arg0:string[])=>string[],multiple?: boolean}
) {

    const [selectedItems, setSelectedItems] = useState<string[]>(choosenItem instanceof Array ? choosenItem : [choosenItem]);

    function handleSelect(skill: string) {
        if (multiple) {
            setSelectedItems(prev =>
                prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
            );
            if(multipleAns) multipleAns(selectedItems)

        } else {
            setSelectedItems([skill]);
            if(onlyOne) onlyOne(skill)
        }
    }

    return (
        <div className={`w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2`}>
            {list.map((item) => (
                <SkillBox
                    item={item}
                    variant={'white'}
                    option={'y'}
                    canSelected={true}
                    isSelected={selectedItems.includes(item)}
                    onSelect={handleSelect}/>
            ))}
        </div>
    );
}

export default BoxInput;