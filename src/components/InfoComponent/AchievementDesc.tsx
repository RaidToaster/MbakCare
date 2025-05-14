import logos from "/src/assets/images/logo/BLK Logo.jpg"


function AchievementDesc() {
    return (
        <div className={"flex flex-row gap-6 items-center"}>
            <img src={logos} alt={"Achievement Pic"} className={"rounded-md border-[#492924] border-2 w-24 h-24 object-cover"} />
            <div>
                <h2 className={"text-[#EE7C9E] font-bold text-lg"}>Training at Binus University</h2>
                <p>Conducted on May 14th, 2025</p>
                <p>View Certificate</p>
            </div>
        </div>
    );
}

export default AchievementDesc;