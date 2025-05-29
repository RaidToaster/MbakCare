import BoxInput from "@/components/Inputer/BoxInput.tsx";

function ContractQuestionCard({question,multiple = true, list, onlyOne, multipleAns}:{question:string,multiple?:boolean, list:string[], onlyOne?:(arg0:string)=>void, multipleAns?:(arg0:string[])=>string[]}) {

    return (
        <div className={"bg-[#FFF2F3] px-12 py-8 rounded-md shadow-md flex flex-col gap-4 cursor-default"}>
            <p>{question}</p>
            <BoxInput list={list} onlyOne={onlyOne} multipleAns={multipleAns} multiple={multiple} />
        </div>
    );
}

export default ContractQuestionCard;