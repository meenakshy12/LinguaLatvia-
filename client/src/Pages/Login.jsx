import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form"; // Import react-hook-form
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase"; // Import Firebase auth
import toast, { Toaster } from "react-hot-toast"; // Import react-hot-toast
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"; // Import icons from react-icons
import { motion } from "framer-motion"; // Import framer-motion

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm(); // Initialize react-hook-form
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [loading, setLoading] = useState(false); // State for loading
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true); // Start loading
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      toast.success("Login successful!");
      setTimeout(() => {
        navigate("/"); // Navigate to the home page
      }, 1000);
    } catch (error) {
      console.error("Login Error:", error);
      if (error.code === "auth/user-not-found") {
        toast.error("No user found with this email.");
      } else if (error.code === "auth/wrong-password") {
        toast.error("Incorrect password. Please try again.");
      } else if (error.code === "auth/invalid-email") {
        toast.error("Invalid email address.");
      } else if(error.code === "auth/invalid-credential") {
        toast.error("Invalid credentials. Please check your email and password.");
      }else{
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1B4A7E]">
      <Toaster position="top-center" toastOptions={{ style: { background: "#fff", color: "#333" } }} />
      <motion.div
        className="w-[350px] p-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-white text-2xl font-bold text-center mb-5">LinguaLatvia</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 text-black">
          <div>
            <label className="text-white text-sm block mb-1">Email ID</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })} // Register email field
              className="w-full px-3 py-2 rounded-sm bg-white border border-black focus:outline-none"
            />
            {errors.email && (
              <motion.p
                className="text-red-500 text-xs mt-1"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {errors.email.message}
              </motion.p>
            )}
          </div>
          <div>
            <label className="text-white text-sm block mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"} // Toggle input type
                {...register("password", { 
                  required: "Password is required", 
                  minLength: { value: 6, message: "Password must be at least 6 characters long" } 
                })} // Register password field with minLength validation
                className="w-full px-3 py-2 rounded-sm bg-white border border-black focus:outline-none"
              />
              <span
                className="absolute right-3 top-2.5 cursor-pointer text-gray-400"
                onClick={() => setShowPassword(!showPassword)} // Toggle visibility
              >
                {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />} {/* Icon changes */}
              </span>
            </div>
            {errors.password && (
              <motion.p
                className="text-red-500 text-xs mt-1"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {errors.password.message}
              </motion.p>
            )}
          </div>
          <div className="flex justify-center mt-4">
            <motion.button
              type="submit"
              className="bg-black cursor-pointer text-white px-6 py-2 rounded-sm hover:bg-gray-900"
              disabled={loading} // Disable button when loading
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {loading ? (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                >
                  Logging In...
                </motion.span>
              ) : (
                "Login"
              )}
            </motion.button>
          </div>
          <div className="flex justify-center mt-2">
            <p className="text-white text-sm">
              Don't have an account?{" "}
              <span
                className="text-blue-400 cursor-pointer hover:underline"
                onClick={() => navigate("/signup")} // Navigate to signup page
              >
                Sign Up
              </span>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
