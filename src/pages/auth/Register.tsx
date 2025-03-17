import { Input } from '@/components/ui/input'
import loginimage from '../../assets/images/login/login.png'
import logo from '../../assets/images/logo/logombak.svg'
import { Button } from '@/components/ui/button'
import { Mail } from 'lucide-react'
import { Link } from 'react-router-dom'

function Register() {
    return (
        <div className="max-h-screen w-screen bg-[#F7F8F1] flex flex-col md:flex-row">
            <div className="sm:w-full min-h-screen md:w-full flex items-center justify-center p-8 relative">
                <div className='bg-white flex flex-col items-center justify-center px-24 py-12 rounded-xl shadow-md border-opacity-5 border-1 border-[#8F9ABA] relative'>
                    <div className='z-10'>
                        <img
                            src={logo}
                            alt="Company Logo"
                            className='sm:h-32 md:h-48 w-auto'
                        />
                    </div>
                    <div className='flex items-center justify-center mb-4'>
                        <h2 className='font-semibold text-3xl'>Register Now!</h2>
                    </div>
                    <div className='flex flex-col items-center justify-center gap-2 mb-6'>
                        <Input className='rounded-3xl w-80 h-12' type='text' placeholder='Full Name'></Input>
                        <Input className='rounded-3xl w-80 h-12' type='email' placeholder='Email'></Input>
                        <Input className='rounded-3xl w-80 h-12' type='password' placeholder='Password'></Input>
                        <Input className='rounded-3xl w-80 h-12' type='password' placeholder='Confirm Password'></Input>
                    </div>

                    <div className='flex flex-col items-center justify-center gap-5 mb-6'>
                        <Button className='w-72 h-12 rounded-4xl bg-[#EE7C9E] hover:bg-pink-300 cursor-pointer font-medium'>
                            Register
                        </Button>

                        <Button className='w-72 h-12 rounded-4xl bg-black hover:bg-gray-800 cursor-pointer font-medium'>
                            Or Sign up with Google
                        </Button>
                    </div>
                    <div className='flex flex-col items-center justify-center gap-5 mb-6'>
                        <div className='flex flex-row items-center justify-center gap-2'>
                            <p className='font-light'>Already have an account?</p>
                            <Link to='/auth/login' className='font-light text-[#EE7C9E]'>Login Now</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register

