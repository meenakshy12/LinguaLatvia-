import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Middleware from './components/Middleware'
import Login from './Pages/Login'
import SignUp from './Pages/SignUp'
import Chatbot from './Pages/Chatbot'
import { Toaster } from 'react-hot-toast'
import Wrapper from './components/Wrapper'
import Home from './Pages/Home'

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
            <Route path="*" element={<div className='flex justify-center items-center h-screen text-2xl font-bold'>404 Not Found</div>} />
        </Routes>
    
    </BrowserRouter>
    </>
  )
}

export default App
   