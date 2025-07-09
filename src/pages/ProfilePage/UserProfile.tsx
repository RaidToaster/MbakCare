import CustomerReviewCard from "@/components/Card/CustomerReviewCard.tsx";
import NavigationBar from "@/components/InfoBar/NavigationBar.tsx";
import { PiIdentificationCardLight, PiNotebook } from "react-icons/pi";
import { IoLocationOutline, IoTimeOutline } from "react-icons/io5";
import { RiGraduationCapLine } from "react-icons/ri";
import { LuCalendarCheck, LuCoffee, LuNotebookText } from "react-icons/lu";
import { TbArrowBackUp, TbBadge, TbContract, TbMoneybag } from "react-icons/tb";
import MainFooter from "@/components/InfoBar/MainFooter.tsx";
import SkillBox from "@/components/InfoComponent/SkillBox.tsx";
import AchievementDesc from "@/components/InfoComponent/AchievementDesc.tsx";
import { useNavigate, useParams } from "react-router-dom";
import banner from "@/assets/images/profile/Profile Banner.png";
import defaultUserImage from "@/assets/images/profile/Default.png";
import { AiFillStar } from "react-icons/ai";
import { Button } from "@/components/Inputer/Button.tsx";
import { FaDotCircle } from "react-icons/fa";
import { FaBed } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { ProfileService, HelperProfileData } from "@/lib/services/ProfileService";
import { supabase } from "@/lib/supabase";
import LevelDisplay from "@/components/InfoComponent/LevelDisplay.tsx";

type UserRole = 'customer' | 'helper' | 'admin';

