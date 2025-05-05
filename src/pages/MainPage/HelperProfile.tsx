import CustomerReviewCard from "@/components/Card/CustomerReviewCard.tsx";
import NavigationBar from "@/components/InfoBar/NavigationBar.tsx";
import {PiIdentificationCardLight, PiNotebook} from "react-icons/pi";
import {IoLocationOutline} from "react-icons/io5";
import {RiGraduationCapLine} from "react-icons/ri";
import {LuCalendarCheck} from "react-icons/lu";
import {TbBadge, TbMoneybag} from "react-icons/tb";
import MainFooter from "@/components/InfoBar/MainFooter.tsx";


function HelperProfile() {

    const size = 32

    return (
        <div className="bg-white min-w-full max-w-screen h-full">
            <NavigationBar/>
            <div className="w-full flex flex-row justify-between px-8 md:px-32 py-8 pt-40 text-[#492924]">
                <div className={"flex flex-col gap-8"}>
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
                                <p>
                                    <b>Disclaimer:</b><br/>
                                    The level shown above reflects the helper's overall work experience and skill proficiency. It is not based on calendar years, but rather on actual tasks completed, responsibilities handled, and verified certifications. We use a points-based system where:<br/>
                                    &gt; Every completed task contributes to the helper's experience points (EXP).<br/>
                                    &gt; Certifications and formal training add extra EXP.<br/>
                                    &gt; Level 10 = Equivalent of 5 Years of Real-World Experience.<br/>
                                    The level shown above reflects the helper's overall work experience and skill proficiency. It is not based on calendar years, but rather on actual tasks completed, responsibilities handled, and verified certifications. We use a points-based system where:
                                </p>
                            </div>
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
                                    The stated salary is calculated based on the helper's experience level, accumulated task history, and verified training or certifications. It represents the minimum compensation that should be provided by the customer. The final salary may increase depending on the number and complexity of tasks assigned, as agreed upon in the work contract.
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