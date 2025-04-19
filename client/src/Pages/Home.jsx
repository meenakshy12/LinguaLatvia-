import React from 'react'
import avatar from "../assets/woman.svg";
import books from "../assets/books.svg";
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  return (

        <div className="min-h-screen  flex flex-col items-center py-6 space-y-4 px-4 md:mt-7">
          {/* Greeting Card */}
          <div className="w-full max-w-md bg-[#136EA3] text-white rounded-[2rem] p-4 py-7 flex items-center space-x-4 shadow-custom border-2 border-black">
            <img src={avatar} alt="avatar" className="w-16 h-16 rounded-full " />
            <div>
              <h2 className="text-lg font-semibold">Hey Zara <span role="img" aria-label="wave">👋</span></h2>
              <p className="text-sm text-[#FFFFFFA3]">Ready To Practice Latvian today?</p>
            </div>
          </div>
    
          {/* Progress Quiz */}

          <div className="w-full max-w-md bg-[#4DD0E18A] rounded-[2rem] border border-black p-6 shadow-custom flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-semibold">Progress Quiz</h3>
              <p className="text-sm">Track your progress overtime with this Quiz</p>
              <button onClick={()=>{navigate("/game01")}} className="mt-2 cursor-pointer py-2 bg-[#7CA7F2FA]  rounded-full sm:px-10 px-5 shadow hover:bg-[#7CA7F2] hover:font-semibold transition">
                Take this Quiz
              </button>
            </div>
            <img
              src={books}
              alt="Books"
              className="sm:w-26 sm:h-26 h-20 w-20 object-contain"
            />
          </div>
    
         
        </div>
    
  )
}

export default Home