import NavigationBar from "@/components/InfoBar/NavigationBar.tsx";
import {TbArrowBackUp} from "react-icons/tb";
import {useNavigate} from "react-router-dom";
import icon from "@/assets/images/profile/Default.png";

function InboxDetailPage() {
    const navigate = useNavigate();

    function backTrack (){
        navigate('/inbox/view')
    }

    return (
        <div className={"min-h-screen min-w-full max-w-screen h-full"}>
            <NavigationBar/>
            <div className={"flex flex-col w-full h-full px-8 lg:px-64 py-8 pt-40 gap-8 text-[#492924]"}>
                <div className="flex flex-row items-center w-full gap-10">
                    <TbArrowBackUp className={"cursor-pointer"} size={40} onClick={backTrack}/>
                    <h1 className={"font-bold text-3xl text-left"}>New Account</h1>
                </div>
                <div className={"flex flex-col w-full gap-10 px-20"}>
                    <div className={'flex flex-row items-center w-full justify-between'}>
                        <div className={'flex flex-row gap-5 items-center'}>
                            <img src={icon} alt={"Profile"}
                                 className={"h-12 w-12 overflow-hidden rounded-full object-fit object-center border-2 border-[#492924]"}/>
                            <div>
                                <h3 className={'text-xl font-semibold'}>MbakCare</h3>
                                <p className={'text-[#EE7C9E]'}>System</p>
                            </div>
                        </div>
                        <p>07.00</p>
                    </div>
                    <p className={'text-justify'}>Welcome Abroad
                        It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
                        The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here,
                        content here', making it look like readable English. Many desktop publishing packages and web page editors now use
                        Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy.
                        Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>
                </div>
            </div>


        </div>
    );
}

export default InboxDetailPage;