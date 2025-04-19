import React, { useState } from 'react';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import ProgressBricks from '../components/ProgressBricks';
import { motion } from 'framer-motion';

const Game02 = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const navigate = useNavigate();

  const questions = [
    { sentence: "_ _ _ ir liela", translation: "The house is big", options: ["māja", "auto", "skola"], correctAnswer: "māja" },
    { sentence: "_ _ _ ir ātra", translation: "The car is fast", options: ["māja", "auto", "skola"], correctAnswer: "auto" },
    { sentence: "_ _ _ ir veca", translation: "The school is old", options: ["māja", "auto", "skola"], correctAnswer: "skola" },
    { sentence: "_ _ _ ir jauns", translation: "The boy is young", options: ["zēns", "meitene", "suns"], correctAnswer: "zēns" },
    { sentence: "_ _ _ ir skaista", translation: "The girl is beautiful", options: ["zēns", "meitene", "suns"], correctAnswer: "meitene" },
    { sentence: "_ _ _ ir liels", translation: "The dog is big", options: ["zēns", "meitene", "suns"], correctAnswer: "suns" },
    { sentence: "_ _ _ ir garš", translation: "The tree is tall", options: ["koks", "zieds", "akmens"], correctAnswer: "koks" },
    { sentence: "_ _ _ ir mazs", translation: "The flower is small", options: ["koks", "zieds", "akmens"], correctAnswer: "zieds" },
    { sentence: "_ _ _ ir smags", translation: "The stone is heavy", options: ["koks", "zieds", "akmens"], correctAnswer: "akmens" },
    { sentence: "_ _ _ ir garšīgs", translation: "The apple is tasty", options: ["ābols", "bumbieris", "ķirsis"], correctAnswer: "ābols" },
  ];

  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsCorrect(option === currentQuestion.correctAnswer);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsCorrect(null);
    } else {
      localStorage.setItem("greeting", "Huraay!!\nYou have completed all fill in the blanks!");
      navigate('/greeting');
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setSelectedOption(null);
      setIsCorrect(null);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="flex flex-col justify-center relative items-center gap-7 mt-10">
      <div className="w-full max-w-md flex items-start justify-start md:ml-0 ml-10">
        <button onClick={prevQuestion} className="size-8 cursor-pointer bg-black rounded-lg flex justify-center items-center">
          <IoIosArrowBack className="text-white text-2xl font-extrabold" />
        </button>
      </div>
      <motion.div
        key={currentQuestionIndex}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md mx-2"
      >
        <div className="absolute w-full text-center">
          <ProgressBricks current={currentQuestionIndex + 1} heading="Fill in the blanks" subheading="(select right answer from the boxes)" />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-semibold mb-2 mt-10"
          >
            {currentQuestion.sentence}
          </motion.div>
          <p className="font-semibold mb-4">{`(${currentQuestion.translation})`}</p>
          <div className="flex mt-15 justify-center gap-4 mb-2">
            {currentQuestion.options.map((option, index) => (
              <motion.button
                key={index}
                onClick={() => handleOptionClick(option)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`px-4 py-2 text-lg border rounded-lg cursor-pointer border-black ${
                  selectedOption === option
                    ? isCorrect
                      ? 'text-green-400 font-semibold border-green-400'
                      : 'font-semibold text-red-400 border-red-400'
                    : 'text-normal text-black border-black'
                }`}
              >
                {option}
              </motion.button>
            ))}
          </div>
          {selectedOption && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className={`mt-2 text-lg ${isCorrect ? 'text-green-500' : 'text-red-500'}`}
            >
              {isCorrect ? 'Correct!' : 'Wrong, try again.'}
            </motion.div>
          )}
        </div>
      </motion.div>
      <div className="w-full max-w-md mt-90 flex items-end justify-end mr-10">
        <motion.button
          onClick={nextQuestion}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="size-9 cursor-pointer bg-black rounded-full flex justify-center items-center"
        >
          <IoIosArrowForward className="text-white text-3xl font-extrabold" />
        </motion.button>
      </div>
    </div>
  );
};

export default Game02;