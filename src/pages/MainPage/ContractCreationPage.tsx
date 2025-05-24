import NavigationBar from "@/components/InfoBar/NavigationBar.tsx";
import MainFooter from "@/components/InfoBar/MainFooter.tsx";
import {TbArrowBackUp, TbContract} from "react-icons/tb";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import ContractQuestionCard from "@/components/Card/ContractQuestionCard.tsx";
import {Button} from "@/components/InfoComponent/button.tsx";

function ContractCreationPage() {

    const navigate = useNavigate();

    function backTrack (){
        navigate(-1)
    }

    const defaultSkill = ["House Cleaning", "Cooking", "Laundry Care", "Pet Care", "Dishwashing"]
    const defaultFacility = ["Wi-Fi Access", "Free Meals", "Transport Fee", "Holiday Bonus", "Healthcare Support", "Weekend Off", "Job Supplies"]

    const [value, setValue] = useState("0");

    const handleChange = (e: { target: { value: string; }; }) => {
        const onlyNums = e.target.value.replace(/[^0-9]/g, "");

        if (onlyNums.length <= 3) {
            setValue(onlyNums);
        }
    };

    return (
        <div className={"min-h-screen min-w-full max-w-screen h-full"}>
            <NavigationBar/>
            <div className={"flex flex-col w-full h-full px-8 md:px-64 py-8 pt-40 gap-8 text-[#492924]"}>
                <div className="flex flex-col items-center justify-center relative">
                    <TbArrowBackUp className={"absolute left-0"} size={40} onClick={backTrack}/>
                    <h1 className={"font-bold text-4xl text-center"}>Contract Questions</h1>
                    <div className="w-64 h-1 bg-[#DA807B] mt-1 rounded-md"></div>
                </div>
                <div className={"flex flex-col gap-4 w-full"}>
                    <div className={"bg-[#FFF2F3] px-12 py-8 rounded-md shadow-lg"}>
                        <p>How many tasks do you want to assign? (Only accept number)</p>
                        <input type={"text"} className={"border-[#492924] border-b-2 w-10 flex text-center focus-visible:ring-0 focus:outline-none"}
                               inputMode="numeric"
                               onChange={handleChange}
                               pattern="[0-9]*"
                               maxLength={3}
                               value={value}
                        />
                    </div>
                    <ContractQuestionCard question={"Select the main tasks you want to assign:"} list={defaultSkill}/>
                    <ContractQuestionCard question={"Are you willing to provide housing accommodation:"} list={["Yes", "No"]}/>
                    <ContractQuestionCard question={"Select the facility/facilities you want to provide:"} list={defaultFacility}/>
                    <ContractQuestionCard question={"Select contract duration:"} list={["1 Year", "2 Years"]}/>
                    <div className={"flex items-center justify-center"}>
                        <Button  onClick={backTrack} size={'xl'} className={"text-md"}>
                            <TbContract className={"size-8"}/>
                            Generate Contract
                        </Button>
                    </div>
                </div>
            </div>
            <MainFooter/>
        </div>
    );
}

export default ContractCreationPage;