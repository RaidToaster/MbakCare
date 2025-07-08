import { FaToggleOff, FaToggleOn } from "react-icons/fa";

function OnOffToggle({ caption, value, handleValue }: { caption: string, value: boolean, handleValue: () => void }) {
    return (
        <div className={"flex flex-row gap-4 items-center"}>
            <button type="button" onClick={handleValue} className="text-3xl text-gray-300">
                {value ? <FaToggleOn className={'text-blue-600'} /> : <FaToggleOff />}
            </button>
            <p className={"text-md"}>{caption}</p>
        </div>
    );
}

export default OnOffToggle;