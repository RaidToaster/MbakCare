import { Input } from '@/components/Inputer/Input.tsx'
import loginimage from '../../assets/images/login/login.png'
import logo from '../../assets/images/logo/Pink.png'
import { Button } from '@/components/Inputer/Button.tsx'
import { Lock, Mail } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { LoginForm } from '@/model/types.ts'
import { supabase } from '@/lib/supabase'
import { FcGoogle } from "react-icons/fc";
import { AuthService } from '@/lib/services/AuthService'


function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState<LoginForm>({
        email: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (error) setError(''); // Clear error when user types
    };

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>('');

    const handleLogin = async () => {
        setLoading(true);
        setError('');

        try {
            // AuthService.loginWithEmailPassword returns { user, session, error }
            // We are mainly interested if loginData.user exists (or if an error was thrown)
            const loginData = await AuthService.loginWithEmailPassword(form.email, form.password);

            if (loginData.user) {
                setLoading(false);
                navigate('/search');
            } else {
                setLoading(false);
                setError("Login succeeded but user data was not available. Please try again.");
            }
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred during login.");
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError('');
        try {
            await AuthService.signInWithGoogle();

        } catch (err: any) {
            setError(err.message || "Google Sign-In failed.");
            setLoading(false);
        }
    };

    const toHome = () => {
        navigate('/');
    };


    return (
        <div className="max-h-screen w-screen bg-[#FBF3EB] flex flex-col lg:flex-row">
            <div className="hidden lg:block lg:w-2/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#000000cb] to-transparent z-10"></div>
                <img
                    src={loginimage}
                    className="h-full w-full object-cover"
                    alt="Login Illustration"
                />
                <div className="absolute bottom-10 left-10 text-white z-20">
                    <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
                    <p className="text-lg opacity-90">We're excited to see you again!</p>
                </div>
            </div>

            <div className="w-full min-h-screen lg:w-3/5 flex flex-col items-center justify-center p-8 gap-16">
                <div className='z-10'>
                    <img
                        src={logo}
                        alt="Company Logo"
                        className='h-32 lg:h-64 w-auto'
                        onClick={toHome}
                    />
                </div>

                <div className='flex flex-col items-center justify-center px-12'>
                    <div className='flex items-center justify-center mb-4'>
                        <h2 className='font-semibold text-3xl'>Nice to see you again!</h2>
                    </div>
                    <div className='flex flex-col items-center justify-center gap-2 mb-6 relative'>
                        <div className="w-full flex items-center">
                            <Mail className="absolute left-4 text-gray-400" size={18} />
                            <Input
                                serial={'auth'}
                                name="email"
                                type="email"
                                placeholder="Email"
                                value={form.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="w-full flex items-center">
                            <Lock className="absolute left-4 text-gray-400" size={18} />
                            <Input
                                serial={'auth'}
                                name="password"
                                type="password"
                                placeholder="Password"
                                value={form.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className='flex flex-col items-center justify-center gap-5 mb-6'>
                        <Button onClick={handleLogin} className='cursor-pointer font-medium' color={'pink'} rounded={'max'} size={'xl'}>
                            Login
                        </Button>

                        <div className="flex items-center w-full">
                            <div className="flex-grow h-px bg-gray-300"></div>
                            <span className="px-4 text-sm text-gray-500">or</span>
                            <div className="flex-grow h-px bg-gray-300"></div>
                        </div>

                        <Button className="border-gray-300  cursor-pointer font-medium shadow-sm flex items-center justify-center gap-2 "
                            color={'black'} rounded={'max'} size={'xl'}>
                            <FcGoogle />
                            Sign in with Google
                        </Button>
                    </div>
                    <div className='flex flex-col items-center justify-center gap-5'>
                        <div className='flex flex-row items-center justify-center gap-2'>
                            <p className='font-light'>Don't have an account?</p>
                            <Link to='/auth/register' className='font-light text-[#EE7C9E]'>Register Now</Link>
                        </div>
                        <div>
                            <Link className='font-light text-[#EE7C9E]' to='/forgot'>Forgot Password?</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login

