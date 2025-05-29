import logo from "@/assets/images/logo/Broken White.png"
import icon from "@/assets/images/profile/Default.png"
import {RxHamburgerMenu} from "react-icons/rx";
import { motion } from "framer-motion";
import {IoClose} from "react-icons/io5";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

function NavigationBar() {

    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const isCustomer = false

    function toggleOpen() {
        setIsOpen(true)
    }

    function toggleClose() {
        setIsOpen(false)
    }

    function toProfile() {
        navigate('/profile')
    }

    return (
        <div className={`min-w-full max-w-screen fixed flex flex-row p-6 text-white z-40 ${isCustomer ? 'bg-[#EE7C9E]' : 'bg-[#996052]'}`}>
            <div className={"flex flex-row gap-10 items-center w-full lg:w-auto justify-between lg:justify-start"}>
                <button className={"flex lg:hidden flex-row gap-4 items-center"}>
                    <motion.div
                        initial={{rotate: 0}}
                        animate={{rotate: isOpen ? 180 : 0}}
                        transition={{duration: 0.3}}
                        className="cursor-pointer z-50"
                    >
                        {isOpen ? <IoClose size={32} onClick={toggleClose}/> :
                            <RxHamburgerMenu size={32} onClick={toggleOpen}/>}
                    </motion.div>
                    {isOpen && (
                        <motion.div
                            initial={{x: "-100%", opacity: 0}}
                            animate={isOpen ? {x: 0, opacity: 1} : {x: "-100%", opacity: 0}}
                            transition={{type: "spring", stiffness: 120, damping: 20}}
                            className={"z-100"}> Close
                        </motion.div>
                    )}
                </button>
                <div className={"flex flex-row gap-4 items-center justify-end lg:justify-start w-1/2 "}>
                    <img src={logo} alt={"Logo"} className={"w-16 h-16"}/>
                    <p className={"font-bold"}>MbakCare</p>
                </div>
            </div>
            <div className={"hidden lg:flex flex-row items-center gap-16 justify-end w-full"}>
                <div className={"flex flex-row gap-4 items-center justify-center"}>
                    <a href={"/home"}>Home</a>
                    <a href={"/search"}>Find Helper</a>
                    <a href={"/task/view"}>Task Manager</a>
                    <a href={"/payment-summary"}>Payments</a>
                    <a href={"/contracts"}>Contracts</a>
                    <a href={"/inbox/view"}>Inbox</a>
                </div>
                <div className={"cursor-pointer"} onClick={toProfile}>
                    <img src={icon} alt={"Profile"}
                         className={"h-16 w-16 p-0.5 rounded-full object-fit object-center border-2 border-[#492924]"}/>
                </div>
            </div>
            {isOpen && (
                <motion.div
                    initial={{x: "-100%", opacity: 0}}
                    animate={isOpen ? {x: 0, opacity: 1} : {x: "-100%", opacity: 0}}
                    transition={{type: "spring", stiffness: 120, damping: 20}}
                    className={`lg:hidden fixed left-0 top-0 z-40 flex flex-col gap-8 px-12 pt-24 pb-20 h-full w-1/2 shadow-xl ${isCustomer ? 'bg-[#EE7C9E]' : 'bg-[#996052]'}`}
                >
                    <div className={"flex flex-col gap-8 items-start justify-start w-full"}>
                        <a href={"/home"}>Home</a>
                        <a href={"/search"}>Find Helper</a>
                        <a href={"/task/view"}>Task Manager</a>
                        <a href={"/payment-summary"}>Payments</a>
                        <a href={"/contracts"}>Contracts</a>
                        <a href={"/inbox/view"}>Inbox</a>
                    </div>
                </motion.div>
            )}
        </div>
    );
}

export default NavigationBar;