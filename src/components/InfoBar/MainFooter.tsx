import { FaFacebook, FaInstagram, FaTiktok, FaTwitter } from "react-icons/fa";
import logo from "../../assets/images/logo/Broken White.png";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { AuthService } from "@/lib/services/AuthService";
import { Link } from "react-router-dom";

type UserRole = 'customer' | 'helper' | 'admin';

const MainFooter = () => {
    const [isCustomer, setIsCustomer] = useState<boolean>(false);

    useEffect(() => {
        const fetchUserRole = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const user = session?.user;

            if (user) {
                const role: UserRole | null = await AuthService.getUserRole(user.id);
                setIsCustomer(role === 'customer');
            } else {
                setIsCustomer(false);
            }
        };

        fetchUserRole();

        const { data: authListener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                fetchUserRole();
            }
        );

        return () => {
            authListener?.subscription.unsubscribe();
        };
    }, []);

    return (
        <div className="min-w-full max-w-screen">
            <div className={`flex flex-col gap-12 md:gap-16 px-8 sm:px-16 md:px-24 lg:px-32 py-8 text-white text-sm ${isCustomer ? 'bg-[#EE7C9E]' : 'bg-[#996052]'}`}>
                <div className={"flex flex-col gap-12 lg:flex-row justify-center lg:justify-between items-start"}>
                    <div className={"flex flex-col gap-6 lg:gap-4 w-full lg:w-2/5 items-center text-center lg:items-start lg:text-left"} >
                        <Link to="/home" className={"flex flex-row gap-3 md:gap-4 items-center justify-center lg:justify-start w-full"}>
                            <img src={logo} alt={"Logo"} className={"w-12 h-12 md:w-16 md:h-16"}/>
                            <p className={"font-bold text-lg md:text-xl"}>MbakCare</p>
                        </Link>
                        <div className={"flex flex-col gap-4 w-full"}>
                            <p>MbakCare is a reliable service connection platform that bridges customers with trusted household helpers, offering a seamless experience through structured task management, ratings, and professional development features.</p>
                        </div>
                    </div>
                    <div className={"flex flex-col sm:flex-row lg:flex-col gap-4 sm:gap-8 lg:gap-4 font-semibold text-center lg:text-left w-full sm:justify-center lg:justify-start lg:items-start lg:w-auto"}>
                        <Link to="/tutorials" className="hover:underline">TUTORIALS</Link>
                        <Link to="/faqs" className="hover:underline">FAQS</Link>
                        <Link to="/terms-of-service" className="hover:underline">TERMS OF SERVICE</Link>
                        <Link to="/contact-us" className="hover:underline">CONTACT US</Link>
                    </div>
                    <div className={"flex flex-col gap-4 text-center lg:text-left justify-center items-center lg:items-start lg:justify-start lg:w-auto"}>
                        <p className={"font-bold"}>FOLLOW US</p>
                        <p>Yes, we are social</p>
                        <div className={"w-full flex flex-row gap-4 justify-center lg:justify-start items-center"}>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram className={"text-white w-7 h-7 md:w-8 md:h-8 hover:opacity-80"}/></a>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook className={"text-white w-7 h-7 md:w-8 md:h-8 hover:opacity-80"}/></a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter className={"text-white w-7 h-7 md:w-8 md:h-8 hover:opacity-80"}/></a>
                            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer"><FaTiktok className={"text-white w-7 h-7 md:w-8 md:h-8 hover:opacity-80"}/></a>
                        </div>
                    </div>
                </div>
                <div className="border-t-2 border-white/30 flex flex-col sm:flex-row text-center justify-center items-center gap-2 sm:gap-8 py-6 text-xs sm:text-sm text-white/90">
                    <p>©{new Date().getFullYear()} MbakCare. All Rights Reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default MainFooter;