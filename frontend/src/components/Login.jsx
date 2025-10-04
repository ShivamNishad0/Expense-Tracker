import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { BUTTON_CLASSES, INPUTWRAPPER } from '../assets/dummy';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';

const INITIAL_FORM = { email: "", password: "" };

const Toast = ({ message, type, onClose }) => {
  const baseClasses = "fixed bottom-4 right-4 z-50 p-4 rounded-md shadow-lg text-white font-semibold transition-transform transform duration-300";
  const typeClasses = type === "success" ? "bg-green-500" : "bg-red-500";
  return (
    <div className={`${baseClasses} ${typeClasses} translate-x-0`}>
      {message}
      <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">
        &times;
      </button>
    </div>
  );
};

const Login = ({ onSubmit, onSwitchMode }) => {
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState(INITIAL_FORM)
    const [rememberMe, setRememberMe] = useState(false)
    //const [message, setMessage] = useState(false);
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const API_URL = import.meta.env.VITE_API_BASE_URL || "https://task-tracker-backend-vtvb.onrender.com/";

    
    useEffect(() => {
      const token = localStorage.getItem("token")
      const userId = localStorage.getItem("userId")

      if (token) {
        (async () => {
          try {
            const { data } = await axios.get(`${API_URL}/api/user/me`, {
              headers: { Authorization: `Bearer ${token}` },
            })

            if (data.success) {
              onSubmit?.({ token, userId, ...data.user })
              toast.success("Session restored. Redirecting...")
              navigate('/')
            } else {
              localStorage.clear()
            }
          } catch{

            localStorage.clear()
          }
        })()
      }
    }, [navigate, onSubmit])

    useEffect(() => {
      const token = searchParams.get('token')
      if (token) {
        localStorage.setItem("token", token)
        // Fetch user data
        (async () => {
          try {
            const { data } = await axios.get(`${API_URL}/api/user/me`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            if (data.success) {
              localStorage.setItem("userId", data.user.id)
              onSubmit?.({ token, userId: data.user.id, ...data.user })
              toast.success("Login successful! Redirecting...")
              navigate('/')
            }
          } catch (err) {
            toast.error("OAuth login failed")
          }
        })()
      }
    }, [searchParams, navigate, onSubmit, API_URL])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!rememberMe) {
            toast.error("You must agree to remember me to proceed.")
            return
        }
        setLoading(true);
        try {
            const { data } = await axios.post(`${API_URL}/api/user/login`, formData)
            if (!data.token) throw new Error(data.message || "Login failed")
            localStorage.setItem("token", data.token)
            localStorage.setItem("userId", data.user.id)
            setFormData(INITIAL_FORM)
            onSubmit?.({ token: data.token, userId: data.user.id, ...data.user })
            toast.success("Login successful! Redirecting...")
            setTimeout(() => navigate("/"), 1000)
        } catch (err) {
            const msg = err.response?.data?.message || err.message
            toast.error(msg)
        } finally {
            setLoading(false)
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSwitchMode = () => {
        toast.dismiss();
        onSwitchMode?.()
    }

    const fields = [
        {
            name: "email",
            type: "email",
            placeholder: "Email",
            icon: Mail,
        },
        {
            name: "password",
            type: showPassword ? "text" : "password",
            placeholder: "Password",
            icon: Lock,
            isPassword: true,
        },
    ];

    return (
        <div className="min-h-screen w-screen flex items-center justify-center bg-gray-100">
            <div className='max-w-md w-full bg-white shadow-lg border border-purple-100 rounded-xl p-8'>
               <ToastContainer position="top-center" autoClose={3000} hideProgressBar />

                  <div className='mb-6 text-center'>
                    <div className='w-16 h-16 bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded-full mx-auto flex items-center justify-center mb-4'>
                        <LogIn className='w-8 h-8 text-white' />
                    </div>
                    <h2 className='text-2xl font-bold text-gray-800'>
                        Welcome Back!
                    </h2>
                    <p className='text-gray-500 text-sm mt-1'>Sign in to continue to Task Tracker</p>
                </div>
                <form onSubmit={handleSubmit} className='space-y-4'>
                    {fields.map(({ name, type, placeholder, icon: Icon, isPassword }) => (
                        <div key={name} className={INPUTWRAPPER}>
                            <Icon className='text-purple-500 w-5 h-5 mr-2' />
                            <input
                                type={type}
                                placeholder={placeholder}
                                value={formData[name]}
                                onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
                                className='w-full focus:outline-none text-sm text-gray-700'
                                required
                            />
                            {isPassword && (
                                <button type='button' onClick={() => setShowPassword(prev => !prev)} className='ml-2 text-gray-500 hover:text-purple-500 transition-colors'>
                                    {showPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
                                </button>
                            )}
                        </div>
                    ))}
                    <div className='flex items-center'>
                        <input
                            type='checkbox'
                            id='rememberMe'
                            checked={rememberMe}
                            onChange={() => setRememberMe(!rememberMe)}
                            className='h-4 w-4 text-purple-500 focus:ring-purple-500 border-gray-300 rounded'
                            required
                        />
                        <label htmlFor='rememberMe' className='ml-2 block text-sm text-gray-700'>
                                Remember me
                        </label>
                    </div>
                    <button type='submit' className={BUTTON_CLASSES} disabled={loading}>
                        {loading ? (
                          "Logging In..."
                        ) : (
                          <>
                          <LogIn className='w-4 h-4' />
                          Log In
                          </>
                        )}
                    </button>
                    <p className='text-center text-sm text-gray-600 mt-6'>
                        Don't have an account?{' '}
                        <button type='button' className='text-purple-600 hover:text-purple-700 hover:underline font-medium transition-colors' onClick={handleSwitchMode}>
                            Sign Up
                        </button>
                    </p>
                </form>
                <div className="mt-6 text-center">
                    <p className="text-gray-600 mb-2">Or sign in with</p>
                    <a
                        href={`${API_URL}/api/user/auth/google`}
                        className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 48 48">
                            <path fill="#FFC107" d="M43.6 20.4h-3.6v-3.6h-3.6v3.6h-3.6v3.6h3.6v3.6h3.6v-3.6h3.6z"/>
                            <path fill="#FF3D00" d="M24 9.6c3.6 0 6.6 1.2 8.4 3.6l6-6c-3.6-3.6-8.4-6-14.4-6-11.4 0-21.6 7.2-25.2 18l7.2 5.4c1.8-7.2 8.4-12.6 14.4-12.6z"/>
                            <path fill="#4CAF50" d="M24 38.4c-3.6 0-6.6-1.2-8.4-3.6l-6 6c3.6 3.6 8.4 6 14.4 6 11.4 0 21.6-7.2 25.2-18l-7.2-5.4c-1.8 7.2-8.4 12.6-14.4 12.6z"/>
                            <path fill="#1976D2" d="M43.6 20.4h-19.2v7.2h11.4c-0.6 3.6-3.6 6-7.2 6-4.2 0-7.8-3.6-7.8-7.8s3.6-7.8 7.8-7.8c2.4 0 4.2 1.2 5.4 2.4l4.2-4.2c-2.4-2.4-5.4-3.6-9.6-3.6-7.8 0-14.4 6.6-14.4 14.4s6.6 14.4 14.4 14.4c8.4 0 14.4-6 14.4-14.4 0-1.2 0-2.4-0.6-3.6z"/>
                        </svg>
                        Google
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Login;