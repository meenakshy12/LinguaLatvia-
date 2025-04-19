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
    const input = `“māja” - House
“auto” - Car
“suns” - Dog
“kaķis” - Cat
“ūdens” - Water
“ēdiens” - Food
“draugs” - Friend
“skola” - School
“zieds” - Flower
“koks” - Tree`;

    useEffect(() => {
        setIsLoading(true);
        setTasks(ExtractTasks);
        setTimeout(() => {
            setIsLoading(false);
        }, 2000); // Simulate loading time
    }, []);

    const ExtractTasks = input.split('\n').map(line => {
        const match = line.match(/“(.+?)”\s*-\s*(.+)/);
        return match ? { lt: match[1], en: match[2] } : null;
    }).filter(Boolean);

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
            <div className='w-full max-w-md mt-72 flex items-end justify-end mr-5  '>
                <button onClick={nextTask} className='size-9 cursor-pointer bg-black rounded-full flex justify-center items-center'>
                    <IoIosArrowForward className='text-white text-3xl font-extrabold' />
                </button>
            </div>
        </div>
    )
}

export default Game01