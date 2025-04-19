import React, { useEffect } from 'react'
import ProgressBricks from '../components/ProgressBricks';
import TaskCard from '../components/TaskCard';
import { IoIosArrowForward,IoIosArrowBack  } from 'react-icons/io';
import Loader from '../components/Loader';
import { useNavigate } from 'react-router-dom';
import { set } from 'react-hook-form';


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
    // setIsLoading(false);
    setTimeout(() => {
        setIsLoading(false);
    }
, 2000); // Simulate loading time
    }, []);

const ExtractTasks = input.split('\n').map(line => {
  const match = line.match(/“(.+?)”\s*-\s*(.+)/);
  return match ? { lt: match[1], en: match[2] } : null;
}).filter(Boolean);

const nextTask = () => {
  if (currentTask < 9) {
    setCurrentTask(currentTask + 1);
  } else {
    navigate('/greeting?greeting=Hoorayy!!\nYou have completed all tasks!');
  }
}
const prevTask = () => {
    if (currentTask > 0) {
        setCurrentTask(currentTask - 1);
    } else{
        navigate("/")
    }
}

if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader/>
      </div>
    );
  }
  return (
   <div className='flex flex-col justify-center relative items-center gap-8 mt-10'>
   <div className='w-full max-w-md   flex items-start justify-start'>

<button onClick={prevTask} className='size-8 cursor-pointer bg-black rounded-lg flex justify-center items-center'><IoIosArrowBack  className='text-white text-2xl font-extrabold' /></button>
</div>
 <ProgressBricks current={currentTask+1}/>
   <TaskCard data={tasks[currentTask]}/>
   <div className='w-full max-w-md   flex items-end justify-end'>

   <button onClick={nextTask} className='size-9 cursor-pointer bg-black rounded-full flex justify-center items-center'><IoIosArrowForward className='text-white text-3xl font-extrabold' /></button>
   </div>
   </div>
  )
}

export default Game01