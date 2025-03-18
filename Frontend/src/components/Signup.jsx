import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import axios from "axios";
import { login } from "../store/authSlice.js";
import { Button, Input, Logo } from "./index.js";

function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState("");
  const [avatar, setAvatar] = useState(null);

  const handleFileChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const create = async (data) => {
    setError("");

    try {
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("email", data.email);
      formData.append("username", data.username);
      formData.append("password", data.password);
      if (avatar) {
        formData.append("avatar", avatar);
      }

      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/users/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (response.data.data?.user) {
        dispatch(login(response.data.data.user));
        navigate("/");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen  from-gray-900 to-black px-4 py-12 bg-[url('https://images.unsplash.com/photo-1636955840493-f43a02bfa064?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center bg-no-repeat">
      <div className="w-full max-w-md bg-gray-900  rounded-2xl shadow-xl shadow-gray-900/50 border border-gray-700">
        <div className="p-8 sm:p-10">
          <div className="mb-6 flex justify-center">
            <span className="inline-block w-full max-w-[120px] transition-transform hover:scale-105 duration-300">
              <Logo width="100%" />
            </span>
          </div>

          <h2 className="text-center text-2xl font-extrabold text-white leading-tight tracking-tight mb-2">
            Create an Account
          </h2>

          <p className="mt-2 text-center text-base text-gray-400 mb-8">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
              Sign In
            </Link>
          </p>

          {error && (
            <div className="bg-red-900/30 border-l-4 border-red-500 p-4 mb-6 rounded-md">
              <p className="text-sm text-red-400 text-center">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(create)} className="space-y-6" encType="multipart/form-data">
            <div className="w-full">
              <label className="block text-sm font-medium text-white mb-1 pl-1">Full Name:</label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full px-4 py-2.5 bg-gray-700 text-white border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                {...register("fullName", { required: "Full Name is required" })}
              />
              {errors.fullName && <p className="mt-1 text-sm text-red-400">{errors.fullName.message}</p>}
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-white mb-1 pl-1">Username:</label>
              <input
                type="text"
                placeholder="Choose a username"
                className="w-full px-4 py-2.5 bg-gray-700 text-white border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                {...register("username", { required: "Username is required" })}
              />
              {errors.username && <p className="mt-1 text-sm text-red-400">{errors.username.message}</p>}
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-white mb-1 pl-1">Email:</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2.5 bg-gray-700 text-white border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                    message: "Email address must be valid",
                  },
                })}
              />
              {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-white mb-1 pl-1">Password:</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-2.5 bg-gray-700 text-white border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" },
                })}
              />
              {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>}
            </div>

            {/* Avatar Upload */}
            <div className="w-full">
              <label className="block text-sm font-medium text-white mb-1 pl-1">Avatar:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-1 block w-full text-sm text-gray-500
                           file:mr-4 file:py-2 file:px-4
                           file:rounded-lg file:border-0
                           file:text-sm file:font-semibold
                           file:bg-blue-500 file:text-white
                           hover:file:bg-blue-600 cursor-pointer"
              />
            </div>

            <Button type="submit" className="w-full flex justify-center py-3 px-4 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-gray-800 text-white">
              Sign Up
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
