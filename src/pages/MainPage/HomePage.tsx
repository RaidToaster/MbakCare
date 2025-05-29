import MainFooter from "@/components/InfoBar/MainFooter.tsx";
import landingImg from "../../assets/images/home/Landing Image.png"
import HomeInfo from "@/components/InfoComponent/HomeInfo.tsx";
import {ArrowRight} from "lucide-react";
import {IoIosArrowBack, IoIosArrowForward} from "react-icons/io";
import {useNavigate} from "react-router-dom";
import HelperReviewCard from "@/components/Card/HelperReviewCard.tsx";
import NavigationBar from "@/components/InfoBar/NavigationBar.tsx";


function HomePage () {
    const navigate = useNavigate();

    function redirectLogin () {
        navigate("/auth/login")
    }

    return (
        <div className="min-h-screen min-w-full h-full w-full cursor-default bg-white">
            <NavigationBar/>
            <div className="bg-white px-8 lg:px-64 py-8 pt-40 flex flex-col lg:flex-row justify-center items-center gap-32 ">
                <div className={"flex flex-col gap-8 text-[#492924] lg:text-start justify-center lg:justify-start text-center w-full lg:w-1/2"}>
                    <h2>WE ARE A</h2>
                    <h1 className={"text-6xl font-bold text-center lg:text-left"}>Service<br/>Connection<br/>Platform</h1>
                    <p className={"lg:w-2/3"}>We help customers and household helpers connect with each other.</p>
                    <div className={"flex flex-row justify-center lg:justify-start items-center gap-16"}>
                        <button className={"flex flex-row gap-4 text-[#EFBB4B] font-bold w-48 px-4 py-2 rounded-full justify-center items-center lg:justify-start cursor-pointer hover:underline hover:underline-offset-2"} onClick={redirectLogin}>
                            <h3>GET STARTED</h3>
                            <ArrowRight className={"hidden lg:block"}/>
                        </button>
                    </div>
                </div>
                <img src={landingImg} className={"w-2/3"} alt={"Pictures"}/>
            </div>
            <div className="bg-white px-16 py-40 flex flex-col justify-center items-center gap-16">
                <h1 className={"text-4xl font-bold text-[#492924]"}>Our Stories</h1>
                <p className={"text-center w-2/3"}>In today's era, finding a reliable household helper is still challenging, as traditional methods are time-consuming and lack transparency. Many aspiring helpers also struggle to access proper training and job opportunities due to the absence of skill verification. MbakCare bridges this gap by providing a trusted, structured, and efficient platform that connects customers with qualified helpers.</p>
            </div>
            <div className={"bg-[#FBF3EB] p-16 flex flex-col justify-center items-center text-[#492924]"}>
                <h1 className={"text-4xl font-bold p-16 text-center"}>How We Help You?</h1>
                <div className={"flex lg:flex-row flex-col gap-16 "}>
                    <HomeInfo title="Smart Matching" desc ="Find the perfect helper based on experience, skills, location & ratings." type={1}/>
                    <HomeInfo title="Verified Helpers" desc ="Transparent reviews & experience-based leveling system." type={2}/>
                    <HomeInfo title="Secure Payments" desc ="Safe, fast, and hassle-free transactions on the website." type={3}/>
                    <HomeInfo title="Task Management" desc ="Organize tasks with To-Do Lists & real-time tracking." type={4}/>
                </div>
            </div>
            <div className="bg-white p-16 flex flex-row justify-center items-center gap-16 py-24 lg:py-0">
                <IoIosArrowBack className={"hidden lg:block w-16 h-16"}/>
                <HelperReviewCard/>
                <IoIosArrowForward className={"hidden lg:block w-16 h-16"}/>
            </div>
            <div className="bg-white p-16 flex lg:flex-row flex-col justify-between items-center gap-10 lg:gap-32">
                <img src={landingImg} alt={"Pictures"} className={"w-2/3"}/>
                <div className={"flex flex-col gap-16 lg:justify-end justify-center w-full lg:w-1/2 lg:text-end text-center py-24 lg:py-0"}>
                    <h1 className={"text-4xl text-[#492924] font-bold"}>Join Our Mission!</h1>
                    <p className={"text-center lg:text-right"}>MbakCare welcomes partnerships with various organizations, including training centers, orphanages, and institutions dedicated to workforce development. We believe that collaboration is key to enhancing the skills and professionalism of our household helpers, ensuring they receive proper training and opportunities for growth. If you are interested in working with us to improve and empower our helpers, feel free to contact us. We’d love to collaborate!</p>
                </div>

            </div>
            <MainFooter/>
        </div>
    );
};

export default HomePage;