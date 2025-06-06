import { Input } from '@/components/Inputer/Input.tsx'
import logo from '../../assets/images/logo/Pink.png'
import { Button } from '@/components/Inputer/Button.tsx'
import { Mail, Lock, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SignUpForm } from '@/model/types.ts'
import { useState } from 'react'
import { supabase } from '@/lib/supabase.ts'

function Register() {
    const [form, setForm] = useState<SignUpForm>({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSignUp = async () => {
        setLoading(true)
        setError(null)

        const { data: { user }, error: authError } = await supabase.auth.signUp({
            email: form.email,
            password: form.password,
            options: {
                data: {
                    name: form.name
                }
            }
        })

        if (authError) {
            console.error('authError:', authError);
            setError(authError.message)
            setLoading(false)
            return
        }

        const { data: checkUser, error: dbError } = await supabase.from('users').select('id').match({ email: user?.email })
        console.log(dbError);

        if (checkUser && checkUser.length > 0) {
            setError('User already exists')
            setLoading(false)
            return
        }

        const { data, error } = await supabase.from('users').insert({
            id: user?.id,
            name: form.name,
            email: user?.email,
        })

        if (error) {
            console.error('dbError:', error);
            setError(error.message);
        } else {
            console.log('User created and data inserted:', data);
        }
        setLoading(false);
    }

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
                        <div className="relative w-full">
                            <User className="absolute left-3 top-3 text-gray-400" size={18} />
                            <Input className="rounded-3xl w-80 h-12 pl-10 border-[#8F9ABA]/30 focus:border-[#EE7C9E] focus:ring-[#EE7C9E]" type="text" placeholder="Full Name" name="name" value={form.name} onChange={handleChange} />
                        </div>

                        <div className="relative w-full">
                            <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                            <Input className="rounded-3xl w-80 h-12 pl-10 border-[#8F9ABA]/30 focus:border-[#EE7C9E] focus:ring-[#EE7C9E]" type="email" placeholder="Email" name="email" value={form.email} onChange={handleChange} />
                        </div>

                        <div className="relative w-full">
                            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                            <Input className="rounded-3xl w-80 h-12 pl-10 border-[#8F9ABA]/30 focus:border-[#EE7C9E] focus:ring-[#EE7C9E]" type="password" placeholder="Password" name="password" value={form.password} onChange={handleChange} />
                        </div>

                        <div className="relative w-full">
                            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                            <Input className="rounded-3xl w-80 h-12 pl-10 border-[#8F9ABA]/30 focus:border-[#EE7C9E] focus:ring-[#EE7C9E]" type="password" placeholder="Confirm Password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} />
                        </div>
                    </div>

                    <div className='flex flex-col items-center justify-center gap-5 mb-6'>
                        <Button onClick={handleSignUp} className='w-72 h-12 rounded-4xl bg-[#EE7C9E] hover:bg-pink-300 cursor-pointer font-medium'>
                            Register
                        </Button>

                        <div className="flex items-center w-full">
                            <div className="flex-grow h-px bg-gray-300"></div>
                            <span className="px-4 text-sm text-gray-500">or</span>
                            <div className="flex-grow h-px bg-gray-300"></div>
                        </div>

                        <Button className='w-72 h-12 rounded-3xl bg-gray-800 border border-gray-300 hover:bg-gray-600 cursor-pointer font-medium text-white'>
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Sign up with Google
                        </Button>
                    </div>
                    <div className='flex flex-col items-center justify-center gap-5 mb-6'>
                        <div className='flex flex-row items-center justify-center gap-2'>
                            <p className='font-light'>Already have an account?</p>
                            <Link to='/auth/login' className='font-light text-[#EE7C9E]'>Login Now</Link>
                        </div>
                    </div>

                    <div className="mt-2 text-center text-xs text-gray-500">
                        <p>By creating an account, you agree to our</p>
                        <p><Link to="/terms" className="text-[#EE7C9E] hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-[#EE7C9E] hover:underline">Privacy Policy</Link></p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register

