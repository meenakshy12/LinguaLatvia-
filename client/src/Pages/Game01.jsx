// === LATVIAN WORD BUILDER GAME ===
// Tech: React.js (frontend), TailwindCSS, Framer Motion, Node.js (backend), OpenAI API

// --- FRONTEND (React) ---
// File: App.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import ProgressBricks from "../components/ProgressBricks";
import { getFromFirebaseGame01, saveToFirebaseGame01 } from "../helpers/game01";

export default function Game01() {
  const navigate = useNavigate();
  const [letters, setLetters] = useState([]);
  const [clue, setClue] = useState("");
  const [answer, setAnswer] = useState("");
  const [guess, setGuess] = useState("");
  const [loading, setLoading] = useState(true);
  const [wordList, setWordList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [showCorrectWord, setShowCorrectWord] = useState(false);

  const fetchWords = async () => {
    setLoading(true);
    const previousData = await getFromFirebaseGame01();
    // console.log("Prevous Data", previousData);
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/game01`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: previousData }),
    });
    const data = await response.json();
    console.log("API response:", data); // Log the API response for debugging
    setWordList(data || [{ word: "hello", clue: "A common greeting" }]); // Replace with actual data from API
    setCurrentIndex(0);
    setLoading(false);
  };

  const shuffleArray = (arr) => arr.sort(() => Math.random() - 0.5);

  const handleLetterClick = (letter, index) => {
    setGuess((prev) => prev + letter);
    setLetters((prev) => prev.filter((_, i) => i !== index));
  };

  const nextWord = () => {
    if (guess.length !== answer.length) {
      toast.error("Please arrange all letters before proceeding.");
      return;
    }

    if (!showCorrectWord) {
      if (guess === answer) {
        setCorrectAnswers((prev) => [...prev, { word: answer, clue }]);
        console.log("Correct Answers:", [
          ...correctAnswers,
          { word: answer, clue },
        ]);
      }
      setShowCorrectWord(true);
    } else {
      if (currentIndex + 1 < wordList.length) {
        setCurrentIndex((prev) => prev + 1);
        setShowCorrectWord(false);
      } else {
        console.log("Game Over. Correct Answers:", correctAnswers);
        saveToFirebaseGame01(correctAnswers);
        const score = correctAnswers.length * 10; // Calculate score
        localStorage.setItem(
          "greeting",
          `Huraay!!\nYou have completed the Latvian Word Builder Game!\nYour score: ${score}/${wordList.length * 10}`
        );
        navigate("/greeting");
      }
    }
  };

  const loadCurrentWord = () => {
    if (wordList.length > 0 && currentIndex < wordList.length) {
      const { word, clue } = wordList[currentIndex];
      setAnswer(word);
      setClue(clue);
      setLetters(shuffleArray(word.split("")));
      setGuess("");
      setShowCorrectWord(false);
    }
  };

  useEffect(() => {
    fetchWords();
  }, []);

  useEffect(() => {
    loadCurrentWord();
  }, [currentIndex, wordList]);

  if (loading) {
    return <Loader />;
  }

  const renderGuessBoxes = () => {
    return answer.split("").map((_, idx) => (
      <div
        key={idx}
        className="w-10 h-10 border border-black flex items-center justify-center text-xl rounded font-semibold"
      >
        {guess[idx] || ""}
      </div>
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
      className="flex h-full flex-col justify-center relative items-center gap-7 my-10"
    >
      <div className="w-full max-w-md flex items-start justify-start md:ml-0 ml-10">
        <button
          onClick={() => navigate("/")}
          className="size-8 cursor-pointer bg-black rounded-lg flex justify-center items-center"
        >
          <IoIosArrowBack className="text-white text-2xl font-extrabold" />
        </button>
      </div>
      <ProgressBricks
        current={currentIndex + 1}
        total={wordList.length || 5}
        heading="Latvian Word Builder"
        subheading="(Arrange the letters to form the correct word)"
      />
      <div className="text-xl font-semibold mb-4 text-center">Clue: {clue}</div>

      <div className="grid grid-cols-1 gap-4 pt-3 sm:mx-0 mx-5">
        <div className="flex flex-wrap justify-center gap-3 mb-4">
          {letters.map((letter, idx) => (
            <motion.button
              key={idx}
              onClick={() => handleLetterClick(letter, idx)}
              className="bg-[#4DD0E18A] cursor-pointer shadow-xl rounded-md px-4 py-2 text-xl font-medium border border-black"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {letter}
            </motion.button>
          ))}
        </div>
        <div className="text-xl font-semibold mb-4 text-center">Guess Word</div>
        <div className="flex justify-center gap-2 mb-4">
          {renderGuessBoxes()}
        </div>

        {showCorrectWord && (
          <div
            className={`text-center text-lg font-bold ${
              guess === answer ? "text-green-400" : "text-red-400"
            }`}
          >
            Correct Word: {answer}
          </div>
        )}
      </div>

      <div className="w-full max-w-md mt-1x0 flex items-end justify-end pr-10 mr-15">
        <button
          onClick={nextWord}
          className="size-9 cursor-pointer bg-black rounded-full flex justify-center items-center"
        >
          <motion.div
            whileHover={{ x: 5 }} // Add horizontal animation on hover
            transition={{ type: "spring", stiffness: 300 }}
          >
            <IoIosArrowForward className="text-white text-3xl font-extrabold" />
          </motion.div>
        </button>
      </div>
    </motion.div>
  );
}
