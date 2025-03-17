import { Input } from '@/components/ui/input'
import loginimage from '../../assets/images/login/login.png'
import logo from '../../assets/images/logo/logombak.svg'
import { Button } from '@/components/ui/button'
import { Mail } from 'lucide-react'
import { Link } from 'react-router-dom'

function Login() {
    return (
        <div className="h-screen w-screen bg-[#F7F8F1] flex flex-col md:flex-row">
            {/* Left */}
            <div className="hidden md:block md:w-2/5  items-center justify-center">
                <img
                    src={loginimage}
                    className="h-full w-full object-cover"
                    alt="Login Illustration"
                />
            </div>

            {/* Right */}
            <div className="sm:w-full h-screen md:w-3/5 flex items-center justify-center p-8 relative">
                <div className='absolute top-0 translate-y-16 z-10'>
                    <img
                        src={logo}
                        alt="Company Logo"
                        className='h-64 w-auto'
                    />
                </div>

                <div className='bg-white flex flex-col items-center justify-center p-24 rounded-xl shadow-md border-opacity-5 border-1 border-[#8F9ABA] relative mt-16'> {/* Added mt-16 for spacing */}
                    <div className='flex items-center justify-center mb-4'>
                        <h2 className='font-semibold text-3xl'>Nice to see you again!</h2>
                    </div>
                    <div className='flex flex-col items-center justify-center gap-2 mb-6'>
                        <Input className='rounded-3xl w-80 h-12' type='email' placeholder='Email'></Input>
                        <Input className='rounded-3xl w-80 h-12' type='password' placeholder='Password'></Input>
                    </div>

                    <div className='flex flex-col items-center justify-center gap-5 mb-6'>
                        <Button className='w-72 h-12 rounded-4xl bg-pink-400 hover:bg-pink-300 cursor-pointer font-medium'>
                            Login
                        </Button>

                        <Button className='w-72 h-12 rounded-4xl bg-black hover:bg-gray-800 cursor-pointer font-medium'>
                            Or Sign up with Google
                        </Button>
                    </div>
                    <div className='flex flex-col items-center justify-center gap-5 mb-6'>
                        <div className='flex flex-row items-center justify-center gap-2'>
                            <p className='font-light'>Don't have an account?</p>
                            <Link className='font-light text-pink-400' to='/register'>Register Now</Link>
                        </div>
                        <div>
                            <Link className='font-light text-pink-400' to='/forgot'>Forgot Password?</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login

