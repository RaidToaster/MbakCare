import logo from "../../assets/images/logo/Pink.png"
import customer from "../../assets/images/main/Customer Image.png"
import helper from "../../assets/images/main/Helper Image.png"
import {Link, useNavigate} from "react-router-dom";
import {Button} from "@/components/InfoComponent/button.tsx";

function MainRegister() {
    const navigate = useNavigate();
    function redirectCustomer(){
        navigate("/auth/register-customer")
    }

    function redirectHelper(){
        navigate("/auth/register-helper")
    }

    function redirectHome(){
        navigate("/home")
    }
    return (
        <div className={"w-screen md:h-screen relative flex justify-center items-center"}>
            <div className={"absolute p-4 md:p-8 bg-white rounded-full shadow-md"} onClick={redirectHome}>
                <img src={logo} alt="logo" className={"h-16 md:h-32"}/>
            </div>
            <div className={"w-screen md:h-screen flex flex-col md:flex-row items-center justify-center"}>
                <div className={"bg-[#EE7C9E] w-full md:w-1/2 h-full flex flex-col justify-center items-center gap-8 py-16 md:py-0"}>
                    <h1 className={"font-bold text-2xl md:text-4xl text-white text-center"}>I'm Here for Hiring</h1>
                    <img src={customer} className={"h-64 md:h-80"} alt="Customer Img"/>
                    <Button className={"text-md"} size={'super'} onClick={redirectCustomer} color={'white'} rounded={'max'}>Sign Up as Customer</Button>
                    <div className='flex flex-row items-center justify-center gap-2 text-white text-sm'>
                        <p className='font-light'>Have an account?</p>
                        <Link to='/auth/login' className='font-light underline'>Sign In Now</Link>
                    </div>
                </div>
                <div className={"bg-[#FFE5E7] w-full md:w-1/2 h-full flex flex-col justify-center items-center gap-8 py-16 md:py-0"}>
                    <h1 className={"font-bold text-2xl md:text-4xl text-black text-center"}>I'm Here for Seeking Job</h1>
                    <img src={helper} className={"h-64 md:h-80"} alt="Helper Img"/>
                    <Button className={"text-md"} size={'super'} onClick={redirectHelper} color={'white'} rounded={'max'}>Sign Up as Helper</Button>
                    <div className='flex flex-row items-center justify-center gap-2 text-black text-sm'>
                        <p className='font-light'>Have an account?</p>
                        <Link to='/auth/login' className='font-light underline'>Sign In Now</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainRegister;