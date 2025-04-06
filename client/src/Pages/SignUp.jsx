import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, firebaseDb } from "../config/firebase";
import { doc, setDoc } from "firebase/firestore"; // Firestore methods
import toast, { Toaster } from "react-hot-toast"; // Import react-hot-toast
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"; // Import icons from react-icons

const SignUp = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false); // Loading state
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for confirm password visibility
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    setLoading(true); // Set loading to true when request starts
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      // Log user UID and data being sent to Firestore
      console.log("Data being sent to Firestore:", {
        fullName: data.fullName,
        universityName: data.universityName,
        email: data.email,
      });

      // Store additional details in Firestore
      await setDoc(doc(firebaseDb, "users", user.uid), {
        fullName: data.fullName,
        universityName: data.universityName,
        email: data.email,
      });

      toast.success("User registered successfully!");
      // Reset the form after successful submission
      document.querySelector("form").reset();
      setTimeout(() => {
       navigate("/");
      }, 1000);
    } catch (error) {
      console.error("Firestore Write Error:", error);
      if (error.code === "permission-denied") {
        toast.error("You do not have permission to perform this action. Please check your Firestore rules.");
      } else if (error.code === "invalid-argument") {
        toast.error("Invalid data provided. Please check your input.");
      } else if (error.code === "auth/email-already-in-use") {
        toast.error("This email is already in use. Please use a different email.");
      } else if (error.code === "auth/weak-password") {
        toast.error("The password is too weak. Please use a stronger password.");
      } else if (error.code === "auth/invalid-email") {
        toast.error("The email address is invalid. Please enter a valid email.");
      } else {
        toast.error("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setLoading(false); // Set loading to false when request ends
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1B4A7E] ">
      <Toaster position="top-center" toastOptions={{ style: { background: "#fff", color: "#333" } }} />
      <div className="w-[350px] p-6">
        <h1 className="text-white text-2xl font-bold text-center mb-5">LinguaLatvia</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 text-black">
          <div>
            <label className="text-white text-sm block mb-1">Email ID</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full px-3 py-2 rounded-sm text-black bg-white border border-black focus:outline-none"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="text-white text-sm block mb-1">Full Name</label>
            <input
              type="text"
              {...register("fullName", { required: "Full Name is required" })}
              className="w-full px-3 py-2 rounded-sm bg-white border border-black focus:outline-none"
            />
            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
          </div>
          <div>
            <label className="text-white text-sm block mb-1">University Name</label>
            <input
              type="text"
              {...register("universityName", { required: "University Name is required" })}
              className="w-full px-3 py-2 rounded-sm bg-white border border-black focus:outline-none"
            />
            {errors.universityName && <p className="text-red-500 text-xs mt-1">{errors.universityName.message}</p>}
          </div>
          <div>
            <label className="text-white text-sm block mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"} // Toggle input type
                {...register("password", { 
                  required: "Password is required", 
                  minLength: { value: 6, message: "Password must be at least 6 characters long" } 
                })}
                className="w-full px-3 py-2 rounded-sm bg-white border border-black focus:outline-none"
              />
              <span
                className="absolute right-3 top-2.5 cursor-pointer text-gray-400"
                onClick={() => setShowPassword(!showPassword)} // Toggle visibility
              >
                {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />} {/* Icon changes */}
              </span>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
          <div>
            <label className="text-white text-sm block mb-1">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"} // Toggle input type
                {...register("confirmPassword", { required: "Confirm Password is required" })}
                className="w-full px-3 py-2 rounded-sm bg-white border border-black focus:outline-none"
              />
              <span
                className="absolute right-3 top-2.5 cursor-pointer text-gray-400"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)} // Toggle visibility
              >
                {showConfirmPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />} {/* Icon changes */}
              </span>
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
          </div>
          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className="cursor-pointer bg-black text-white px-6 py-2 rounded-sm hover:bg-gray-900"
              disabled={loading} // Disable button when loading
            >
              {loading ? "Signing Up..." : "Sign Up"} {/* Show loading text */}
            </button>
          </div>
          <div className="flex justify-center mt-2">
            <p className="text-white text-sm">
              Already have an account?{" "}
              <span
                className="text-blue-400 cursor-pointer hover:underline"
                onClick={() => navigate("/login")} // Navigate to login page
              >
                Log In
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
