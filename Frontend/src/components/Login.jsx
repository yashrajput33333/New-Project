import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login as authLogin } from '../store/authSlice'
import { Button, Input, Logo } from "./index"
import { useDispatch } from "react-redux"
import { useForm } from "react-hook-form"

function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()
    const [error, setError] = useState("")

    const login = async (credentials) => {
        setError("");

        try {
            const response = await fetch("/api/v1/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(credentials),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            const userResponse = await fetch("/api/v1/users/current-user", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${data.accessToken}`,
                },
                credentials: "include",
            });

            const userData = await userResponse.json();

            if (userData.success) {
                dispatch(authLogin(userData.data));
                navigate("/");
            } else {
                throw new Error(userData.message);
            }
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="flex items-center justify-center shadow-xl shadow-gray-900/50 w-full min-h-screen bg-[url('https://images.unsplash.com/photo-1636955840493-f43a02bfa064?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center bg-no-repeat">
            <div className="w-full max-w-md bg-gray-900  rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
                <div className="p-8 sm:p-10">
                    <div className="mb-6 flex justify-center">
                        <span className="inline-block w-full max-w-[120px] transition-transform hover:scale-105 duration-300">
                            <Logo width="100%" />
                        </span>
                    </div>
                    
                    <h2 className="text-center text-2xl font-extrabold text-white leading-tight tracking-tight mb-2">
                        Welcome back
                    </h2>
                    
                    <p className="mt-2 text-center text-base text-gray-400 mb-8">
                        Don&apos;t have an account?{' '}
                        <Link
                            to="/signup"
                            className="font-medium text-blue-400 hover:text-blue-300 transition-colors duration-200 ease-in-out hover:underline"
                        >
                            Sign up now
                        </Link>
                    </p>
                    
                    {error && (
                        <div className="bg-red-900/30 border-l-4 border-red-500 p-4 mb-6 rounded-md">
                            <p className="text-sm text-red-400">{error}</p>
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit(login)} className="space-y-6">
                        <div className="w-full mb-4">
                            <label className="block text-sm font-medium text-white mb-1 pl-1">
                                Email address
                            </label>
                            <input
                                type="email"
                                className="w-full px-4 py-2.5 bg-gray-700 text-white border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                {...register("email", {
                                    required: "Email is required",
                                    validate: {
                                        matchPattern: (value) => 
                                            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                            "Please enter a valid email address"
                                    }
                                })}
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
                        </div>

                        <div className="w-full mb-4">
                            <label className="block text-sm font-medium text-white mb-1 pl-1">
                                Password
                            </label>
                            <input
                                type="password"
                                className="w-full px-4 py-2.5 bg-gray-700 text-white border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                {...register("password", { required: "Password is required" })}
                            />
                            {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>}
                        </div>
                        
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700 cursor-pointer"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300 cursor-pointer">
                                    Remember me
                                </label>
                            </div>
                            
                            <div className="text-sm">
                                <Link to="/forgot-password" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
                                    {/* Forgot password? */}
                                </Link>
                            </div>
                        </div>
                        
                        <Button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-gray-800 text-white"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Signing in..." : "Sign in"}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login
