import CustomerReviewCard from "@/components/Card/CustomerReviewCard.tsx";
import NavigationBar from "@/components/InfoBar/NavigationBar.tsx";
import {PiIdentificationCardLight, PiNotebook} from "react-icons/pi";
import {IoLocationOutline} from "react-icons/io5";
import {RiGraduationCapLine} from "react-icons/ri";
import {LuCalendarCheck} from "react-icons/lu";
import {TbArrowBackUp, TbBadge, TbContract, TbMoneybag} from "react-icons/tb";
import MainFooter from "@/components/InfoBar/MainFooter.tsx";
import SkillBox from "@/components/InfoComponent/SkillBox.tsx";
import AchievementDesc from "@/components/InfoComponent/AchievementDesc.tsx";
import {useNavigate} from "react-router-dom";
import banner from "@/assets/images/profile/Profile Banner.png"
import test from "@/assets/images/profile/test.jpg"
import {AiFillStar} from "react-icons/ai";
import {Button} from "@/components/InfoComponent/Button.tsx";

function HelperProfile() {

    const listLanguage = ["Indonesia", "English", "Chinese"]
    const listSkill = ["Skill 1", "Skill 2", "Skill 3"]
    const listPersonality = ["Kind", "Caring", "Intimate"]
    const size = 32
    const maxRate = 5
    const defaultRate = 2.5

    const navigate = useNavigate();

    function backTrack (){
        navigate("/search")
    }

    function toMakeContract (){
        navigate('/contract/create')
    }

    function resultRate(rate:number): number{
        return rate/maxRate
    }

    return (
        <div className="bg-white min-h-screen min-w-full max-w-screen h-full cursor-default">
            <NavigationBar/>
            <div className="w-full flex flex-col md:flex-row justify-between px-8 md:px-32 py-8 pt-40 text-[#492924]">
                <div className={"flex flex-col gap-8"}>
                    <div className={"w-11/12 flex flex-col rounded-md shadow-md overflow-hidden bg-[#F7F8F1] relative"}>
                        <TbArrowBackUp className={"absolute left-5 top-5 text-white"} size={48} onClick={backTrack}/>
                        <img src={banner} alt={"User Profile"} className={"w-full h-[200px] object-cover object-top"}/>
                        <img src={test} alt={"User Profile"} className={"absolute w-40 h-40 object-cover rounded-full border-2 border-[#492924] top-1/2 left-14"}/>
                        <div className={"flex flex-row justify-between p-8 items-center"}>
                            <div className={"flex flex-col gap-2 pl-56"}>
                                <h1 className={"text-xl font-bold"}>Kevin Pramudya Mahardika - 24 Years Old</h1>
                                <div className={"flex flex-row gap-2"}>
                                    <div className="relative">
                                        <AiFillStar size={24} fill="#D9D9D9" color="#D9D9D9"/>
                                        <div
                                            className="absolute top-0 left-0 overflow-hidden"
                                            style={{width: `${resultRate(defaultRate) * 100}%`}}
                                        >
                                            <AiFillStar size={24} fill="#EFBB4B" color="#EFBB4B"/>
                                        </div>
                                    </div>
                                    <p className={"text-[#EFBB4B]"}>{defaultRate} | Rated by {0} client(s)</p>
                                </div>
                                <p>Married | No Kids | Kristen Protestan | From Bekasi</p>
                            </div>
                            <Button onClick={toMakeContract} size={'lg'}>
                                <TbContract className={"text-white size-6"}/>
                                Make Contract
                            </Button>
                        </div>
                    </div>

                    <div className={"w-11/12 flex flex-col justify-center rounded-md shadow-md overflow-hidden"}>
                        <div className={"w-full flex items-center bg-[#F3ABAC] px-8 py-4 border-b-2 border-[#492924]"}>
                            <h1 className={"text-xl"}>Professional Information</h1>
                        </div>
                        <div className={"flex flex-row items-center p-6 gap-20 bg-[#F7F8F1]"}>
                            <div className={"flex flex-col gap-4"}>
                                <div className={"flex flex-row items-center gap-4"}>
                                    <PiNotebook className={"text-[#EE7C9E]"} size={size}/>
                                    <div className={"flex flex-col justify-start"}>
                                        <h2 className={"text-[#EE7C9E]"}>Recent Contract Status:</h2>
                                        <h3>Resigned</h3>
                                    </div>
                                </div>

                                <div className={"flex flex-row items-center gap-4"}>
                                    <PiIdentificationCardLight className={"text-[#EE7C9E]"} size={size}/>
                                    <div className={"flex flex-col justify-start"}>
                                        <h2 className={"text-[#EE7C9E]"}>Job Type:</h2>
                                        <h3>Full Time</h3>
                                    </div>
                                </div>

                                <div className={"flex flex-row items-center gap-4"}>
                                    <RiGraduationCapLine className={"text-[#EE7C9E]"} size={size}/>
                                    <div className={"flex flex-col justify-start"}>
                                        <h2 className={"text-[#EE7C9E]"}>Highest Education Level:</h2>
                                        <h3>S1 (BINUS University)</h3>
                                    </div>
                                </div>
                            </div>
                            <div className={"flex flex-col gap-4"}>
                                <div className={"flex flex-row items-center gap-4"}>
                                    <IoLocationOutline className={"text-[#EE7C9E]"} size={size}/>
                                    <div className={"flex flex-col justify-start"}>
                                        <h2 className={"text-[#EE7C9E]"}>Present Location:</h2>
                                        <h3>Full Time</h3>
                                    </div>
                                </div>

                                <div className={"flex flex-row items-center gap-4"}>
                                    <LuCalendarCheck className={"text-[#EE7C9E]"} size={size}/>
                                    <div className={"flex flex-col justify-start"}>
                                        <h2 className={"text-[#EE7C9E]"}>Available From:</h2>
                                        <h3>22 April 2025</h3>
                                    </div>
                                </div>

                                <div className={"flex flex-row items-center gap-4"}>
                                    <PiNotebook className={"text-[#EE7C9E]"} size={size}/>
                                    <div className={"flex flex-col justify-start"}>
                                        <h2 className={"text-[#EE7C9E]"}>Day Off:</h2>
                                        <h3>Flexible</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={"w-11/12 flex flex-col justify-center rounded-md shadow-md overflow-hidden"}>
                        <div className={"w-full flex items-center bg-[#F3ABAC] px-8 py-4 border-b-2 border-[#492924]"}>
                            <h1 className={"text-xl"}>Level Information </h1>
                        </div>
                        <div className={"flex flex-col p-6 gap-8 bg-[#F7F8F1]"}>
                            <div className={"flex flex-row items-center gap-4"}>
                                <TbBadge className={"text-[#EE7C9E]"} size={size}/>
                                <div className={"flex flex-col justify-start"}>
                                    <h2 className={"text-[#EE7C9E] text-xl"}>Current Level:</h2>
                                    <h3 className={"text-xl"}>1</h3>
                                </div>
                            </div>
                            <div className={"bg-[#FFF2F3] border-l-2 border-[#EE7C9E] px-8 py-4 rounded-sm"}>
                                <p className={"text-justify"}>
                                    <b>Disclaimer:</b><br/>
                                    The level shown above reflects the helper's overall work experience and skill
                                    proficiency. It is not based on calendar years, but rather on actual tasks
                                    completed, responsibilities handled, and verified certifications. We use a
                                    points-based system where:<br/>
                                    &gt; Every completed task contributes to the helper's experience points (EXP).<br/>
                                    &gt; Certifications and formal training add extra EXP.<br/>
                                    &gt; Level 10 = Equivalent of 5 Years of Real-World Experience.<br/>
                                    The level shown above reflects the helper's overall work experience and skill
                                    proficiency. It is not based on calendar years, but rather on actual tasks
                                    completed, responsibilities handled, and verified certifications. We use a
                                    points-based system where:
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className={"w-11/12 flex flex-col justify-center rounded-md shadow-md overflow-hidden"}>
                        <div className={"w-full flex items-center bg-[#F3ABAC] px-8 py-4 border-b-2 border-[#492924]"}>
                            <h1 className={"text-xl"}>Skill & Character </h1>
                        </div>
                        <div className={"flex flex-col p-6 gap-4 bg-[#F7F8F1]"}>
                            <div className={"flex flex-col gap-2"}>
                                <h2 className={"text-[#EE7C9E] text-xl"}>Language:</h2>
                                <div className={"flex flex-row gap-2"}>
                                    {listLanguage ? (
                                        listLanguage.map((item) => {
                                            return (
                                                <SkillBox item={item}/>
                                            )
                                        })
                                    ) : (
                                        <p className={"text-black"}>None</p>
                                    )}
                                </div>
                            </div>
                            <div className={"flex flex-col gap-2"}>
                                <h2 className={"text-[#EE7C9E] text-xl"}>Main Skills:</h2>
                                <div className={"flex flex-row gap-2"}>
                                    {listSkill ? (
                                        listSkill.map((item) => {
                                            return (
                                                <SkillBox item={item}/>
                                            )
                                        })
                                    ) : (
                                        <p className={"text-black"}>None</p>
                                    )}
                                </div>
                            </div>
                            <div className={"flex flex-col gap-2"}>
                                <h2 className={"text-[#EE7C9E] text-xl"}>Personality:</h2>
                                <div className={"flex flex-row gap-2"}>
                                    {listPersonality ? (
                                        listPersonality.map((item) => {
                                            return (
                                                <SkillBox item={item}/>
                                            )
                                        })
                                    ) : (
                                        <p className={"text-black"}>None</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={"w-11/12 flex flex-col justify-center rounded-md shadow-md overflow-hidden"}>
                        <div className={"w-full flex items-center bg-[#F3ABAC] px-8 py-4 border-b-2 border-[#492924]"}>
                            <h1 className={"text-xl"}>About Me </h1>
                        </div>
                        <div className={"flex flex-col p-6 gap-8 bg-[#F7F8F1]"}>
                            <p className={"text-[#492924]"}>
                                Hello! I'm Kevin Pramudya Mahardika, a dedicated and reliable home helper committed
                                to making your daily life more comfortable and organized. With a strong work ethic
                                and attention to detail, I specialize in:<br/>
                                Housekeeping: Ensuring your living spaces are clean and well-maintained.<br/>
                                Cooking: Preparing nutritious and delicious meals tailored to your preferences.<br/>
                                Childcare: Providing attentive and caring support for your children.<br/>
                                Errands: Assisting with shopping, appointments, and other daily tasks.<br/>
                                I take pride in my punctuality, trustworthiness, and the positive relationships I
                                build with the families I assist. My goal is to provide a helping hand that brings
                                peace of mind to your household.
                            </p>
                        </div>
                    </div>

                    <div className={"w-11/12 flex flex-col justify-center rounded-md shadow-md overflow-hidden"}>
                        <div className={"w-full flex items-center bg-[#F3ABAC] px-8 py-4 border-b-2 border-[#492924]"}>
                            <h1 className={"text-xl"}>Work Experience </h1>
                        </div>
                        <div className={"flex flex-col p-6 gap-8 bg-[#F7F8F1]"}>

                        </div>
                    </div>

                    <div className={"w-11/12 flex flex-col justify-center rounded-md shadow-md overflow-hidden"}>
                        <div className={"w-full flex items-center bg-[#F3ABAC] px-8 py-4 border-b-2 border-[#492924]"}>
                            <h1 className={"text-xl"}>Achievements </h1>
                        </div>
                        <div className={"flex flex-col p-6 gap-8 bg-[#F7F8F1]"}>
                            <AchievementDesc/>
                        </div>
                    </div>

                    <div className={"w-11/12 flex flex-col justify-center rounded-md shadow-md overflow-hidden"}>
                        <div className={"w-full flex items-center bg-[#F3ABAC] px-8 py-4 border-b-2 border-[#492924]"}>
                            <h1 className={"text-xl"}>Salary Expectation </h1>
                        </div>
                        <div className={"flex flex-col p-6 gap-8 bg-[#F7F8F1]"}>
                            <div className={"flex flex-row items-center gap-4"}>
                                <TbMoneybag className={"text-[#EE7C9E]"} size={size}/>
                                <div className={"flex flex-col justify-start"}>
                                    <h2 className={"text-[#EE7C9E] text-xl"}>Salary:</h2>
                                    <h3 className={"text-xl"}>Rp.5.000.000,00</h3>
                                </div>
                            </div>
                            <div className={"bg-[#FFF2F3] border-l-2 border-[#EE7C9E] px-8 py-4 rounded-sm"}>
                                <p>
                                    <b>Disclaimer:</b><br/>
                                    The stated salary is calculated based on the helper's experience level, accumulated
                                    task history, and verified training or certifications. It represents the minimum
                                    compensation that should be provided by the customer. The final salary may increase
                                    depending on the number and complexity of tasks assigned, as agreed upon in the work
                                    contract.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={"flex flex-col gap-5"}>
                    <div className={"bg-[#DA807B] rounded-md px-10 py-4 flex justify-center"}>
                        <h1 className={"text-white text-xl"}>Customer Review</h1>
                    </div>
                    <CustomerReviewCard/>
                </div>
            </div>
            <MainFooter/>
        </div>
    );
}

export default HelperProfile;