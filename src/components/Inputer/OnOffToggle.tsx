import { useState } from 'react';
import { FaToggleOff, FaToggleOn } from "react-icons/fa";

function OnOffToggle({ caption, value, handleValue }: { caption: string, value: boolean, handleValue: () => void }) {

    const [isOn, setIsOn] = useState(value);

    const toggleIcon = () => {
        setIsOn((prev) => !prev);
    };

    return (
        <div className={"flex flex-row gap-4 items-center"}>
            <button onClick={toggleIcon} className="text-3xl text-gray-300">
                {isOn ? <FaToggleOn className={'text-blue-600'} /> : <FaToggleOff />}
            </button>
            <p className={"text-md"}>{caption}</p>
        </div>

    );
}

export default OnOffToggle;