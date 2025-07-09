import { HelperProfileData } from "@/lib/services/ProfileService";

interface LevelDisplayProps {
    profileData: HelperProfileData | null;
    levelThresholds: { level: number, xp_required: number }[];
}

function LevelDisplay({ profileData, levelThresholds }: LevelDisplayProps) {
    if (!profileData) return null;

    const currentLevel = profileData.level || 1;
    const currentXP = profileData.experience_points || 0;

    const currentLevelInfo = levelThresholds.find(lt => lt.level === currentLevel);
    const nextLevelInfo = levelThresholds.find(lt => lt.level === currentLevel + 1);

    const xpForCurrentLevel = currentLevelInfo?.xp_required || 0;
    const xpForNextLevel = nextLevelInfo?.xp_required || (currentXP > xpForCurrentLevel ? currentXP : xpForCurrentLevel + 1);

    const xpProgress = currentXP - xpForCurrentLevel;
    const xpToNextLevel = xpForNextLevel - xpForCurrentLevel;
    const progressPercentage = xpToNextLevel > 0 ? Math.min((xpProgress / xpToNextLevel) * 100, 100) : 100;

    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Level: <span className="text-[#EE7C9E]">{currentLevel}</span></h3>
                <p className="text-sm text-gray-600">
                    <span className="font-bold">{currentXP.toLocaleString()}</span> / {xpForNextLevel.toLocaleString()} XP
                </p>
            </div>
            <div className="relative w-full h-4 rounded-full overflow-hidden bg-gray-200 border border-gray-300">
                <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#F3ABAC] to-[#EE7C9E] transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                />
                <div className="absolute inset-0 flex justify-center items-center">
                    <span className="text-xs font-medium text-white mix-blend-difference">
                        {xpProgress.toLocaleString()} / {xpToNextLevel.toLocaleString()}
                    </span>
                </div>
            </div>
            {nextLevelInfo && (
                 <p className="text-center text-sm text-gray-500">
                    You need <b>{(xpForNextLevel - currentXP).toLocaleString()}</b> more XP to reach Level {currentLevel + 1}.
                </p>
            )}
        </div>
    );
}

export default LevelDisplay;