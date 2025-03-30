import logo from "../../assets/images/logo/Pink.png"
import customer from "../../assets/images/main/Customer Image.png"
import helper from "../../assets/images/main/Helper Image.png"
import {Link, useNavigate} from "react-router-dom";

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
        <div className={"w-screen h-screen relative flex justify-center items-center"}>
            <div className={"absolute p-8 bg-white rounded-full shadow-md"} onClick={redirectHome}>
                <img src={logo} alt="logo" className={" h-32"}/>
            </div>
            <div className={"w-screen h-screen flex flex-row items-center justify-center"}>
                <div className={"bg-[#EE7C9E] w-1/2 h-full flex flex-col justify-center items-center gap-8"}>
                    <h1 className={"font-bold text-4xl text-white"}>I'm Here for Hiring</h1>
                    <img src={customer} className={"h-80"} alt="Customer Img"/>
                    <button className={"bg-white px-16 py-4 rounded-full border-2 border-black w-1/2"} onClick={redirectCustomer}>Sign Up as Customer</button>
                    <div className='flex flex-row items-center justify-center gap-2 text-white text-sm'>
                        <p className='font-light'>Have an account?</p>
                        <Link to='/auth/login' className='font-light underline'>Sign In Now</Link>
                    </div>
                </div>
                <div className={"bg-[#FFE5E7] w-1/2 h-full flex flex-col justify-center items-center gap-8"}>
                    <h1 className={"font-bold text-4xl text-black"}>I'm Here for Seeking Job</h1>
                    <img src={helper} className={"h-80"} alt="Helper Img"/>
                    <button className={"bg-white px-16 py-4 rounded-full border-2 border-black w-1/2"} onClick={redirectHelper}>Sign Up as Helper</button>
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