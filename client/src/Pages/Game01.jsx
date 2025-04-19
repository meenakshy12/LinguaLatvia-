import React, { useEffect } from 'react'
import ProgressBricks from '../components/ProgressBricks';
import TaskCard from '../components/TaskCard';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';
import Loader from '../components/Loader';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // Import for animations

const Game01 = () => {
    const [currentTask, setCurrentTask] = React.useState(0);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = React.useState(true);
    const [tasks, setTasks] = React.useState([]);

const getApiData = async () => {

        try {
            const response = await fetch("http://localhost:4000/game01", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            return data.gameData;
        }
        catch (error) {
            console.error("Error fetching game data:", error);
            return null;
        }
    };
    useEffect(() => {
        console.log("Fetching tasks...");
        setIsLoading(true);

        const fetchAndProcessTasks = async () => {
            try {
                const extractedTasks = await getApiData();
                console.log("Extracted tasks:", extractedTasks);
                const defaultTasks = [
                    { lt: "māja", en: "House" },
                    { lt: "auto", en: "Car" },
                    { lt: "suns", en: "Dog" },
                    { lt: "kaķis", en: "Cat" },
                    { lt: "ūdens", en: "Water" },
                    { lt: "ēdiens", en: "Food" },
                    { lt: "draugs", en: "Friend" },
                    { lt: "skola", en: "School" },
                    { lt: "zieds", en: "Flower" },
                    { lt: "koks", en: "Tree" },
                ];

                const combinedTasks = [...extractedTasks, ...defaultTasks].slice(0, 10); // Ensure exactly 10 tasks
                setTasks(combinedTasks);
            } catch (error) {
                console.error("Error processing tasks:", error);
                setTasks([
                    { lt: "māja", en: "House" },
                    { lt: "auto", en: "Car" },
                    { lt: "suns", en: "Dog" },
                    { lt: "kaķis", en: "Cat" },
                    { lt: "ūdens", en: "Water" },
                    { lt: "ēdiens", en: "Food" },
                    { lt: "draugs", en: "Friend" },
                    { lt: "skola", en: "School" },
                    { lt: "zieds", en: "Flower" },
                    { lt: "koks", en: "Tree" },
                ]); // Fallback to predefined tasks
            } finally {
                setTimeout(() => {
                    setIsLoading(false);
                }, 2000); // Simulate loading time
            }
        };

        fetchAndProcessTasks();
    }, []);

    const getAnimationDirection = (isNext) => {
        return isNext
            ? { initial: { opacity: 0, y: 50 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -50 } } // Reduced distance
            : { initial: { opacity: 0, y: -50 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 50 } }; // Reduced distance
    };

    const nextTask = () => {
        if (currentTask < 9) {
            setCurrentTask((prev) => prev + 1);
        } else {
            localStorage.setItem("greeting", "Huraay!!\nYou have completed all tasks!");
            navigate('/greeting');
        }
    };

    const prevTask = () => {
        if (currentTask > 0) {
            setCurrentTask((prev) => prev - 1);
        } else {
            navigate("/");
        }
    };

    if (isLoading) {
        return (
            <Loader />
        );
    }
    return (
        <div className='flex flex-col justify-center relative items-center gap-7 mt-10'>
            <div className='w-full max-w-md flex items-start justify-start md:ml-0 ml-10'>
                <button onClick={prevTask} className='size-8 cursor-pointer bg-black rounded-lg flex justify-center items-center'>
                    <IoIosArrowBack className='text-white text-2xl font-extrabold' />
                </button>
            </div>
            <ProgressBricks current={currentTask + 1} />
            <div className="relative w-full max-w-md mx-2">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentTask}
                        {...getAnimationDirection(true)} // Always use the correct animation direction
                        transition={{ duration: 0.6, ease: "easeInOut" }} // Increased duration for smoother transition
                        className="absolute w-full"
                    >
                        <TaskCard data={tasks[currentTask]} />
                    </motion.div>
                </AnimatePresence>
            </div>
            <div className='w-full max-w-md mt-72 flex items-end justify-end mr-5'>
                <button onClick={nextTask} className='size-9 cursor-pointer bg-black rounded-full flex justify-center items-center'>
                    <motion.div
                        whileHover={{ x: 5 }} // Add horizontal animation on hover
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <IoIosArrowForward className='text-white text-3xl font-extrabold' />
                    </motion.div>
                </button>
            </div>
        </div>
    )
}

export default Game01