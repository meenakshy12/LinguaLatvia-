import React, { useState, useEffect } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Loader from "../components/Loader";
import { getFromFirebaseGame03, saveToFirebaseGame03 } from "../helpers/gam03";

const Game03 = () => {
  const [answers, setAnswers] = useState({});
  const [questions, setQuestions] = useState([]);
  const [options, setOptions] = useState([]);
  const [data, setData] = useState([]);
  const [validated, setValidated] = useState(false); // Track if validation is triggered
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();

  const fetchGameData = async () => {
    setLoading(true); // Set loading to true before fetching
    try {
      const previousData = await getFromFirebaseGame03(); // Fetch previous data from Firebase
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/game03`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: previousData }), // Send previous data to the API
      });
      const { gameData } = await response.json();
      // console.log(gameData, typeof gameData); // Log the API data for debugging
      // console.log("Game data from API:", gameData);

      const combinedData = Array.isArray(gameData) && gameData.length > 0 
        ? gameData.slice(0, 4) // Use API data if valid
        : [
            { question: "māja", answer: "House" },
            { question: "auto", answer: "Car" },
            { question: "suns", answer: "Dog" },
            { question: "kaķis", answer: "Cat" },
          ]; // Default data fallback

      setData(combinedData);
      setQuestions(combinedData.map((item) => item.question));
      setOptions(shuffleArray(combinedData.map((item) => item.answer)));
      setAnswers(
        combinedData.reduce((acc, item) => {
          const questionKey = item.question?.toLowerCase() || ""; // Safely handle undefined
          return { ...acc, [questionKey]: "" };
        }, {})
      );
    } catch (error) {
      console.error("Error fetching data from API:", error);

      // Use default data in case of an error
      const defaultData = [
        { question: "māja", answer: "House" },
        { question: "auto", answer: "Car" },
        { question: "suns", answer: "Dog" },
        { question: "kaķis", answer: "Cat" },
      ];
      setData(defaultData);
      setQuestions(defaultData.map((item) => item.question));
      setOptions(shuffleArray(defaultData.map((item) => item.answer)));
      setAnswers(
        defaultData.reduce((acc, item) => {
          const questionKey = item.question?.toLowerCase() || ""; // Safely handle undefined
          return { ...acc, [questionKey]: "" };
        }, {})
      );
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  useEffect(() => {
    fetchGameData();
  }, []);

  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const handleDrop = (e, target) => {
    const draggedAnswer = e.dataTransfer.getData("text");
    setAnswers((prev) => {
      const updatedAnswers = Object.fromEntries(
        Object.entries(prev).map(([key, value]) => [key, value === draggedAnswer ? "" : value])
      );
      return { ...updatedAnswers, [target]: draggedAnswer };
    });
    setValidated(true); // Automatically validate after drop
  };

  const handleDragStart = (e, value) => {
    e.dataTransfer.setData("text", value);
  };

  const isOptionUsed = (option) => {
    return Object.values(answers).includes(option);
  };

  const getBorderColor = (question) => {
    const foundItem = data.find((item) => item.question?.toLowerCase() === question);
    if (!foundItem) return "border-[#1A1A86]"; // Default border if no matching item is found

    const correctAnswer = foundItem.answer;
    const userAnswer = answers[question];
    if (!validated || !userAnswer) return "border-[#1A1A86]"; // Default border if not validated
    return userAnswer === correctAnswer ? "border-green-500" : "border-red-500";
  };

  const GoToGreeting = () => {
    const allAnswered = Object.values(answers).every((answer) => answer !== "");
    const allCorrect = questions.every((q) => {
      const questionKey = q.toLowerCase();
      const foundItem = data.find((item) => item.question?.toLowerCase() === questionKey);
      if (!foundItem) return false; // If no matching item, consider it incorrect
      const correctAnswer = foundItem.answer;
      return answers[questionKey] === correctAnswer;
    });

    if (!allAnswered) {
      alert("Please answer all questions before proceeding.");
      return;
    }

    if (!allCorrect) {
      alert("Some answers are incorrect. Please correct them before proceeding.");
      return;
    }

    saveToFirebaseGame03(data); // Save the game data to Firebase
    localStorage.setItem("greeting", "Huraay!!\nYou have completed all matching game!");
    navigate("/greeting");
  };
if(loading) 
  return <Loader/>; // Loading state

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto mt-10"
    >
    
        <>
          <div className="w-full max-w-md flex items-start justify-start md:ml-0 ml-10">
            <button
              onClick={() => navigate("/")}
              className="size-8 cursor-pointer bg-black rounded-lg flex justify-center items-center"
            >
              <IoIosArrowBack className="text-white text-2xl font-extrabold" />
            </button>
          </div>
          <div className="sm:mx-0 mx-5 mt-7">
            <h2 className="text-2xl font-semibold mb-1">Matching Game</h2>
            <p className="text-[#00000099] text-sm mb-6">(Drag the correct answer and drop it into the boxes)</p>
          </div>
          <div className="grid grid-cols-1 gap-4 pt-7 sm:mx-0 mx-5">
            {questions.map((word, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center gap-4"
              >
                <span className="text-[#1A1A86] text-xl w-1/2">{word}</span>
                <div
                  onDrop={(e) => handleDrop(e, word.toLowerCase())}
                  onDragOver={(e) => e.preventDefault()}
                  className={`w-1/2 h-10 border-[#1A1A86] border-2 rounded-md flex items-center justify-center ${getBorderColor(
                    word.toLowerCase()
                  )}`}
                >
                  {answers[word.toLowerCase()] && (
                    <motion.div
                      draggable
                      onDragStart={(e) => handleDragStart(e, answers[word.toLowerCase()])}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="px-2 py-1 w-full rounded-md cursor-grab text-center"
                    >
                      {answers[word.toLowerCase()]}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-10 items-center justify-center flex gap-4 flex-wrap">
            {options
              .filter((item) => !isOptionUsed(item))
              .map((item, index) => (
                <motion.div
                  key={index}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="px-5 py-2 bg-[#4DD0E18A] rounded-md cursor-grab text-center border border-black"
                >
                  {item}
                </motion.div>
              ))}
          </div>
          <div className="w-full max-w-md mt-20 flex items-end justify-end mr-15">
            <button
              onClick={GoToGreeting}
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
        </>
    </motion.div>
  );
};

export default Game03;