function UserProfile() {
    const { id: profileIdFromParams } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [profileData, setProfileData] = useState<HelperProfileData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [loggedInUserRole, setLoggedInUserRole] = useState<UserRole | null>(null);
    const [isViewingOwnProfile, setIsViewingOwnProfile] = useState(false);
    const [levelThresholds, setLevelThresholds] = useState<{ level: number, xp_required: number }[]>([]);

    const dummyLanguages = ["Indonesia", "English", "Chinese"];
    const dummyPersonality = ["Kind", "Caring", "Intimate"];
    const dummyWorkHistory = [
        { period: "Aug 2023 - Sep 2024", family: "Family in Sleman", duties: ["Childcare", "Cooking", "Cleaning"] }
    ];
    const dummyAchievementsData = [
        { title: "Best Helper Award 2024", date: "Dec 2024", description: "Recognized for exceptional service and dedication to client families." }
    ];
    const dummyOnJobMomentsImages = Array(6).fill(defaultUserImage);
    const [isHelper, setIsHelper] = useState(false);


    useEffect(() => {
        const fetchProfileAndCurrentUser = async () => {
            if (!profileIdFromParams) {
                setError("Profile ID is missing from URL.");
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            setError(null);

            try {
                const [fetchedProfileData, { data: { user: currentAuthUser } }, thresholds] = await Promise.all([
                    ProfileService.getHelperProfileById(profileIdFromParams),
                    supabase.auth.getUser(),
                    ProfileService.getLevelThresholds()
                ]);

                setProfileData(fetchedProfileData);
                setLevelThresholds(thresholds);
                setIsHelper(fetchedProfileData?.role === 'helper');

                if (currentAuthUser) {
                    setIsViewingOwnProfile(currentAuthUser.id === profileIdFromParams);
                    const { data: currentUserData, error: currentUserError } = await supabase
                        .from('users')
                        .select('role')
                        .eq('id', currentAuthUser.id)
                        .single();
                    if (currentUserError && currentUserError.code !== 'PGRST116') {
                        console.error("Error fetching current user role:", currentUserError);
                    }
                    setLoggedInUserRole(currentUserData?.role as UserRole || null);
                }

                if (!fetchedProfileData) {
                    setError("Helper profile not found.");
                }

            } catch (err: any) {
                setError(err.message || "Failed to fetch profile data.");
                setProfileData(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileAndCurrentUser();
    }, [profileIdFromParams]);

    function backTrack() {
        navigate(-1);
    }

    function toMakeContract() {
        if (profileData) {
            navigate(`/contract/create?helperId=${profileData.id}`);
        }
    }

    function resultRate(rate: number | null | undefined): number {
        const maxRate = 5;
        if (rate === null || rate === undefined) return 0;
        const calculatedRate = rate / maxRate;
        return Math.max(0, Math.min(calculatedRate, 1));
    }

    const isProfileOfTypeHelper = profileData?.role === 'helper';

    if (isLoading) {
        return (
            <div className="bg-white min-h-screen min-w-full max-w-screen h-full cursor-default">
                <NavigationBar />
                <div className="w-full flex-1 flex justify-center items-center py-8 pt-40 text-[#492924]">Loading profile...</div>
                <MainFooter />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white min-h-screen min-w-full max-w-screen h-full cursor-default">
                <NavigationBar />
                <div className="w-full flex flex-col justify-center items-center py-8 pt-40 text-red-600">
                    <p>Error: {error}</p>
                    <Button onClick={backTrack} className="mt-4">Go Back</Button>
                </div>
                <MainFooter />
            </div>
        );
    }

    if (!profileData) {
        return (
            <div className="bg-white min-h-screen min-w-full max-w-screen h-full cursor-default">
                <NavigationBar />
                <div className="w-full flex flex-col justify-center items-center py-8 pt-40 text-[#492924]">
                    <p>Profile not found.</p>
                    <Button onClick={backTrack} className="mt-4">Go Back</Button>
                </div>
                <MainFooter />
            </div>
        );
    }

    const size = 32;

    return (
        <div className="bg-white min-h-screen min-w-full max-w-screen h-full cursor-default">
            <NavigationBar />
            <div className="w-full flex flex-col gap-8 lg:gap-8 lg:flex-row justify-center lg:justify-between px-4 sm:px-8 lg:px-16 xl:px-32 py-8 pt-28 sm:pt-32 md:pt-40 text-[#492924]">
                <div className={"flex flex-col gap-8 items-center w-full lg:w-2/3 xl:w-3/4"}>
                    <div className={"w-full flex flex-col rounded-md shadow-md overflow-hidden bg-[#F7F8F1] relative"}>
                        <TbArrowBackUp className={"cursor-pointer absolute left-3 top-3 sm:left-5 sm:top-5 text-white z-10"} size={window.innerWidth < 640 ? 32 : 40} onClick={backTrack} />
                        <img src={banner} alt={"User Profile Banner"} className={"w-full h-[150px] sm:h-[200px] object-cover object-top"} />
                        <div className={'w-full relative flex justify-end lg:justify-start items-center p-4 lg:p-0'}>
                            <img src={profileData.profile_picture || defaultUserImage} alt={`${profileData.name || 'User'}'s Profile`}
                                 className={"lg:absolute size-32 md:size-40 object-cover rounded-full border-2 sm:border-4 border-white shadow-lg left-10 lg:left-14 sm:-top-16 md:-top-20"} />
                            <div className={"w-full flex flex-col gap-2.5 lg:flex-row justify-between p-8 lg:items-center"}>
                                <div className={"flex flex-col gap-1 sm:gap-2 lg:pl-48 xl:pl-56 mt-[-20px] lg:mt-0"}>
                                    <h1 className={"text-lg sm:text-xl md:text-2xl font-bold truncate"}>{profileData.name || "Helper Name"} - {profileData.age || "N/A"} Years Old</h1>
                                    <div className={"flex flex-row gap-2 items-center"}>
                                        <div className="relative flex">
                                            {[...Array(5)].map((_, i) => (
                                                <AiFillStar key={i} size={window.innerWidth < 640 ? 18 : 24} className="text-gray-300" />
                                            ))}
                                            <div className="absolute top-0 left-0 flex overflow-hidden" style={{ width: `${resultRate(profileData.rating) * 100}%` }}>
                                                {[...Array(5)].map((_, i) => (
                                                    <AiFillStar key={i} size={window.innerWidth < 640 ? 18 : 24} className="text-[#EFBB4B]" />
                                                ))}
                                            </div>
                                        </div>
                                        <p className={"text-[#EFBB4B] text-xs sm:text-sm"}>{profileData.rating?.toFixed(1) || "0.0"} | Rated by {0} client(s)</p>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-600">
                                        {profileData.religion || "Religion N/A"} | From {profileData.base_location_name || "Location N/A"}
                                    </p>
                                </div>
                                {!isViewingOwnProfile && loggedInUserRole === 'customer' && (
                                    <Button
                                        onClick={toMakeContract}
                                        size={'lg'}
                                        className="mt-4 lg:mt-0 self-start lg:self-center"
                                        disabled={profileData.contract_status !== 'Available'}
                                    >
                                        <TbContract className={"text-white"} size={window.innerWidth < 640 ? 20 : 24} />
                                        {profileData.contract_status === 'Available' ? 'Make Contract' : 'Helper Unavailable'}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className={"w-full flex flex-col justify-center rounded-md shadow-md overflow-hidden"}>
                        <div className={"w-full flex items-center bg-[#F3ABAC] px-4 sm:px-8 py-3 sm:py-4 border-b-2 border-[#492924]"}>
                            <h1 className={"text-lg sm:text-xl font-medium"}>Professional Information</h1>
                        </div>
                        <div className={"grid grid-cols-1 md:grid-cols-2 p-4 sm:p-6 gap-4 bg-[#F7F8F1]"}>
                            <div className={"flex flex-col gap-4"}>

                                {isHelper ? (
                                    <div className={"flex flex-row items-center gap-4"}>
                                        <PiNotebook className={"text-[#EE7C9E]"} size={size} />
                                        <div className={"flex flex-col justify-start"}>
                                            <h2 className={"text-[#EE7C9E]"}>Contract Status:</h2>
                                            <h3>{profileData.contract_status || 'N/A'}</h3>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={"flex flex-row items-center gap-4"}>
                                        <TbBadge className={"text-[#EE7C9E]"} size={size} />
                                        <div className={"flex flex-col justify-start"}>
                                            <h2 className={"text-[#EE7C9E]"}>Required Helper Level:</h2>
                                            <h3>4</h3>
                                        </div>
                                    </div>
                                )}


                                <div className={"flex flex-row items-center gap-4"}>
                                    <PiIdentificationCardLight className={"text-[#EE7C9E]"} size={size} />
                                    <div className={"flex flex-col justify-start"}>
                                        <h2 className={"text-[#EE7C9E]"}>Job Type:</h2>
                                        <h3>Full Time</h3>
                                    </div>
                                </div>

                                {!isHelper && (
                                    <div className={"flex flex-row items-center gap-4"}>
                                        <IoTimeOutline className={"text-[#EE7C9E]"} size={size} />
                                        <div className={"flex flex-col justify-start"}>
                                            <h2 className={"text-[#EE7C9E]"}>Contract Duration:</h2>
                                            <h3>1 Year</h3>
                                        </div>
                                    </div>
                                )}

                                {isHelper ? (
                                    <div className={"flex flex-row items-center gap-4"}>
                                        <RiGraduationCapLine className={"text-[#EE7C9E]"} size={size} />
                                        <div className={"flex flex-col justify-start"}>
                                            <h2 className={"text-[#EE7C9E]"}>Highest Education Level:</h2>
                                            <h3>S1 (BINUS University)</h3>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={"flex flex-row items-center gap-4"}>
                                        <LuNotebookText className={"text-[#EE7C9E]"} size={size} />
                                        <div className={"flex flex-col justify-start"}>
                                            <h2 className={"text-[#EE7C9E]"}>Previous Contract Status:</h2>
                                            <h3>Any Situation</h3>
                                        </div>
                                    </div>
                                )}

                            </div>
                            <div className={"flex flex-col gap-4"}>
                                <div className={"flex flex-row items-center gap-4"}>
                                    <IoLocationOutline className={"text-[#EE7C9E]"} size={size} />
                                    <div className={"flex flex-col justify-start"}>
                                        <h2 className={"text-[#EE7C9E]"}>{isHelper ? 'Present' : 'Work'} Location:</h2>
                                        <h3>Surakarta</h3>
                                    </div>
                                </div>

                                <div className={"flex flex-row items-center gap-4"}>
                                    <LuCalendarCheck className={"text-[#EE7C9E]"} size={size} />
                                    <div className={"flex flex-col justify-start"}>
                                        <h2 className={"text-[#EE7C9E]"}>Available From:</h2>
                                        <h3>22 April 2025</h3>
                                    </div>
                                </div>
                                {!isHelper && (
                                    <div className={"flex flex-row items-center gap-4"}>
                                        <FaBed className={"text-[#EE7C9E]"} size={size} />
                                        <div className={"flex flex-col justify-start"}>
                                            <h2 className={"text-[#EE7C9E]"}>Accomodation Provided:</h2>
                                            <h3>Yes</h3>
                                        </div>
                                    </div>
                                )}
                                <div className={"flex flex-row items-center gap-3 sm:gap-4"}>
                                    <LuCoffee className={"text-[#EE7C9E]"} size={size} />
                                    <div><h2 className={"text-[#EE7C9E] text-sm"}>Day Off:</h2><h3 className="text-sm sm:text-base">{"Flexible"}</h3></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {isProfileOfTypeHelper && (
                        <div className={"w-full flex flex-col justify-center rounded-md shadow-md overflow-hidden"}>
                            <div className={"w-full flex items-center bg-[#F3ABAC] px-4 sm:px-8 py-3 sm:py-4 border-b-2 border-[#492924]"}>
                                <h1 className={"text-lg sm:text-xl font-medium"}>Level Information </h1>
                            </div>
                            <div className={"flex flex-col p-4 sm:p-6 gap-6 bg-[#F7F8F1]"}>
                                <LevelDisplay profileData={profileData} levelThresholds={levelThresholds} />
                                <div className={"bg-[#FFF2F3] border-l-2 border-[#EE7C9E] px-4 sm:px-6 py-3 sm:py-4 rounded-sm text-xs sm:text-sm"}>
                                    <p className={"text-justify"}><b>Disclaimer:</b><br />The level shown above reflects the helper's overall work experience and skill proficiency. It is not based on calendar years, but rather on actual tasks completed, responsibilities handled, and verified certifications. We use a points-based system where:<br /> Every completed task contributes to the helper's experience points (EXP).<br /> Certifications and formal training add extra EXP.<br /> Level 10 = Equivalent of 5 Years of Real-World Experience.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className={"w-full flex flex-col justify-center rounded-md shadow-md overflow-hidden"}>
                        <div className={"w-full flex items-center bg-[#F3ABAC] px-4 sm:px-8 py-3 sm:py-4 border-b-2 border-[#492924]"}>
                            <h1 className={"text-lg sm:text-xl font-medium"}>{isProfileOfTypeHelper ? 'About Me' : 'About My Family'}</h1>
                        </div>
                        <div className={"flex flex-col p-4 sm:p-6 gap-6 bg-[#F7F8F1]"}>
                            <p className={"text-[#492924] text-sm sm:text-base leading-relaxed text-justify"}>{profileData.about_me || "No description provided."}</p>
                        </div>
                    </div>

                    <div className={"w-full flex flex-col justify-center rounded-md shadow-md overflow-hidden"}>
                        <div className={"w-full flex items-center bg-[#F3ABAC] px-4 sm:px-8 py-3 sm:py-4 border-b-2 border-[#492924]"}>
                            <h1 className={"text-lg sm:text-xl font-medium"}>{isProfileOfTypeHelper ? 'Skill & Character' : 'Duties & Facility'}</h1>
                        </div>
                        <div className={"flex flex-col p-4 sm:p-6 gap-4 bg-[#F7F8F1]"}>
                            <div className={"flex flex-col gap-2"}>
                                <h2 className={"text-[#EE7C9E] text-sm sm:text-md font-semibold"}>Language:</h2>
                                <div className={"flex flex-row flex-wrap gap-2"}>
                                    {dummyLanguages?.length > 0 ? dummyLanguages.map((item) => (<SkillBox key={item} item={item} />)) : <p className="text-sm text-gray-500">None</p>}
                                </div>
                            </div>
                            <div className={"flex flex-col gap-2"}>
                                <h2 className={"text-[#EE7C9E] text-sm sm:text-md font-semibold"}>Main {isProfileOfTypeHelper ? 'Skills' : 'Duties'}:</h2>
                                <div className={"flex flex-row flex-wrap gap-2"}>
                                    {profileData.skills?.length > 0 ? profileData.skills.map((item) => (<SkillBox key={item} item={item} />)) : <p className="text-sm text-gray-500">None</p>}
                                </div>
                            </div>
                            <div className={"flex flex-col gap-2"}>
                                <h2 className={"text-[#EE7C9E] text-sm sm:text-md font-semibold"}>{isProfileOfTypeHelper ? 'Personality' : 'Provided Facilities'}:</h2>
                                <div className={"flex flex-row flex-wrap gap-2"}>
                                    {dummyPersonality.length > 0 ? dummyPersonality.map((item) => (<SkillBox key={item} item={item} />)) : <p className="text-sm text-gray-500">None</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {isProfileOfTypeHelper && (
                        <>
                            <div className={"w-full flex flex-col justify-center rounded-md shadow-md overflow-hidden"}>
                                <div className={"w-full flex items-center bg-[#F3ABAC] px-4 sm:px-8 py-3 sm:py-4 border-b-2 border-[#492924]"}>
                                    <h1 className={"text-lg sm:text-xl font-medium"}>Work Experience </h1>
                                </div>
                                <div className={"flex flex-col p-4 sm:p-6 gap-6 bg-[#F7F8F1]"}>
                                    {dummyWorkHistory?.length > 0 ? dummyWorkHistory?.map((job, index) => (
                                        <div key={index} className={'flex flex-row gap-4 sm:gap-6 items-start'}>
                                            <FaDotCircle size={window.innerWidth < 640 ? 18 : 24} className="mt-1 text-gray-400 flex-shrink-0" />
                                            <div className={'flex flex-col gap-0.5 justify-center'}>
                                                <p className={'text-[#EE7C9E] text-sm font-semibold'}>{job.period}</p>
                                                <p className={'text-sm sm:text-md font-medium'}>{job.family}</p>
                                                <div className={'flex flex-row flex-wrap gap-1 text-xs text-gray-600'}>
                                                    <span>Main duties: </span>
                                                    {job.duties?.map((duty, i) => (<span key={i}>{duty}{i < job.duties?.length - 1 ? ',' : ''} </span>))}
                                                </div>
                                            </div>
                                        </div>
                                    )) : <p className="text-sm text-gray-500">No work history available.</p>}
                                </div>
                            </div>

                            <div className={"w-full flex flex-col justify-center rounded-md shadow-md overflow-hidden"}>
                                <div className={"w-full flex items-center bg-[#F3ABAC] px-4 sm:px-8 py-3 sm:py-4 border-b-2 border-[#492924]"}>
                                    <h1 className={"text-lg sm:text-xl font-medium"}>Achievements</h1>
                                </div>
                                <div className={"flex flex-col p-4 sm:p-6 gap-6 bg-[#F7F8F1]"}>
                                    {dummyAchievementsData.length > 0 ? dummyAchievementsData.map((ach, i) => <AchievementDesc key={i} />) : <p className="text-sm text-gray-500">No achievements listed.</p>}
                                </div>
                            </div>

                            <div className={"w-full flex flex-col justify-center rounded-md shadow-md overflow-hidden"}>
                                <div className={"w-full flex items-center bg-[#F3ABAC] px-4 sm:px-8 py-3 sm:py-4 border-b-2 border-[#492924]"}>
                                    <h1 className={"text-lg sm:text-xl font-medium"}>On Job Moments</h1>
                                </div>
                                <div className={"flex flex-nowrap gap-4 overflow-x-auto p-4 sm:p-5 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"}>
                                    {dummyOnJobMomentsImages?.map((imgSrc, i) => (<img src={imgSrc} className={"w-48 h-36 sm:w-64 sm:h-48 flex-shrink-0 rounded-md object-cover shadow"} alt={`Job moment ${i + 1}`} key={i} />))}
                                    {dummyOnJobMomentsImages?.length === 0 && <p className="pl-2 text-sm text-gray-500">No moments shared.</p>}
                                </div>
                            </div>
                        </>
                    )}

                    <div className={"w-full flex flex-col justify-center rounded-md shadow-md overflow-hidden"}>
                        <div className={"w-full flex items-center bg-[#F3ABAC] px-4 sm:px-8 py-3 sm:py-4 border-b-2 border-[#492924]"}>
                            <h1 className={"text-lg sm:text-xl font-medium"}>{isProfileOfTypeHelper ? 'Salary Expectation' : 'Minimum Salary to Be Paid'}</h1>
                        </div>
                        <div className={"flex flex-col p-4 sm:p-6 gap-6 bg-[#F7F8F1]"}>
                            <div className={"flex flex-row items-center gap-3 sm:gap-4"}>
                                <TbMoneybag className={"text-[#EE7C9E]"} size={size} />
                                <div>
                                    <h2 className={"text-[#EE7C9E] text-md sm:text-xl"}>Salary:</h2>
                                    <h3 className={"text-md sm:text-xl"}>Rp.{profileData.salary_expectation?.toLocaleString('id-ID') || "N/A"},00</h3>
                                </div>
                            </div>
                            <div className={"bg-[#FFF2F3] border-l-2 border-[#EE7C9E] px-4 sm:px-6 py-3 sm:py-4 rounded-sm text-xs sm:text-sm"}>
                                <p className={'text-justify'}><b>Disclaimer:</b><br />{isProfileOfTypeHelper ? 'The stated salary is calculated based on the helper\'s experience level, accumulated task history, and verified training or certifications. It represents the minimum compensation that should be provided by the customer. The final salary may increase depending on the number and complexity of tasks assigned, as agreed upon in the work contract.' : 'The stated minimum salary is calculated based on the helper’s experience level and the number of main tasks assigned. This salary may increase depending on additional tasks assigned later by the customer, as mutually agreed in the work contract.'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={"flex flex-col gap-5 lg:w-1/3 xl:w-1/4 mt-8 lg:mt-0"}>
                    <div className={"bg-[#DA807B] rounded-md px-6 sm:px-10 py-3 sm:py-4 flex justify-center items-center shadow"}>
                        <h1 className={"text-white text-lg sm:text-xl font-medium"}>{isProfileOfTypeHelper ? 'Customer' : 'Helper'} Reviews</h1>
                    </div>
                    <div className={"w-full flex items-center justify-center"}>
                        <CustomerReviewCard />
                    </div>
                    <div className={"w-full flex items-center justify-center mt-2"}>
                        <CustomerReviewCard />
                    </div>
                </div>
            </div>
            <MainFooter />
        </div>
    );
}

export default UserProfile;