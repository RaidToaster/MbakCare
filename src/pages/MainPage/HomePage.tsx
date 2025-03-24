import MainFooter from "@/components/Footer/MainFooter.tsx";
import landingImg from "../../assets/images/home/Landing Image.png"
import HomeInfo from "@/components/ui/HomeInfo.tsx";
import {ArrowRight} from "lucide-react";
import {IoIosArrowBack, IoIosArrowForward} from "react-icons/io";
import Testi1 from "../../assets/images/home/Testimoni Portrait 1.png"
import Profile1 from "../../assets/images/home/Review Profile 1.png"
import {AiFillStar} from "react-icons/ai";


const HomePage = () => {
    return (
        <div className="h-full w-screen bg-white">
            <div className="bg-white p-16 flex md:flex-row sm:flex-col justify-center items-center gap-32 ">
                <div className={"flex flex-col gap-8 text-[#492924] md:text-start justify-center md:justify-start sm:text-center w-1/2"}>
                    <h2>WE ARE A</h2>
                    <h1 className={"text-6xl font-bold"}>Service<br/>Connection<br/>Platform</h1>
                    <p className={"md:w-2/3"}>We help customers and household helpers connect with each other.</p>
                    <div className={"flex flex-row justify-center md:justify-start items-center gap-16"}>
                        <button className={"flex flex-row gap-4 text-[#EFBB4B] font-bold w-48 px-4 py-2 rounded-full justify-center items-center md:justify-start "}>
                            <h3>GET STARTED</h3>
                            <ArrowRight className={"hidden lg:block"}/>
                        </button>
                    </div>
                </div>
                <img src={landingImg} className={"w-140 h-120"} alt={"Pictures"}/>
            </div>
            <div className="bg-white px-16 py-40 flex flex-col justify-center items-center gap-16">
                <h1 className={"text-4xl font-bold text-[#492924]"}>Our Stories</h1>
                <p className={"text-center w-2/3"}>In today's era, finding a reliable household helper is still challenging, as traditional methods are time-consuming and lack transparency. Many aspiring helpers also struggle to access proper training and job opportunities due to the absence of skill verification. MbakCare bridges this gap by providing a trusted, structured, and efficient platform that connects customers with qualified helpers.</p>
            </div>
            <div className={"bg-[#FBF3EB] p-16 flex flex-col justify-center items-center text-[#492924]"}>
                <h1 className={"text-4xl font-bold p-16"}>How We Help You?</h1>
                <div className={"flex md:flex-row sm:flex-col gap-16 "}>
                    <HomeInfo title="Smart Matching" desc ="Find the perfect helper based on experience, skills, location & ratings." type={1}/>
                    <HomeInfo title="Verified Helpers" desc ="Transparent reviews & experience-based leveling system." type={2}/>
                    <HomeInfo title="Secure Payments" desc ="Safe, fast, and hassle-free transactions on the website." type={3}/>
                    <HomeInfo title="Task Management" desc ="Organize tasks with To-Do Lists & real-time tracking." type={4}/>
                </div>
            </div>
            <div className="bg-white p-16 flex flex-row justify-center items-center gap-16 ">
                <IoIosArrowBack className={"hidden sm:block w-16 h-16"}/>
                <div className={"flex flex-row gap-8 text-[#492924] md:text-start justify-center md:justify-evenly sm:text-center w-full items-center"}>
                    <div className={"flex flex-col gap-8 text-[#492924] md:text-start justify-center md:justify-start sm:text-center w-1/2"}>
                        <h1 className={"text-3xl font-bold"}>Customer Reviews</h1>
                        <p className={"md:w-2/3"}>"This platform has truly changed my life! I found a reliable job quickly, and the task management feature makes everything so much easier. I feel more valued and secure in my work."</p>
                        <div className={"flex flex-row gap-4 items-center"}>
                            <img src={Profile1} alt={"Profile"} className={"w-16 h-16 rounded-full object-cover"}/>
                            <div className={"flex flex-col gap-2"}>
                                <h3>Siti Rahma</h3>
                                <p>Professional Helper</p>
                            </div>
                        </div>
                        <div className={"flex flex-row gap-4 items-center justify-center md:justify-start"}>
                            <div className={"flex flex-row gap-2"}>
                                <AiFillStar className={"text-[#EFBB4B]"}/>
                                <AiFillStar className={"text-[#EFBB4B]"}/>
                                <AiFillStar className={"text-[#EFBB4B]"}/>
                                <AiFillStar className={"text-[#EFBB4B]"}/>
                                <AiFillStar/>
                            </div>
                            <p>4.8</p>
                        </div>
                    </div>
                    <img src={Testi1} alt={"Pictures"} className={"h-120 hidden md:block"}/>
                </div>
                <IoIosArrowForward className={"hidden sm:block w-16 h-16"}/>
            </div>
            <div className="bg-white p-16 flex md:flex-row sm:flex-col justify-between items-center gap-32">

                    <img src={landingImg} alt={"Pictures"} className={"h-120"}/>

                <div className={"flex flex-col gap-16 md:justify-end sm:justify-center w-1/2 md:text-end sm:text-center"}>
                    <h1 className={"text-4xl text-[#492924] font-bold"}>Join Our Mission!</h1>
                    <p className={""}>MbakCare welcomes partnerships with various organizations, including training centers, orphanages, and institutions dedicated to workforce development. We believe that collaboration is key to enhancing the skills and professionalism of our household helpers, ensuring they receive proper training and opportunities for growth. If you are interested in working with us to improve and empower our helpers, feel free to contact us. We’d love to collaborate!</p>
                </div>

            </div>
            <MainFooter/>
        </div>
    );
};

export default HomePage;