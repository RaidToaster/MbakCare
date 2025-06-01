import { useState } from "react";
import customer from "../../assets/images/main/Customer Image.png";
import { Link, useNavigate } from "react-router-dom";
import logo from "@/assets/images/logo/Pink.png";
import { FaLock, FaUser } from "react-icons/fa";
import { Input } from "@/components/Inputer/Input.tsx";
import { MdEmail } from "react-icons/md";
import { Button } from "@/components/Inputer/Button.tsx";
import { FcGoogle } from "react-icons/fc";
import { TbArrowBackUp } from "react-icons/tb";
import { AuthService } from "@/lib/services/AuthService";
import { z } from "zod";

const schema = z.object({
    name: z.string().nonempty("Full name is required").max(25, "Full name must be at most 25 characters"),
    email: z.string().nonempty("Email is required").email("Invalid email format").max(25, "Email must be at most 25 characters"),
    password: z.string().nonempty("Password is required").min(6, "Password must be at least 6 characters").max(25, "Password must be at most 25 characters"),
});

function CustomerRegister() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [authError, setAuthError] = useState("");

    function backTrack() {
        navigate("/auth/register");
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handleRegister = async () => {
        setAuthError("");

        const result = schema.safeParse(formData);
        if (!result.success) {
            const fieldErrors: Record<string, string> = {};
            result.error.errors.forEach(({ path, message }) => {
                if (path.length > 0) {
                    fieldErrors[path[0]] = message;
                }
            });
            setErrors(fieldErrors);
            return;
        } else {
            setErrors({});
        }

        setLoading(true);

        try {
            await AuthService.registerCustomer(formData.name, formData.email, formData.password);
            navigate("/auth/login");
        } catch (error: any) {
            console.error("Registration error:", error);
            setAuthError(error.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={"flex flex-row w-screen h-screen"}>
            <div className={"w-1/2 hidden lg:flex"}>
                <div className={"w-full bg-[#EE7C9E] flex flex-col justify-center items-center gap-8"}>
                    <h1 className={"font-bold text-4xl text-white"}>I'm Here for Hiring</h1>
                    <img src={customer} className={"h-80"} alt="Customer Img" />
                </div>
            </div>

            <div className={"w-full lg:w-1/2 bg-white flex flex-col justify-center items-center text-center gap-6 relative"}>
                <TbArrowBackUp className={"absolute right-5 top-5"} size={64} onClick={backTrack} />
                <img src={logo} alt="MbakCare Logo" className={"h-32"} />
                <h1 className={"text-4xl font-bold"}>Hello There!<br />Nice to Know You</h1>
                {authError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded w-80">
                        {authError}
                    </div>
                )}
                <div className={"flex flex-col gap-5"}>
                    <div className={"flex flex-row gap-5 justify-center items-center relative text-gray-500 w-full"}>
                        <FaUser size={16} className={"absolute left-5"} />
                        <Input
                            serial={'auth'}
                            name="name"
                            placeholder={"Full Name"}
                            maxLength={25}
                            type={"text"}
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                    {errors.name && (
                        <p className="text-red-500 text-xs text-left mt-1 pl-6 w-80">{errors.name}</p>
                    )}
                    <div className={"flex flex-row gap-5 justify-center items-center relative text-gray-500 w-full"}>
                        <MdEmail size={16} className={"absolute left-5"} />
                        <Input
                            serial={'auth'}
                            name="email"
                            placeholder={"Email"}
                            maxLength={25}
                            type={"email"}
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    {errors.email && (
                        <p className="text-red-500 text-xs text-left mt-1 pl-6 w-80">{errors.email}</p>
                    )}
                    <div className={"flex flex-row gap-5 justify-center items-center relative text-gray-500 w-full"}>
                        <FaLock size={16} className={"absolute left-5"} />
                        <Input
                            serial={'auth'}
                            name="password"
                            placeholder={"Password"}
                            maxLength={25}
                            type={"password"}
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                    {errors.password && (
                        <p className="text-red-500 text-xs text-left mt-1 pl-6 w-80">{errors.password}</p>
                    )}
                </div>
                <div className={"w-52"}>
                    <p className={"text-xs"}>By continuing, you agree to our <b>Terms</b> and <b>Privacy Policy</b></p>
                </div>
                <Button size={'xl'} rounded={'max'} color={'pink'} onClick={handleRegister} disabled={loading}>
                    <div className={"flex flex-row gap-1"}>
                        <p>Register</p>
                        <p className={"lg:hidden"}>as a Customer</p>
                    </div>
                </Button>
                <Button size={'xl'} rounded={'max'} color={'black'}>
                    <FcGoogle />
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
