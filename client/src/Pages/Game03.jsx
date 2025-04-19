import React, { useState, useEffect } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const Game03 = () => {
  const [answers, setAnswers] = useState({});
  const [questions, setQuestions] = useState([]);
  const [options, setOptions] = useState([]);
  const [data, setData] = useState([]);
  const [validated, setValidated] = useState(false); // Track if validation is triggered
  const navigate = useNavigate();

  useEffect(() => {
    const initialData = [
      { question: "Hello", answer: "Sveiki" },
      { question: "Thank you", answer: "Paldies" },
      { question: "car 12 sada", answer: "auto 1" },
      { question: "house", answer: "māja" },
    ];

    setData(initialData);
    setQuestions(initialData.map((item) => item.question));
    setOptions(shuffleArray(initialData.map((item) => item.answer)));
    setAnswers(initialData.reduce((acc, item) => ({ ...acc, [item.question.toLowerCase()]: "" }), {}));
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

    // Debugging: Log the question, answer, and correctness
    const correctAnswer = data.find((item) => item.question.toLowerCase() === target)?.answer;
    console.log(`Question: ${target}`);
    console.log(`Dropped Answer: ${draggedAnswer}`);
    console.log(`Correct Answer: ${correctAnswer}`);
    console.log(draggedAnswer === correctAnswer ? "Correct!" : "Incorrect!");
  };

  const handleDragStart = (e, value) => {
    e.dataTransfer.setData("text", value);

    // Debugging: Log the dragged answer
    console.log(`Dragging Answer: ${value}`);
  };

  const isOptionUsed = (option) => {
    return Object.values(answers).includes(option);
  };

  const getBorderColor = (question) => {
    const correctAnswer = data.find((item) => item.question.toLowerCase() === question)?.answer;
    const userAnswer = answers[question];
    if (!validated || !userAnswer) return "border-[#1A1A86]"; // Default border if not validated
    // if (!userAnswer) return "border-red-400"; // Mark as incorrect if no answer is provided
    return userAnswer === correctAnswer ? "border-green-400" : "border-red-400";
  };

  const GoToGreeting = () => {
    const allAnswered = Object.values(answers).every((answer) => answer !== "");
    const allCorrect = questions.every((q) => {
      const questionKey = q.toLowerCase();
      const correctAnswer = data.find((item) => item.question.toLowerCase() === questionKey)?.answer;
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

    localStorage.setItem("greeting", "Huraay!!\nYou have completed all matching game!");
    navigate("/greeting");
  };

  return (
    <div className="w-full max-w-md mx-auto mt-10 ">
         <div className="w-full max-w-md flex items-start justify-start md:ml-0 ml-10">
                <button onClick={()=>navigate("/")} className="size-8 cursor-pointer bg-black rounded-lg flex justify-center items-center">
                  <IoIosArrowBack className="text-white text-2xl font-extrabold" />
                </button>
              </div>
      <div className="sm:mx-0 mx-5 mt-7">
      <h2 className="text-2xl font-semibold mb-1">Matching Game</h2>
      <p className="text-[#00000099] text-sm mb-6">(Drag the correct answer and drop it into the boxes)</p>
      </div>
      <div className="grid grid-cols-1 gap-4 pt-7 sm:mx-0 mx-5">
        {questions.map((word, index) => (
          <div key={index} className="flex items-center gap-4">
            <span className="text-[#1A1A86] text-xl  w-1/2">{word}</span>
            <div
              onDrop={(e) => handleDrop(e, word.toLowerCase())}
              onDragOver={(e) => e.preventDefault()}
              className={`w-1/2 h-10  border-[#1A1A86] border rounded-md flex items-center justify-center  ${getBorderColor(
                word.toLowerCase()
              )}`}
            >
              {answers[word.toLowerCase()] && (
                <div
                  draggable
                  onDragStart={(e) => handleDragStart(e, answers[word.toLowerCase()])}
                  className="px-2 py-1  w-full rounded-md cursor-grab text-center "
                >
                  {answers[word.toLowerCase()]}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-10 items-center justify-center flex gap-4 flex-wrap">
        {options
          .filter((item) => !isOptionUsed(item))
          .map((item, index) => (
            <div
              key={index}
              draggable
              onDragStart={(e) => handleDragStart(e, item)}
              className="px-5 py-2 bg-[#4DD0E18A] rounded-md cursor-grab text-center border border-black"
              >
              {item}
            </div>
          ))}
      </div>
      <div className="w-full max-w-md mt-20 flex items-end justify-end mr-15">
             <button onClick={GoToGreeting} className="size-9 cursor-pointer bg-black rounded-full flex justify-center items-center">
               <IoIosArrowForward className="text-white text-3xl font-extrabold" />
             </button>
           </div>
    </div>
  );
};

export default Game03;
