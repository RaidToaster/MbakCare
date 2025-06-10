import CustomerReviewCard from "@/components/Card/CustomerReviewCard.tsx";
import NavigationBar from "@/components/InfoBar/NavigationBar.tsx";
import { PiNotebook } from "react-icons/pi";
import { IoLocationOutline, IoTimeOutline } from "react-icons/io5";
import { TbArrowBackUp, TbBadge, TbContract } from "react-icons/tb";
import MainFooter from "@/components/InfoBar/MainFooter.tsx";
import SkillBox from "@/components/InfoComponent/SkillBox.tsx";
import { useNavigate, useParams } from "react-router-dom";
import banner from "@/assets/images/profile/Profile Banner.png";
import defaultUserImage from "@/assets/images/profile/Default.png";
import { Button } from "@/components/Inputer/Button.tsx";
import { FaBed, FaDog } from "react-icons/fa6";
import { MdFamilyRestroom } from "react-icons/md";
import { useEffect, useState } from "react";
import { ProfileService, CustomerProfileData } from "@/lib/services/ProfileService";
import { supabase } from "@/lib/supabase";
import { useAuthCt } from "@/lib/auth-context";

type UserRole = 'customer' | 'helper' | 'admin';

function CustomerProfile() {
    const { id: profileIdFromParams } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { userRole: loggedInUserRoleFromAuth } = useAuthCt();

    const [loggedInUser, setLoggedInUser] = useState<any>(null);

    useEffect(() => {
        const fetchLoggedInUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setLoggedInUser(user);
        };
        fetchLoggedInUser();
    }, []);

    const [profileData, setProfileData] = useState<CustomerProfileData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isViewingOwnProfile, setIsViewingOwnProfile] = useState(false);
    const [loggedInUserRole, setLoggedInUserRole] = useState<UserRole | null>(loggedInUserRoleFromAuth);


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
                const fetchedProfileData = await ProfileService.getCustomerProfileById(profileIdFromParams);
                setProfileData(fetchedProfileData);

                if (loggedInUser) {
                    setIsViewingOwnProfile(loggedInUser.id === profileIdFromParams);
                } else {
                    const { data: { user: currentAuthUser } } = await supabase.auth.getUser();
                    if (currentAuthUser) {
                        setIsViewingOwnProfile(currentAuthUser.id === profileIdFromParams);
                        const { data: currentUserData } = await supabase
                            .from('users')
                            .select('role')
                            .eq('id', currentAuthUser.id)
                            .single();
                        setLoggedInUserRole(currentUserData?.role as UserRole || null);
                    }
                }


                if (!fetchedProfileData) {
                    setError("Customer profile not found.");
                }

            } catch (err: any) {
                setError(err.message || "Failed to fetch profile data.");
                setProfileData(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileAndCurrentUser();
    }, [profileIdFromParams, loggedInUser]);

    function backTrack() {
        navigate(-1);
    }

    function toProposeJob() {
        if (profileData) {
            navigate(`/job-proposal/create?customerId=${profileData.id}`);
        }
    }


    if (isLoading) {
        return (
            <div className="bg-white min-h-screen min-w-full max-w-screen h-full cursor-default">
                <NavigationBar />
                <div className="w-full flex flex-1 justify-center items-center py-8 pt-40 text-[#492924]">Loading profile...</div>
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
    const dummyRequiredSkills = ["House Cleaning", "Cooking", "Laundry"];
    const dummyProvidedFacilities = ["Wi-Fi Access", "Private Room"];

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
                                    <h1 className={"text-lg sm:text-xl md:text-2xl font-bold truncate"}>{profileData.name || "Customer Name"}</h1>
                                    <p className="text-xs sm:text-sm text-gray-600">
                                        Address: {profileData.address || "Location N/A"}
                                    </p>
                                </div>
                                {!isViewingOwnProfile && loggedInUserRole === 'helper' && (
                                    <Button onClick={toProposeJob} size={'lg'} className="mt-4 lg:mt-0 self-start lg:self-center">
                                        <TbContract className={"text-white"} size={window.innerWidth < 640 ? 20 : 24} />
                                        Propose Job
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className={"w-full flex flex-col justify-center rounded-md shadow-md overflow-hidden"}>
                        <div className={"w-full flex items-center bg-[#996052] px-4 sm:px-8 py-3 sm:py-4 border-b-2 border-white/50"}>
                            <h1 className={"text-lg sm:text-xl font-medium text-white"}>Household Information</h1>
                        </div>
                        <div className={"grid grid-cols-1 md:grid-cols-2 p-4 sm:p-6 gap-4 bg-[#F7F8F1]"}>
                            <div className={"flex flex-col gap-4"}>
                                <div className={"flex flex-row items-center gap-3 sm:gap-4"}>
                                    <TbBadge className={"text-[#996052]"} size={size} />
                                    <div><h2 className={"text-[#996052] text-sm"}>Preferred Helper Level:</h2><h3 className="text-sm sm:text-base">{profileData.preferred_helper_level || "N/A"}</h3></div>
                                </div>
                                <div className={"flex flex-row items-center gap-3 sm:gap-4"}>
                                    <MdFamilyRestroom className={"text-[#996052]"} size={size} />
                                    <div><h2 className={"text-[#996052] text-sm"}>Family Members:</h2><h3 className="text-sm sm:text-base">{profileData.num_family_members ?? "N/A"}</h3></div>
                                </div>
                                <div className={"flex flex-row items-center gap-3 sm:gap-4"}>
                                    <IoTimeOutline className={"text-[#996052]"} size={size} />
                                    <div><h2 className={"text-[#996052] text-sm"}>Expected Contract Duration:</h2><h3 className="text-sm sm:text-base">{"1 Year (Example)"}</h3></div>
                                </div>
                            </div>
                            <div className={"flex flex-col gap-4"}>
                                <div className={"flex flex-row items-center gap-3 sm:gap-4"}>
                                    <IoLocationOutline className={"text-[#996052]"} size={size} />
                                    <div><h2 className={"text-[#996052] text-sm"}>Work Location:</h2><h3 className="text-sm sm:text-base">{profileData.address || "N/A"}</h3></div>
                                </div>
                                <div className={"flex flex-row items-center gap-3 sm:gap-4"}>
                                    <FaDog className={"text-[#996052]"} size={size} />
                                    <div><h2 className={"text-[#996052] text-sm"}>Has Pets:</h2><h3 className="text-sm sm:text-base">{profileData.has_pets ? "Yes" : "No"}</h3></div>
                                </div>
                                <div className={"flex flex-row items-center gap-3 sm:gap-4"}>
                                    <FaBed className={"text-[#996052]"} size={size} />
                                    <div><h2 className={"text-[#996052] text-sm"}>Accommodation Provided:</h2><h3 className="text-sm sm:text-base">{"Yes (Example)"}</h3></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={"w-full flex flex-col justify-center rounded-md shadow-md overflow-hidden"}>
                        <div className={"w-full flex items-center bg-[#996052] px-4 sm:px-8 py-3 sm:py-4 border-b-2 border-white/50"}>
                            <h1 className={"text-lg sm:text-xl font-medium text-white"}>About My Family</h1>
                        </div>
                        <div className={"flex flex-col p-4 sm:p-6 gap-6 bg-[#F7F8F1]"}>
                            <p className={"text-[#492924] text-sm sm:text-base leading-relaxed text-justify"}>{profileData.family_description || "No family description provided."}</p>
                        </div>
                    </div>

                    <div className={"w-full flex flex-col justify-center rounded-md shadow-md overflow-hidden"}>
                        <div className={"w-full flex items-center bg-[#996052] px-4 sm:px-8 py-3 sm:py-4 border-b-2 border-white/50"}>
                            <h1 className={"text-lg sm:text-xl font-medium text-white"}>Required Duties & Provided Facilities</h1>
                        </div>
                        <div className={"flex flex-col p-4 sm:p-6 gap-4 bg-[#F7F8F1]"}>
                            <div className={"flex flex-col gap-2"}>
                                <h2 className={"text-[#996052] text-sm sm:text-md font-semibold"}>Required Main Duties:</h2>
                                <div className={"flex flex-row flex-wrap gap-2"}>
                                    {dummyRequiredSkills.length > 0 ? dummyRequiredSkills.map((item) => (<SkillBox key={item} item={item} variant="default" />)) : <p className="text-sm text-gray-500">None specified</p>}
                                </div>
                            </div>
                            <div className={"flex flex-col gap-2"}>
                                <h2 className={"text-[#996052] text-sm sm:text-md font-semibold"}>Provided Facilities:</h2>
                                <div className={"flex flex-row flex-wrap gap-2"}>
                                    {dummyProvidedFacilities.length > 0 ? dummyProvidedFacilities.map((item) => (<SkillBox key={item} item={item} variant="default" />)) : <p className="text-sm text-gray-500">None specified</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={"flex flex-col gap-5 lg:w-1/3 xl:w-1/4 mt-8 lg:mt-0"}>
                    <div className={"bg-[#8A544B] rounded-md px-6 sm:px-10 py-3 sm:py-4 flex justify-center items-center shadow"}>
                        <h1 className={"text-white text-lg sm:text-xl font-medium"}>Helper Reviews</h1>
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

export default CustomerProfile;