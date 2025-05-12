import {FaFacebook, FaInstagram, FaTiktok, FaTwitter} from "react-icons/fa";
import logo from "../../assets/images/logo/Broken White.png"


const MainFooter = () => {
    return (
        <div className="min-w-full max-w-screen">
            <div className="flex flex-col gap-16 px-32 bg-[#EE7C9E] py-8 text-white text-sm">
                <div className={"flex flex-col gap-16 md:flex-row justify-center md:justify-between"}>
                    <div className={"flex flex-col gap-8 w-full md:w-1/2 items-center justify-center md:justify-start md:gap-4"} >
                        <div className={"flex flex-row gap-4 items-center justify-center md:justify-start w-full"}>
                            <img src={logo} alt={"Logo"} className={"w-16 h-16"}/>
                            <p className={"font-bold"}>MbakCare</p>
                        </div>
                        <div className={"flex flex-col gap-4 w-full text-center md:text-start"}>
                            <p>MbakCare is a reliable service connection platform that bridges customers with trusted household helpers, offering a seamless experience through structured task management, ratings, and professional development features.</p>
                        </div>
                    </div>
                    <div className={"flex flex-row justify-center md:justify-start md:flex-col gap-4 font-bold text-center md:text-start"}>
                        <p>TUTORIALS</p>
                        <p>FAQS</p>
                        <p>TERMS OF SERVICE</p>
                        <p>CONTACT US</p>
                    </div>
                    <div className={"flex flex-col gap-4 text-center md:text-start justify-center md:justify-start"}>
                        <p className={"font-bold"}>FOLLOW US</p>
                        <p>Yes, we are social</p>
                        <div className={"w-full flex flex-row gap-4 justify-center md:justify-start items-center"}>
                            <FaInstagram className={"text-white w-8 h-8"}/>
                            <FaFacebook className={"text-white w-8 h-8"}/>
                            <FaTwitter className={"text-white w-8 h-8"}/>
                            <FaTiktok className={"text-white w-8 h-8"}/>
                        </div>
                    </div>
                </div>
                <div className="border-t-2 border-[#F7F8F1] flex flex-row justify-center items-center gap-32 py-6 text-[#F7F8F1]">
                    <p>@2025 MbakCare. All Right Reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default MainFooter;