import NavigationBar from "@/components/InfoBar/NavigationBar.tsx";
import MainFooter from "@/components/InfoBar/MainFooter.tsx";
import icon from "@/assets/images/profile/Default.png";
import PhotoInputer from "@/components/Inputer/PhotoInputer.tsx";
import {useState} from "react";
import {Input} from "@/components/Inputer/Input.tsx";
import BoxInput from "@/components/Inputer/BoxInput.tsx";
import {Button} from "@/components/Inputer/Button.tsx";
import OnOffToggle from "@/components/Inputer/OnOffToggle.tsx";

function ProfilePage() {

    const [photoEvidence, setPhotoEvidence] = useState<File|null>(null)

    const [religion] = useState<string[]>(['Islam','Catholic', 'Christian', 'Hindu', 'Buddha', 'Konghucu']);
    const [languages] = useState<string[]>(['English','Indonesia', 'Russian', 'French', 'Spanish', 'Arabic', 'Mandarin']);
    const [defaultSkill] = useState<string[]>(["House Cleaning", "Cooking", "Laundry Care", "Pet Care", "Dishwashing"]);
    const [defaultJobTime] = useState<string[]>(["Full-Time", "Part-Time", "Temporary"]);
    const [defaultContractStatus] = useState<string[]>(["Finished Contract", "New Worker", "Terminated"]);
    const [defaultDayOff] = useState<string[]>(["Flexible", "Sunday Only", "Weekend", "Public Holidays"]);
    const [defaultFacility] = useState<string[]>(["Wi-Fi Access", "Free Meals", "Transport Fee", "Holiday Bonus", "Healthcare Support", "Weekend Off", "Job Supplies"]);
    const [defaultDuration] = useState<string[]>(["1 Year", "2 Years"]);
    const confirmChoices = ["Yes", "No"]


    function takePhoto(file: File) {
        setPhotoEvidence(file);
    }

    const handleOnOffToggle = () => {

    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // setForm({ ...form, [e.target.name]: e.target.value });
    };

    return (
        <div className={"min-h-screen min-w-full max-w-screen h-full"}>
            <NavigationBar/>
            <div className={"flex flex-col w-full h-full px-8 lg:px-64 py-8 pt-40 gap-8 text-[#492924]"}>
                <div className="flex flex-col items-center justify-center relative">
                    <h1 className={"font-bold text-4xl text-center"}>Your Profile</h1>
                    <div className="w-32 h-0.5 bg-[#DA807B] mt-2 rounded-md"></div>
                </div>
                <div className={"bg-[#F7F8F1] p-8 rounded-md shadow-md flex flex-col gap-8 w-full"}>
                    <div className={"flex flex-col gap-2 w-full items-center justify-center"}>
                        <h3 className={"text-xl font-semibold text-[#EE7C9E]"}>Profile Picture</h3>
                        <PhotoInputer onChange={takePhoto} defaultPhoto={icon} full={true}/>
                    </div>
                    <div className={"flex flex-col gap-2 w-full items-start justify-center"}>
                        <h3 className={"text-md font-semibold text-[#EE7C9E]"}>Full Name</h3>
                        <Input value={'Kevin Pramudya'} onChange={handleChange}/>
                    </div>

                    <div className={"flex flex-col gap-2 w-full items-start justify-center"}>
                        <h3 className={"text-md font-semibold text-[#EE7C9E]"}>Age</h3>
                        <Input value={20} onChange={handleChange}/>
                    </div>

                    <div className={"flex flex-col gap-2 w-full items-start justify-center"}>
                        <h3 className={"text-md font-semibold text-[#EE7C9E]"}>Marital Status</h3>
                        <Input value={'Kevin Pramudya'} onChange={handleChange}/>
                    </div>

                    <div className={"flex flex-col gap-2 w-full items-start justify-center"}>
                        <h3 className={"text-md font-semibold text-[#EE7C9E]"}>Number of Family Members</h3>
                        <Input value={5} onChange={handleChange}/>
                    </div>

                    <div className={"flex flex-col gap-2 w-full items-start justify-center"}>
                        <h3 className={"text-md font-semibold text-[#EE7C9E]"}>Religion</h3>
                        <BoxInput list={religion} multiple={false}/>
                    </div>

                    <div className={"flex flex-col gap-2 w-full items-start justify-center"}>
                        <h3 className={"text-md font-semibold text-[#EE7C9E]"}>Pet Ownership Status</h3>
                        <BoxInput list={confirmChoices} multiple={false}/>
                    </div>


                    <div className={"flex flex-col gap-2 w-full items-start justify-center"}>
                        <h3 className={"text-md font-semibold text-[#EE7C9E]"}>Helper's Job Site Address</h3>
                        <Input value={'Kevin Pramudya'} onChange={handleChange}/>
                    </div>

                    <div className={"flex flex-col gap-2 w-full items-start justify-center"}>
                        <h3 className={"text-md font-semibold text-[#EE7C9E]"}>Languages Spoken</h3>
                        <BoxInput list={languages}/>
                    </div>

                    <div className={"flex flex-col gap-2 w-full items-start justify-center"}>
                        <h3 className={"text-md font-semibold text-[#EE7C9E]"}>Main Duties</h3>
                        <BoxInput list={defaultSkill}/>
                    </div>

                    <div className={"flex flex-col gap-2 w-full items-start justify-center"}>
                        <h3 className={"text-md font-semibold text-[#EE7C9E]"}>Provided Facilities</h3>
                        <BoxInput list={defaultFacility}/>
                    </div>

                    <div className={"flex flex-col gap-2 w-full items-start justify-center"}>
                        <h3 className={"text-md font-semibold text-[#EE7C9E]"}>Accommodation Provided</h3>
                        <BoxInput list={confirmChoices} multiple={false}/>
                    </div>

                    <div className={"flex flex-col gap-2 w-full items-start justify-center"}>
                        <h3 className={"text-md font-semibold text-[#EE7C9E]"}>Required Helper Level</h3>
                        <Input value={5} onChange={handleChange}/>
                    </div>

                    <div className={"flex flex-col gap-2 w-full items-start justify-center"}>
                        <h3 className={"text-md font-semibold text-[#EE7C9E]"}>Job Type</h3>
                        <BoxInput list={defaultJobTime} multiple={false}/>
                    </div>

                    <div className={"flex flex-col gap-2 w-full items-start justify-center"}>
                        <h3 className={"text-md font-semibold text-[#EE7C9E]"}>Previous Helper Contract Status</h3>
                        <BoxInput list={defaultContractStatus} multiple={false}/>
                    </div>

                    <div className={"flex flex-col gap-2 w-full items-start justify-center"}>
                        <h3 className={"text-md font-semibold text-[#EE7C9E]"}>Contract Duration</h3>
                        <BoxInput list={defaultDuration} multiple={false}/>
                    </div>

                    <div className={"flex flex-col gap-2 w-full items-start justify-center"}>
                        <h3 className={"text-md font-semibold text-[#EE7C9E]"}>Day Off</h3>
                        <BoxInput list={defaultDayOff} multiple={false}/>
                    </div>

                    <div className={"flex flex-col gap-2 w-full items-start justify-center"}>
                        <h3 className={"text-md font-semibold text-[#EE7C9E]"}>Start Work Date</h3>
                        <Input value={5} onChange={handleChange} type="date"/>
                    </div>

                    <OnOffToggle caption={'Looking for Helper'} value={true} handleValue={handleOnOffToggle}/>

                    <div className={"bg-[#FFF2F3] border-l-2 border-[#EE7C9E] px-8 py-4 rounded-sm"}>
                        <p className={"text-justify"}>
                            Information:<br/><br/>
                            Enable this option if you are actively looking for a helper. When enabled, your request will
                            be visible to available helpers and included in job matching.
                        </p>
                    </div>

                    <div className={"flex flex-row gap-5 justify-end w-full"}>
                        <Button size={'lg'} color={'white'} rounded={'med'}>
                            Cancel
                        </Button>
                        <Button size={'lg'} color={'pink'} rounded={'med'}>
                            Save
                        </Button>
                    </div>
                </div>
            </div>
            <MainFooter/>
        </div>
    );
}

export default ProfilePage;