import logo from "@/assets/images/logo/Broken White.png"
import icon from "@/assets/images/profile/Default.png"
import {RxHamburgerMenu} from "react-icons/rx";
import React from "react";
import { motion } from "framer-motion";
import {IoClose} from "react-icons/io5";

function NavigationBar() {

    const [isOpen, setIsOpen] = React.useState(false);

    function toggleOpen() {
        setIsOpen(true)
    }

    function toggleClose() {
        setIsOpen(false)
    }

    return (
        <div className={"min-w-full max-w-screen fixed flex flex-row p-6 bg-[#EE7C9E] text-white z-40"}>
            <div className={"flex flex-row gap-10 items-center w-full md:w-auto justify-between md:justify-start"}>
                <button className={"flex md:hidden flex-row gap-4 items-center"}>
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
                <div className={"flex flex-row gap-4 items-center justify-center md:justify-start w-1/2 "}>
                    <img src={logo} alt={"Logo"} className={"w-16 h-16"}/>
                    <p className={"font-bold"}>MbakCare</p>
                </div>
            </div>
            <div className={"hidden md:flex flex-row items-center gap-16 justify-end w-full"}>
                <div className={"flex flex-row gap-4 items-center justify-center"}>
                    <a href={"/home"}>Home</a>
                    <a href={"/dashboard"}>Dashboard</a>
                    <a href={"/search"}>Find Helper</a>
                    <a href={"/task-manager"}>Task Manager</a>
                    <a href={"/payment-summary"}>Payments</a>
                    <a href={"/contracts"}>Contracts</a>
                </div>
                <div>
                    <img src={icon} alt={"Profile"}
                         className={"h-16 w-16 p-0.5 rounded-full object-fit object-center border-2 border-white"}/>
                </div>
            </div>
            {isOpen && (
                <motion.div
                    initial={{x: "-100%", opacity: 0}}
                    animate={isOpen ? {x: 0, opacity: 1} : {x: "-100%", opacity: 0}}
                    transition={{type: "spring", stiffness: 120, damping: 20}}
                    className="fixed left-0 top-0 bg-[#EE7C9E] z-40 flex flex-col gap-8 px-12 pt-24 pb-20 rounded-br-xl shadow-xl"
                >
                    <div className={"flex flex-col gap-4 items-start justify-start"}>
                        <a href={"/home"}>Home</a>
                        <a href={"/dashboard"}>Dashboard</a>
                        <a href={"/search"}>Find Helper</a>
                        <a href={"/task-manager"}>Task Manager</a>
                        <a href={"/payment-summary"}>Payments</a>
                        <a href={"/contracts"}>Contracts</a>
                    </div>
                </motion.div>
            )}
        </div>
    );
}

export default NavigationBar;