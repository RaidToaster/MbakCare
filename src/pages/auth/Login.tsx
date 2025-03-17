import { Input } from '@/components/ui/input'
import loginimage from '../../assets/images/login/login.png'
import logo from '../../assets/images/logo/logombak.svg'
import google from '../../assets/images/logo/google.svg'
import { Button } from '@/components/ui/button'
import { Lock, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'

function Login() {
    return (
        <div className="max-h-screen w-screen bg-[#F7F8F1] flex flex-col md:flex-row">
            {/* Left */}
            <div className="hidden md:block md:w-2/5 relative overflow-hidden">
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

            {/* Right */}
            <div className="sm:w-full min-h-screen md:w-3/5 flex items-center justify-center p-8 relative">
                <div className='absolute top-0 sm:translate-y-48 md:translate-y-10 z-10'>
                    <img
                        src={logo}
                        alt="Company Logo"
                        className='sm:h-32 md:h-64 w-auto'
                    />
                </div>

                <div className='bg-white flex flex-col items-center justify-center px-12 py-18 rounded-xl shadow-md border-opacity-5 border-1 border-[#8F9ABA] relative mt-16'>
                    <div className='flex items-center justify-center mb-4'>
                        <h2 className='font-semibold text-3xl'>Nice to see you again!</h2>
                    </div>
                    <div className='flex flex-col items-center justify-center gap-2 mb-6'>
                        <div className="relative w-full">
                            <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                            <Input className="rounded-3xl w-80 h-12 pl-10 border-[#8F9ABA]/30 focus:border-[#EE7C9E] focus:ring-[#EE7C9E]" type="email" placeholder="Email" />
                        </div>

                        <div className="relative w-full">
                            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                            <Input className="rounded-3xl w-80 h-12 pl-10 border-[#8F9ABA]/30 focus:border-[#EE7C9E] focus:ring-[#EE7C9E]" type="password" placeholder="Password" />
                        </div>
                    </div>

                    <div className='flex flex-col items-center justify-center gap-5 mb-6'>
                        <Button className='w-72 h-12 rounded-4xl bg-[#EE7C9E] hover:bg-pink-300 cursor-pointer font-medium'>
                            Login
                        </Button>

                        <div className="flex items-center w-full">
                            <div className="flex-grow h-px bg-gray-300"></div>
                            <span className="px-4 text-sm text-gray-500">or</span>
                            <div className="flex-grow h-px bg-gray-300"></div>
                        </div>

                        <Button className="w-full h-12 rounded-3xl bg-gray-800 border border-gray-300 hover:bg-gray-600 text-gray-800 cursor-pointer font-medium shadow-sm flex items-center justify-center gap-2 text-white">
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
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
        </div >
    )
}

export default Login

