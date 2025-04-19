import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Middleware from './components/Middleware'
import Login from './Pages/Login'
import SignUp from './Pages/SignUp'
import Chatbot from './Pages/Chatbot'
import { Toaster } from 'react-hot-toast'
import Wrapper from './components/Wrapper'
import Home from './Pages/Home'
import Game01 from './Pages/Game01'
import Greeting from './Pages/Greeting'
import Game02 from './Pages/Game02'

const App = () => {
  return (
    <>
    <BrowserRouter>

    <Toaster position="top-center" toastOptions={{ style: { background: "#fff", color: "#333" } }} />
        <Routes>
            <Route path="/" element={<Middleware><Wrapper><Home/></Wrapper></Middleware>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/signup" element={<SignUp/>} />
            <Route path="/chatbot" element={        <Middleware><Wrapper><Chatbot/></Wrapper></Middleware>} />
            <Route path="/game01" element={        <Middleware><Wrapper><Game01/></Wrapper></Middleware>} /> 
            <Route path="/game02" element={        <Middleware><Wrapper><Game02/></Wrapper></Middleware>} /> 
            <Route path="/greeting" element={<Middleware><Wrapper><Greeting /></Wrapper></Middleware>} />
            <Route path="*" element={<div className='flex justify-center items-center h-screen text-2xl font-bold'>404 Not Found</div>} />
        </Routes>
    
    </BrowserRouter>
    </>
  )
}

export default App
