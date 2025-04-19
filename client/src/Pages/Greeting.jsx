import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import AnimatedFigure from '../assets/greeting.png'; // Adjust the path as needed
import { IoIosArrowForward } from 'react-icons/io';

const Greeting = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const greeting = queryParams.get('greeting') || "Hoorayy!!\nLet's Play Some Games Now ";
    const GoToHome = () => {
        navigate('/');
    };
  return (
    <div 
      className="animate-fadeIn whitespace-pre-wrap text-center flex flex-col items-center justify-center mt-[20vh] gap-8  p-4"
    >
     <p className='text-xl font-semibold'> {greeting}</p>
      <img 
        src={AnimatedFigure} 
        alt="Animated Figure" 
        className="size-16" // Tailwind classes for styling
      />
      <button onClick={GoToHome} className='mt-12 size-9 cursor-pointer bg-black rounded-full flex justify-center items-center'><IoIosArrowForward className='text-white text-3xl font-extrabold' /></button>
    </div>
  )
}

export default Greeting