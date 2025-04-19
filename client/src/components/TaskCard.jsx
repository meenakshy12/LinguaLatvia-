import React from 'react'
import speaker from '../assets/tts.svg'

const TaskCard = ({data={en:"english",lt:"latvain"}}) => {
    const ConvertIntoTTS = () => {
        const utterance = new SpeechSynthesisUtterance(data.lt);
        utterance.lang = 'lv-LV'; // Set Latvian language accent
        speechSynthesis.speak(utterance);
    }
  return (
      <div className="w-full max-w-md mt-10 bg-[#4DD0E18A] relative rounded-[2rem] border border-black p-6 shadow-custom">
                    <button className="tts cursor-pointer size-8 absolute " onClick={ConvertIntoTTS}><img className='min-h-full min-w-full ' src={speaker} alt="speaker"  /></button>
                <div className=' flex gap-1 flex-col items-center py-4'>
                  <p className="text-xl font-semibold">"{data?.lt}"</p>
                  <p className="text-xl font-semibold">-{data?.en}</p>
              
                </div>
               
              </div>
  )
}

export default TaskCard