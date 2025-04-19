import React from 'react'
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedFigure from '../assets/greeting.png'; // Adjust the path as needed
import { IoIosArrowForward } from 'react-icons/io';

const Greeting = () => {
  const navigate = useNavigate();
  const greeting = localStorage.getItem("greeting") || "Hoorayy!!\nLet's Play Some Games Now ";
  const GoToHome = () => {
    navigate('/');
  };

  return (
    <motion.div 
      className="animate-fadeIn whitespace-pre-wrap text-center flex flex-col items-center justify-center mt-[20vh] gap-8 p-4"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <p className='text-xl font-semibold'> {greeting}</p>
      <img 
        src={AnimatedFigure} 
        alt="Animated Figure" 
        className="size-16" // Tailwind classes for styling
      />
      <button 
        onClick={GoToHome} 
        className='mt-12 size-9 cursor-pointer bg-black rounded-full flex justify-center items-center'
      >
        <IoIosArrowForward className='text-white text-3xl font-extrabold' />
      </button>
    </motion.div>
  )
}

export default Greeting