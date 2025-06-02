import NavigationBar from "@/components/InfoBar/NavigationBar.tsx";
import MainFooter from "@/components/InfoBar/MainFooter.tsx";
import dev1 from "@/assets/images/profile/Dev1.jpg"
import dev2 from "@/assets/images/profile/Dev2.jpg"
import logo from "@/assets/images/logo/Pink.png";
import {useNavigate} from "react-router-dom";

function NotFoundPage() {
    const navigate = useNavigate();
    function redirectHome(){
        navigate("/home")
    }
    return (
        <div className="min-h-screen flex flex-col bg-white cursor-default text-[#492924]">
            <NavigationBar />

            <div className="flex-1 px-8 lg:px-64 py-8 pt-40 flex flex-col justify-center items-center gap-10">
                <div className={'flex flex-col gap-4 items-center justify-center'}>
                    <div className={"p-2 md:p-4 bg-white rounded-full shadow-md cursor-pointer overflow-hidden"} onClick={redirectHome}>
                        <img src={logo} alt="logo" className={"h-32"}/>
                    </div>
                    <h2 className="text-3xl text-center font-bold">
                        You're in another dimension<br />Get back to the existing page
                    </h2>
                </div>

                <div className="flex flex-col gap-2 items-center justify-center">
                    <p className="text-xl font-semibold">Greetings from Developers</p>
                    <div className="flex flex-row justify-between items-center gap-5">
                        <div className="flex flex-col gap-2 items-center justify-center">
                            <img
                                src={dev1}
                                className="size-24 rounded-full border border-[#492924] object-cover"
                                alt="Kevin"
                            />
                            <p>Kevin</p>
                        </div>
                        <div className="flex flex-col gap-2 items-center justify-center">
                            <img
                                src={dev2}
                                className="size-24 rounded-full border border-[#492924] object-cover"
                                alt="Jose"
                            />
                            <p>Jose</p>
                        </div>
                    </div>
                </div>
            </div>

            <MainFooter />
        </div>
    );
}

export default NotFoundPage;