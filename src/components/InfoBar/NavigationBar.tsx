import logo from "@/assets/images/logo/Broken White.png";
import defaultProfileIcon from "@/assets/images/profile/Default.png";
import { RxHamburgerMenu } from "react-icons/rx";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthService } from "@/lib/services/AuthService";
import { useAuthCt } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";

function NavigationBar() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const { user, userRole, isLoading: isAuthLoading, isRoleLoading } = useAuthCt();

    const [profileImageUrl, setProfileImageUrl] = useState<string>(defaultProfileIcon);

    useEffect(() => {
        const fetchProfilePic = async () => {
            if (user && user.id) {
                try {
                    const { data: userData, error: userError } = await supabase
                        .from('users')
                        .select('profile_picture')
                        .eq('id', user.id)
                        .single();

                    if (userError && userError.code !== 'PGRST116') {
                        console.error("Error fetching user profile picture:", userError.message);
                        setProfileImageUrl(defaultProfileIcon);
                    } else if (userData?.profile_picture) {
                        setProfileImageUrl(userData.profile_picture);
                    } else {
                        setProfileImageUrl(defaultProfileIcon);
                    }
                } catch (e) {
                    console.error("Exception fetching profile picture:", e);
                    setProfileImageUrl(defaultProfileIcon);
                }
            } else {
                setProfileImageUrl(defaultProfileIcon);
            }
        };

        if (!isAuthLoading) {
            fetchProfilePic();
        }

    }, [user, isAuthLoading]);

    function togglePopup() {
        setIsOpen(!isOpen);
    }

    function toProfile() {
        if (user) {
            navigate(`/profile`);
        } else {
            navigate('/auth/login');
        }
    }

    async function handleLogout() {
        try {
            await AuthService.signOut();
            navigate('/auth/login');
        } catch (error) {
            console.error("Logout failed:", error);
        }
    }

    const showLoadingNavbar = isAuthLoading || (user && isRoleLoading);
    const isCustomer = userRole === 'customer';

    const navLinks = isCustomer ? [
        { path: "/home", label: "Home" },
        { path: "/search", label: "Find Helper" },
        { path: "/task/view", label: "Task Manager" },
        { path: "/payment-summary", label: "Payments" },
        { path: "/inbox/view", label: "Inbox" },
    ] : [
        { path: "/home", label: "Home" },
        { path: "/search", label: "Find Job" },
        { path: "/task/view", label: "Task Manager" },
        { path: "/payment-summary", label: "Payments" },
        { path: "/inbox/view", label: "Inbox" },
    ];

    if (showLoadingNavbar && !user) {
        return (
            <div className={`min-w-full max-w-screen fixed flex flex-row p-4 md:p-6 text-white z-40 shadow-md bg-gray-500 animate-pulse`}>
                <div className="flex flex-row gap-6 md:gap-10 items-center w-full lg:w-auto justify-between lg:justify-start">
                    <div className="h-8 w-8 bg-gray-400 rounded-md lg:hidden"></div>
                    <div className="flex flex-row gap-2 md:gap-4 items-center">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-400 rounded-full"></div>
                        <div className="h-6 w-24 bg-gray-400 rounded"></div>
                    </div>
                </div>
                <div className="hidden lg:flex flex-row items-center gap-8 md:gap-12 justify-end w-full">
                    <div className="flex flex-row gap-4 md:gap-6 items-center">
                        {[...Array(5)].map((_, i) => <div key={i} className="h-5 w-20 bg-gray-400 rounded"></div>)}
                    </div>
                    <div className="h-12 w-12 md:h-14 md:w-14 bg-gray-400 rounded-full"></div>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-w-full max-w-screen fixed flex flex-row p-4 md:p-6 text-white z-40 shadow-md 
            ${isCustomer ? 'bg-[#EE7C9E]' : 'bg-[#996052]'} 
            transition-colors duration-200 ease-in-out`}
        >
            <div className={"flex flex-row gap-6 md:gap-10 items-center w-full lg:w-auto justify-between lg:justify-start"}>
                <button className={"flex lg:hidden flex-row gap-3 items-center cursor-pointer"} onClick={togglePopup}>
                    <motion.div
                        initial={{ rotate: 0 }}
                        animate={{ rotate: isOpen ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="z-50"
                    >
                        {isOpen ? <IoClose size={28} /> : <RxHamburgerMenu size={28} />}
                    </motion.div>
                </button>
                <Link to="/home" className={"flex flex-row gap-2 md:gap-4 items-center justify-end lg:justify-start"}>
                    <img src={logo} alt={"Logo"} className={"w-12 h-12 md:w-16 md:h-16"} />
                    <p className={"font-bold text-lg md:text-xl"}>MbakCare</p>
                </Link>
            </div>

            <div className={"hidden lg:flex flex-row items-center gap-8 md:gap-12 justify-end w-full"}>
                <nav className={"flex flex-row gap-4 md:gap-6 items-center justify-center"}>
                    {navLinks.map(link => (
                        <Link key={link.path} to={link.path} className="hover:text-gray-200 transition-colors">{link.label}</Link>
                    ))}
                </nav>
                {user ? ( // Use user from context
                    <div className="relative group">
                        <img src={profileImageUrl} alt={"Profile"}
                            className={"h-12 w-12 md:h-14 md:w-14 p-0.5 rounded-full object-cover border-2 border-white/80 cursor-pointer"}
                            onClick={toProfile}
                        />
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out transform scale-95 group-hover:scale-100 origin-top-right">
                            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">My Profile</Link>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer "
                                    role="menuitem"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <Link to="/auth/login" className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-md transition-colors">Login</Link>
                )}
            </div>
            {isOpen && (
                <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className={`lg:hidden fixed left-0 top-0 pt-20 z-30 flex flex-col gap-6 px-8 pb-8 h-full w-3/4 max-w-xs shadow-xl ${isCustomer ? 'bg-[#EE7C9E]' : 'bg-[#996052]'}`}
                >
                    {user && ( // Use user from context
                        <div className="flex flex-col items-center mb-4 border-b border-white/20 pb-4">
                            <img src={profileImageUrl} alt="Profile" className="h-20 w-20 rounded-full object-cover border-2 border-white mb-2" />
                            <p className="font-semibold text-lg truncate max-w-[calc(100%-2rem)]">{user.email}</p>
                            <Link to="/profile" className="text-sm hover:underline mt-1" onClick={togglePopup}>View Profile</Link>
                        </div>
                    )}
                    <nav className={"flex flex-col gap-4 items-start justify-start w-full text-lg"}>
                        {navLinks.map(link => (
                            <Link key={link.path} to={link.path} className="py-2 hover:text-gray-200 w-full" onClick={togglePopup}>{link.label}</Link>
                        ))}
                    </nav>
                    <div className="mt-auto border-t border-white/20 pt-4">
                        {user ? (
                            <button
                                onClick={() => { togglePopup(); }}
                                className="w-full text-left py-2 text-lg cursor-pointer hover:text-gray-200"
                            >
                                Logout
                            </button>
                        ) : (
                            <Link to="/auth/login" className="py-2 text-lg hover:text-gray-200 w-full" onClick={togglePopup}>Login</Link>
                        )}
                    </div>
                </motion.div>
            )}
        </div>
    );
}

export default NavigationBar;