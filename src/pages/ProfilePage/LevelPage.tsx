import { useState, useEffect } from "react";
import NavigationBar from "@/components/InfoBar/NavigationBar.tsx";
import MainFooter from "@/components/InfoBar/MainFooter.tsx";
import LevelDisplay from "@/components/InfoComponent/LevelDisplay.tsx";
import { useAuthCt } from "@/lib/auth-context.tsx";
import { ProfileService, HelperProfileData } from "@/lib/services/ProfileService.ts";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/Inputer/Button.tsx";

function LevelPage() {
    const { user, userRole, isLoading: authLoading } = useAuthCt();
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState<HelperProfileData | null>(null);
    const [levelThresholds, setLevelThresholds] = useState<{ level: number, xp_required: number }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (authLoading) return; 

            if (!user || userRole !== 'helper') {
                setIsLoading(false);
                if (userRole && userRole !== 'helper') {
                    setError("This page is only available for helpers.");
                } else {
                    navigate('/auth/login');
                }
                return;
            }

            setIsLoading(true);
            try {
                const [profile, thresholds] = await Promise.all([
                    ProfileService.getCurrentUserProfile(user.id, userRole),
                    ProfileService.getLevelThresholds()
                ]);

                if (profile && profile.role === 'helper') {
                    setProfileData(profile as HelperProfileData);
                } else {
                    setError("Could not load your helper profile. Please try again.");
                }
                setLevelThresholds(thresholds);

            } catch (err: any) {
                setError(err.message || "Failed to fetch level information.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [user, userRole, authLoading, navigate]);

    const renderContent = () => {
        if (isLoading || authLoading) {
            return <div className="text-center p-8">Loading your level information...</div>;
        }

        if (error) {
            return <div className="text-center text-red-500 p-8 bg-red-50 rounded-md">{error}</div>;
        }

        if (!profileData) {
            return (
                <div className="text-center p-8 bg-yellow-100 rounded-md">
                    <p>Could not display level information.</p>
                    <Button onClick={() => window.location.reload()} className="mt-4">Try Again</Button>
                </div>
            );
        }

        return (
            <>
                <div className={"flex flex-col gap-4 p-6 rounded-md shadow-inner bg-gray-50"}>
                    <LevelDisplay profileData={profileData} levelThresholds={levelThresholds} />
                     <div className={"bg-[#FFF2F3] border-l-2 border-[#EE7C9E] px-6 py-4 rounded-sm text-sm mt-4"}>
                        <p className={"text-justify"}>
                           Keep completing tasks and earning experience points (XP) to level up. Higher levels increase your credibility and visibility to potential customers.
                        </p>
                    </div>
                </div>

                <div className={"flex flex-col gap-8 mt-8"}>
                    <div className="flex flex-col items-center justify-center relative">
                        <h1 className={"font-bold text-3xl text-center"}>Daily EXP Summary</h1>
                        <div className="w-48 h-0.5 bg-[#DA807B] mt-2 rounded-md"></div>
                    </div>
                    <div className={'flex flex-col gap-4 items-center w-full p-8 bg-gray-50 rounded-md shadow-inner'}>
                       <p className="text-gray-600">Your daily summary of earned experience will be shown here once you start completing tasks.</p>
                       {/* This section can be built out later with a service to fetch daily task completion history */}
                    </div>
                </div>
            </>
        );
    };

    return (
        <div className={"min-h-screen min-w-full max-w-screen h-full"}>
            <NavigationBar />
            <div className={"flex flex-col w-full h-full px-8 lg:px-64 py-8 pt-40 gap-8 text-[#492924]"}>
                <div className={"flex flex-col gap-8"}>
                    <div className="flex flex-col items-center justify-center relative">
                        <h1 className={"font-bold text-4xl text-center"}>Your Level Progress</h1>
                        <div className="w-56 h-0.5 bg-[#DA807B] mt-2 rounded-md"></div>
                    </div>
                    {renderContent()}
                </div>
            </div>
            <MainFooter />
        </div>
    );
}

export default LevelPage;