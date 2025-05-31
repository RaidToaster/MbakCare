import {useState} from 'react';
import SkillBox from "@/components/InfoComponent/SkillBox.tsx";

function BoxInput(
    {list, choosenItem = [], onlyOne, multipleAns,multiple = true, isFilter = false}:
        {list:string[],choosenItem?:string|string[], onlyOne?:(arg0:string)=>void, multipleAns?:(arg0:string[])=>string[],multiple?: boolean, isFilter?:boolean}
) {

    const [selectedItems, setSelectedItems] = useState<string[]>(choosenItem instanceof Array ? choosenItem : [choosenItem]);
    const [showAll, setShowAll] = useState(false);

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

    const shouldCollapse = isFilter && list.length > 5;
    const visibleItems = (shouldCollapse && !showAll) ? list.slice(0, 5) : list;

    return (
        <div className={`w-full`}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {visibleItems.map((item) => (
                    <SkillBox
                        key={item}
                        item={item}
                        variant="white"
                        option="y"
                        canSelected={true}
                        isSelected={selectedItems.includes(item)}
                        onSelect={handleSelect}
                    />
                ))}
            </div>

            {shouldCollapse && (
                <div className="mt-2 flex justify-center">
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="text-sm text-blue-600 hover:underline"
                    >
                        {showAll ? 'Show Less' : 'Show More'}
                    </button>
                </div>
            )}
        </div>
    );
}

export default BoxInput;