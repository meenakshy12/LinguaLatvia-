import React, { useState, useEffect, useRef } from 'react';
import avator from "../assets/woman.svg"; // Replace with your avatar image path
import { CiLogout } from "react-icons/ci"; // Import the logout icon
import { auth } from '../config/firebase';
import { RiHome3Line, RiRobot2Line } from "react-icons/ri";
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import { TbGridDots } from "react-icons/tb"; // Import the grid icon

const Navbar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null); // Reference for the dropdown
    const navigate = useNavigate();

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false); // Close dropdown if clicked outside
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        // Add logout logic here
        // For example, using Firebase Auth:
        auth.signOut()
        .then(() => {
            console.log("Logged out successfully");
            navigate("/login"); // Redirect to the login page or home page
            
        })
        console.log("Logged out");
    };

    const themeColor = "#1B4A7E"; // Theme color from Chatbot.jsx

    const handelNavigation = (path) => {
        setDropdownOpen(false); // Close the dropdown after navigation
        navigate(path);
    }

    return (
      <nav
        className={`z-100  navbar w-screen shadow-sm flex justify-between h-16 pb-3 pt-5 px-10`}
      >
        <div className="navbar-left">
          <span
            className="navbar-logo text-xl font-bold text-[#1B4A7E] cursor-pointer"
            onClick={() => handelNavigation("/")}
          >
            LinguaLatvia
          </span>
        </div>
        <div className="navbar-right relative" ref={dropdownRef}>
          <div
            className="profile-icon cursor-pointer overflow-hidden "
            onClick={toggleDropdown}
          >
            {/* <img src={avator} alt="Profile" className="w-full h-full object-cover" /> */}
            <TbGridDots className="text-2xl text-[#1B4A7E]" />
          </div>
          {dropdownOpen && (
            <div className="dropdown-menu absolute -right-3 mt-2 w-62 md:w-72 flex flex-col justify-center pt-3 bg-white text-black rounded-2xl shadow-lg">
              <img
                src={avator}
                alt="Profile"
                className="w-10 h-10 rounded-full border m-auto border-slate-400 object-cover"
              />

              <div className="dropdown-item px-4 py-2 cursor-pointer truncate">
                {auth.currentUser?.email}
              </div>
              <div
                className="dropdown-item px-4 py-2 cursor-pointer flex items-center gap-2 group hover:font-semibold"
                onClick={() => handelNavigation("/")}
              >
                <RiHome3Line className="group-hover:font-semibold" />
                Home
              </div>
              <div
                className="dropdown-item px-4 py-2 cursor-pointer flex items-center gap-2 group hover:font-semibold"
                onClick={() => handelNavigation("/Chatbot")}
              >
                <RiRobot2Line className="group-hover:font-semibold" />
                Chatbot
              </div>
              <div
                className="dropdown-item px-4 py-2 cursor-pointer flex items-center gap-2 group hover:font-semibold"
                onClick={handleLogout}
              >
                <CiLogout className="group-hover:font-semibold" />
                Logout
              </div>
            </div>
          )}
        </div>
      </nav>
    );
};

export default Navbar;