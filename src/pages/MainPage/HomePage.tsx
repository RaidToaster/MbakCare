import MainFooter from "@/components/Footer/MainFooter.tsx";
import landingImg from "../../assets/images/home/Landing Image.png"
import HomeInfo from "@/components/ui/HomeInfo.tsx";
import {ArrowRight} from "lucide-react";

const HomePage = () => {
    return (
        <div className="h-full w-screen bg-white">
            <div className="bg-white p-16 flex flex-row justify-center items-center gap-32">
                <div className={"flex flex-col gap-8 text-[#492924]"}>
                    <h2>WE ARE</h2>
                    <h1 className={"text-6xl font-bold"}>Service<br/>Connection<br/>Platform</h1>
                    <p>We help customers and household helpers connect with each other</p>
                    <button className={"flex flex-row gap-4 text-[#EFBB4B]"}>
                        <h3>GET STARTED</h3>
                        <ArrowRight/>
                    </button>
                </div>
                <img src={landingImg} className={"w-140 h-120"} alt={"Pictures"}/>
            </div>
            <div className={"bg-[#FBF3EB] p-16 flex flex-col justify-center items-center text-[#492924]"}>
                <h1 className={"text-4xl font-bold p-16"}>How We Help You?</h1>
                <div className={"flex flex-row gap-16"}>
                    <HomeInfo title="Smart Matching" desc ="Find the perfect helper based on experience, skills, location & ratings." type={1}/>
                    <HomeInfo title="Verified Helpers" desc ="Transparent reviews & experience-based leveling system." type={2}/>
                    <HomeInfo title="Secure Payments" desc ="Safe, fast, and hassle-free transactions on the website." type={3}/>
                    <HomeInfo title="Task Management" desc ="Organize tasks with To-Do Lists & real-time tracking." type={4}/>
                </div>
            </div>
            <div className="bg-white p-16 flex flex-row justify-center items-center gap-32">
                <h1>Customer Reviews</h1>
                <p></p>
            </div>
            <MainFooter/>
        </div>
    );
};

export default HomePage;