import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import axios from "axios";
import { login } from "../store/authSlice.js";
import { Button, Input, Logo } from "./index.js";

function Signup() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const [avatar, setAvatar] = useState(null);

  // Handle file change
  const handleFileChange = (e) => {
    setAvatar(e.target.files[0]); // Store the selected file
  };

  // Function to register user
  const create = async (data) => {
    setError(""); // Reset error state

    try {
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("email", data.email);
      formData.append("username", data.username);
      formData.append("password", data.password);
      if (avatar) {
        formData.append("avatar", avatar); // Append avatar file if selected
      }

      const response = await axios.post("/api/v1/users/register", formData, {
        headers: { "Content-Type": "multipart/form-data" }, // Set correct headers
      });

    //   console.log(response.data.data.user)
    //   If successful, log in the user
      if (response.data.data?.user) {
        dispatch(login(response.data.data.user)); 
        navigate("/");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10">
        <div className="mb-2 flex justify-center">
          <span className="inline-block w-full max-w-[100px]">
            <Logo width="100%" />
          </span>
        </div>
        <h2 className="text-center text-2xl font-bold leading-tight">
          Sign up to create an account
        </h2>
        <p className="mt-2 text-center text-base text-black/60">
          Already have an account?&nbsp;
          <Link to="/login" className="font-medium text-primary hover:underline">
            Sign In
          </Link>
        </p>
        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}

        <form onSubmit={handleSubmit(create)} encType="multipart/form-data">
          <div className="space-y-5">
            <Input
              label="Full Name:"
              placeholder="Enter your full name"
              {...register("fullName", { required: "Full Name is required" })}
            />
            <Input
              label="Username:"
              placeholder="Choose a username"
              {...register("username", { required: "Username is required" })}
            />
            <Input
              label="Email:"
              placeholder="Enter your email"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                  message: "Email address must be valid",
                },
              })}
            />
            <Input
              label="Password:"
              type="password"
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />

            {/* Avatar Upload Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Avatar:</label>
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

            <Button type="submit" className="w-full">
              Create Account
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
