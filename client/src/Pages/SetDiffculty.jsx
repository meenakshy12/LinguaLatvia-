import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import toast from "react-hot-toast";

const SetDiffculty = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const gameName = searchParams.get("game");
  const [difficulty, setDifficulty] = useState("easy");

  const handleNext = () => {
    // Navigate to the next page with the selected difficulty
    // console.log("Selected difficulty:", difficulty,gameName);
    if (gameName==null) {
  toast.error("Please select a game first.");
      navigate("/");
      return;      
    }
    navigate(`/${gameName}?difficulty=${difficulty}`);
  };

  return (
    <div className="flex flex-col items-center justify-center mt-20 gap-6">
      <div className="w-full max-w-md flex items-start justify-start">
        <button
          onClick={() => navigate(-1)}
          className="size-8 cursor-pointer bg-black rounded-lg flex justify-center items-center"
        >
          <IoIosArrowBack className="text-white text-2xl font-extrabold" />
        </button>
      </div>
      <div>
        <h1 className="text-2xl font-bold mb-5">Set Difficulty </h1>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="cursor-pointer hover:scale-105 border border-gray-300 max-w-sm w-xs rounded-md px-4 py-2 text-lg outline-none focus:ring-1 focus:ring-blue-[#1B4A7E]"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="difficult">Difficult</option>
        </select>
      </div>
      <div className="w-full mt-32 mr-10 max-w-md flex items-end justify-end">
        <button
          onClick={handleNext}
          className="size-9 cursor-pointer bg-black rounded-full flex justify-center items-center"
        >
          <IoIosArrowForward className="text-white text-3xl font-extrabold" />
        </button>
      </div>
    </div>
  );
};

export default SetDiffculty;
