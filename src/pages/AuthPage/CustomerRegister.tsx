import customer from "../../assets/images/main/Customer Image.png"
import {Link, useNavigate} from "react-router-dom";
import logo from "@/assets/images/logo/Pink.png";
import {FaLock, FaUser} from "react-icons/fa";
import {Input} from "@/components/InfoComponent/input.tsx";
import {MdEmail} from "react-icons/md";
import {Button} from "@/components/InfoComponent/button.tsx";
import {FcGoogle} from "react-icons/fc";
import {TbArrowBackUp} from "react-icons/tb";
function CustomerRegister() {
    const navigate = useNavigate();

    function backTrack (){
        navigate("/auth/register")
    }

    return (
        <div className={"flex flex-row w-screen h-screen"}>
            <div className={"w-1/2 hidden md:flex"}>
                <div className={"w-full bg-[#EE7C9E] flex flex-col justify-center items-center gap-8"}>
                    <h1 className={"font-bold text-4xl text-white"}>I'm Here for Hiring</h1>
                    <img src={customer} className={"h-80"} alt="Helper Img"/>
                </div>
            </div>

            <div className={"w-full md:w-1/2 bg-white flex flex-col justify-center items-center text-center gap-6 relative"}>
                <TbArrowBackUp className={"absolute right-5 top-5"} size={64} onClick={backTrack}/>
                <img src={logo} alt="MbakCare Logo" className={"h-32"}/>
                <h1 className={"text-4xl font-bold"}>Hello There!<br/>Nice to Know You</h1>
                <div className={"flex flex-col gap-5"}>
                    <div className={"flex flex-row gap-5 justify-center items-center relative text-gray-500 w-full"}>
                        <FaUser size={16} className={"absolute left-5"}/>
                        <Input
                            className={"w-80 h-16 pl-12 rounded-full py-2 border-2 focus:border-gray-700 focus:ring-[#EE7C9E]"}
                            placeholder={"Full Name"} maxLength={25} type={"text"}/>
                    </div>
                    <div className={"flex flex-row gap-5 justify-center items-center relative text-gray-500 w-full"}>
                        <MdEmail size={16} className={"absolute left-5"}/>
                        <Input
                            className={"w-80 h-16 pl-12 rounded-full py-2 border-2 focus:border-gray-700 focus:ring-[#EE7C9E]"}
                            placeholder={"Email"} maxLength={25} type={"email"}/>
                    </div>
                    <div className={"flex flex-row gap-5 justify-center items-center relative text-gray-500 w-full"}>
                        <FaLock size={16} className={"absolute left-5"}/>
                        <Input
                            className={"w-80 h-16 pl-12 rounded-full py-2 border-2 focus:border-gray-700 focus:ring-[#EE7C9E]"}
                            placeholder={"Password"} maxLength={25} type={"password"}/>
                    </div>
                </div>
                <div className={"w-52"}>
                    <p className={"text-xs"}>By continuing, you agree to our <b>Terms</b> and <b>Privacy Policy</b></p>
                </div>
                <Button size={'xl'} rounded={'max'} color={'pink'}>
                    <div className={"flex flex-row gap-1"}>
                        <p>Register</p>
                        <p className={"md:hidden"}>as a Customer</p>
                    </div>
                </Button>
                <Button size={'xl'} rounded={'max'} color={'black'}>
                    <FcGoogle/>
                    <p>Or Sign Up with Google</p>
                </Button>
                <div className='flex flex-row items-center justify-center gap-2 text-sm'>
                    <p className='font-light text-black'>Have an account?</p>
                    <Link to='/auth/login' className='font-light text-pink-400'>Sign In Now</Link>
                </div>
            </div>


        </div>
    );
}

export default CustomerRegister;