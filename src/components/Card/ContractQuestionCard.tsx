import SkillBox from "@/components/InfoComponent/SkillBox.tsx";

function ContractQuestionCard({question, list}:{question:string, list:string[]}) {
    return (
        <div className={"bg-[#FFF2F3] px-12 py-8 rounded-md shadow-lg flex flex-col gap-4 cursor-default"}>
            <p>{question}</p>
            <div className={"grid grid-cols-5 gap-2"}>
                {list.map((item) => (
                    <SkillBox skill={item} fixed={"f"} variant={'white'}/>
                ))}
            </div>
        </div>
    );
}

export default ContractQuestionCard;