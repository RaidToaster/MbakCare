import MainFooter from "@/components/InfoBar/MainFooter.tsx";
import {Button} from "@/components/Inputer/Button.tsx";
import {ArrowUpWideNarrow} from "lucide-react";
import {Input} from "@/components/Inputer/Input.tsx";
import {CiSearch} from "react-icons/ci";
import {FaFilter} from "react-icons/fa";
import HelperCard from "@/components/Card/HelperCard.tsx";
import NavigationBar from "@/components/InfoBar/NavigationBar.tsx";
import {motion} from "framer-motion";
import {IoClose} from "react-icons/io5";
import {useEffect, useState} from "react";
import BoxInput from "@/components/Inputer/BoxInput.tsx";

function SearchPage() {

    const [defaultLocation] = useState<string[]>(['United Kingdom','Indonesia', 'Russia', 'France', 'Spain', 'Saudi Arabia', 'China', 'Malaysia','Philippines']);
    const [defaultSkill] = useState<string[]>(["House Cleaning", "Cooking", "Laundry Care", "Pet Care", "Dishwashing"]);
    const [defaultJobTime] = useState<string[]>(["Full-Time", "Part-Time", "Temporary"]);
    const [defaultStarRating] = useState<string[]>(['5 Stars','4 Stars & Up', '3 Stars & Up','2 Stars & Up','1 Star & Up']);
    const [defaultAgeSection] = useState<string[]>(["18-30 Years", "31-45 Years", "46-60 Years"]);
    const [defaultLevelSelection] = useState<string[]>(["Level 1-5", "Level 6-10", "Level 11-20"]);
    const [defaultSalarySection] = useState<string[]>(["Rp2-4 Million", "Rp4-6 Million", "Rp6-10 Million"]);

    const [isOpen, setIsOpen] = useState(false);
    const isCustomer = false

    function togglePopup() {
        setIsOpen(!isOpen)
    }

    useEffect(() => {
        if(isOpen){
            document.body.classList.add("overflow-hidden");
            return () => {
                document.body.classList.remove("overflow-hidden");
            };
        }
    }, [isOpen]);

    return (
        <div className={"min-w-full max-w-screen h-screen cursor-default"}>
            <NavigationBar/>
            <div className={"flex flex-col w-full h-full px-8 lg:px-64 py-8 pt-40 gap-8 overflow-hidden relative"}>
                <div className={"flex flex-col gap-2 lg:gap-0 lg:flex-row justify-between"}>
                    <div className={"flex flex-col md:flex-row gap-2 md:gap-5"}>
                        <div
                            className={"flex flex-row relative justify-center items-center md:w-full bg-[#F7F8F1] rounded-md"}>
                            <Input color={'cream'} serial={'search'} placeholder={"Search with Helper Name"}/>
                            <CiSearch className={"absolute text-gray-500 right-5"}/>
                        </div>
                        <Button className={"flex flex-row gap-5"} onClick={togglePopup}>
                            <FaFilter/>
                            <p>Filter</p>
                        </Button>
                    </div>
                    <Button>
                        <ArrowUpWideNarrow/>
                        <p>Last Active</p>
                    </Button>
                </div>
                <div className={"overflow-y-scroll grid grid-cols-1 md:grid-cols-2 gap-5 scrollbar-hide"}>
                    {[...Array(10)].map((_, i) => (
                        <HelperCard key={i}/>
                    ))}
                </div>

                {isOpen && (
                    <div className={"absolute inset-0 left-0 top-0 w-full z-40 text-[#492924] overflow-hidden"} style={{
                        backgroundColor: "rgba(0, 0, 0, 0.3)",
                    }}>
                        <motion.div
                            initial={{x: "-100%", opacity: 0}}
                            animate={isOpen ? {x: 0, opacity: 1} : {x: "-100%", opacity: 0}}
                            transition={{type: "spring", stiffness: 120, damping: 20}}
                            className={`w-full lg:w-1/2 h-full flex flex-col justify-start bg-white`}>
                            <button className={`flex flex-row gap-4 p-6 items-center cursor-pointer text-white ${isCustomer ? 'bg-[#EE7C9E]' : 'bg-[#996052]'}`}
                                    onClick={togglePopup}>
                                <IoClose size={32}/>
                                Close Filter
                            </button>
                            <div className={'flex flex-col gap-6 px-6 py-4 overflow-y-auto'}>
                                <div className={"flex flex-col gap-2 w-1/2"}>
                                    <p>Start Work Date</p>
                                    <Input type={"date"} serial={'search'} color={'cream'}/>
                                </div>

                                <div className={"flex flex-col gap-2"}>
                                    <p>Job Type</p>
                                    <BoxInput list={defaultJobTime} isFilter={true}/>
                                </div>

                                <div className={"flex flex-col gap-2"}>
                                    <p>Main Skills</p>
                                    <BoxInput list={defaultSkill} isFilter={true}/>
                                </div>

                                <div className={"flex flex-col gap-2"}>
                                    <p>Personality</p>
                                    <BoxInput list={defaultSkill} isFilter={true}/>
                                </div>

                                <div className={"flex flex-col gap-2"}>
                                    <p>Location</p>
                                    <BoxInput list={defaultLocation} isFilter={true}/>
                                </div>

                                <div className={"flex flex-col gap-2"}>
                                    <p>Rating</p>
                                    <BoxInput list={defaultStarRating} isFilter={true}/>
                                </div>

                                <div className={"flex flex-col gap-2"}>
                                    <p>Age</p>
                                    <div className={'flex flex-row gap-2'}>
                                        <Input placeholder="Min" color={'cream'}/>
                                        <Input placeholder="Max" color={'cream'}/>
                                    </div>
                                    <BoxInput list={defaultAgeSection} isFilter={true}/>
                                </div>

                                <div className={"flex flex-col gap-2"}>
                                    <p>Working Experience</p>
                                    <div className={'flex flex-row gap-2'}>
                                        <Input placeholder="Min" color={'cream'}/>
                                        <Input placeholder="Max" color={'cream'}/>
                                    </div>
                                    <BoxInput list={defaultLevelSelection} isFilter={true}/>
                                </div>

                                <div className={"flex flex-col gap-2"}>
                                    <p>Salary Expectation</p>
                                    <div className={'flex flex-row gap-2'}>
                                        <Input placeholder="Min" color={'cream'}/>
                                        <Input placeholder="Max" color={'cream'}/>
                                    </div>
                                    <BoxInput list={defaultSalarySection} isFilter={true}/>
                                </div>
                                <div className={'flex flex-row items-center gap-5 justify-between border-t-2 border-gray-200 p-6'}>
                                    <Button className={'w-1/2'} color={'white'}>Reset</Button>
                                    <Button className={'w-1/2'}>Apply</Button>
                                </div>
                            </div>

                        </motion.div>
                    </div>
                )}
            </div>
            <MainFooter/>
        </div>
    );
}

export default SearchPage;