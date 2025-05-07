import React, { useState, useEffect } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Loader from "../components/Loader";
import { toast } from "react-hot-toast";
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
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/game03`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: previousData }), // Send previous data to the API
        }
      );
      const { gameData, extraOption } = await response.json();
      const extraOp = extraOption.map((item) => item); // Extract extra options from the API response
      // console.log("Game data from API:", gameData,extraOp); // Log the fetched game data
      const combinedData =
        Array.isArray(gameData) && gameData.length > 0
          ? gameData.slice(0, 4) // Use API data if valid
          : [
              { answer: "māja", question: "House" },
              { answer: "auto", question: "Car" },
              { answer: "suns", question: "Dog" },
              { answer: "kaķis", question: "Cat" },
            ]; // Default data fallback

      const extraOptions =
        Array.isArray(extraOption) && extraOption.length > 0
          ? extraOption
          : ["grāmata", "skolas"]; // Add meaningful extra options in Latvian
      // console.log("Extra options:", extraOptions,typeof extraOptions); // Log the extra options
      const allOptions = shuffleArray([
        ...combinedData.map((item) => item.answer),
        ...(Array.isArray(extraOptions) ? extraOptions : []), // Ensure
        // extraOptions is an array before spreading
      ]);
      // console.log("All options:",allOptions)

      setData(combinedData);
      setQuestions(combinedData.map((item) => item.question));
      setOptions(allOptions); // Use the combined options
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
        { answer: "māja", question: "House" },
        { answer: "auto", question: "Car" },
        { answer: "suns", question: "Dog" },
        { answer: "kaķis", question: "Cat" },
      ];
      const extraOptions = ["grāmata", "skola"]; // Add meaningful extra options in Latvian
      const allOptions = shuffleArray([
        ...defaultData.map((item) => item.answer),
        ...extraOptions,
      ]);

      setData(defaultData);
      setQuestions(defaultData.map((item) => item.question));
      setOptions(allOptions); // Use the combined options
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
        Object.entries(prev).map(([key, value]) => [
          key,
          value === draggedAnswer ? "" : value,
        ])
      );
      return { ...updatedAnswers, [target]: draggedAnswer };
    });
    setValidated(true); // Automatically validate after drop
  };

  const handleDragStart = (e, value) => {
    e.dataTransfer.setData("text", value);
  };

  const handleTouchStart = (e, value) => {
    e.target.dataset.dragValue = value; // Store the value being dragged
  };

  const handleTouchMove = (e) => {
    e.preventDefault(); // Prevent default scrolling behavior
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    if (element) {
      element.classList.add("drag-over"); // Highlight potential drop target
    }
  };

  const handleTouchEnd = (e, target) => {
    const touch = e.changedTouches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    if (element && element.dataset.dropTarget === "true") {
      const draggedAnswer = e.target.dataset.dragValue;
      setAnswers((prev) => {
        const updatedAnswers = Object.fromEntries(
          Object.entries(prev).map(([key, value]) => [
            key,
            value === draggedAnswer ? "" : value,
          ])
        );
        return { ...updatedAnswers, [target]: draggedAnswer };
      });
      setValidated(true); // Automatically validate after drop
    }
  };

  const isOptionUsed = (option) => {
    return Object.values(answers).includes(option);
  };

  const getBorderColor = (question) => {
    const foundItem = data.find(
      (item) => item.question?.toLowerCase() === question
    );
    if (!foundItem) return "border-[#1A1A86]"; // Default border if no matching item is found

    const correctAnswer = foundItem.answer;
    const userAnswer = answers[question];
    if (!validated || !userAnswer) return "border-[#1A1A86]"; // Default border if not validated
    return userAnswer === correctAnswer ? "border-green-500" : "border-red-500";
  };

  const calculateScore = () => {
    let currentScore = 0;
    questions.forEach((q) => {
      const questionKey = q.toLowerCase();
      const foundItem = data.find(
        (item) => item.question?.toLowerCase() === questionKey
      );
      // console.log(
      //   "Found item:",
      //   foundItem,
      //   answers[questionKey],
      //   foundItem.answer
      // ); // Log the found item for debugging
      if (foundItem && answers[questionKey] === foundItem.answer) {
        currentScore += 12.5; // Each correct answer gives 12.5 points (50/4)
        // console.log(
        //   `Correct answer for ${q}: ${answers[questionKey]} (Score: ${currentScore})`
        // );
      }
    });
    return currentScore;
  };

  const GoToGreeting = () => {
    const allAnswered = Object.values(answers).every((answer) => answer !== "");

    if (!allAnswered) {
      toast.error("Please answer all questions before proceeding.");
      return;
    }

    // Filter only correctly answered questions
    const correctData = data.filter((item) => {
      const questionKey = item.question?.toLowerCase();
      return answers[questionKey] === item.answer;
    });

    saveToFirebaseGame03(correctData); // Save only correct answers to Firebase
    localStorage.setItem(
      "greeting",
      `Huraay!!\nYou have completed all matching game.\nYour score : ${calculateScore()}/50!`
    );
    setTimeout(() => {
      navigate("/greeting");
    }, 1000); // Navigate to the greeting page after a short delay
  };

  if (loading) return <Loader />; // Loading state

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md  mx-auto max-h-[100dvh] my-10"
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
          <p className="text-[#00000099] text-sm mb-6">
            (Hold the answer, then drag and drop it into the correct boxes)
          </p>
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
                onTouchMove={handleTouchMove}
                onTouchEnd={(e) => handleTouchEnd(e, word.toLowerCase())}
                data-drop-target="true"
                className={`w-1/2 h-10 border-[#1A1A86] border-2 rounded-md flex items-center justify-center ${getBorderColor(
                  word.toLowerCase()
                )}`}
              >
                {answers[word.toLowerCase()] && (
                  <motion.div
                    draggable
                    onDragStart={(e) =>
                      handleDragStart(e, answers[word.toLowerCase()])
                    }
                    onTouchStart={(e) =>
                      handleTouchStart(e, answers[word.toLowerCase()])
                    }
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
                onTouchStart={(e) => handleTouchStart(e, item)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="px-5 py-2 bg-[#4DD0E18A] rounded-md cursor-grab text-center border border-black"
              >
                {item}
              </motion.div>
            ))}
        </div>
        <div className="w-full max-w-md mt-20 flex items-end justify-end pr-10 mr-15">
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
