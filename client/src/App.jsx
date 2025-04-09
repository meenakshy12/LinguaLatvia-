import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Middleware from './components/Middleware'
import Login from './Pages/Login'
import SignUp from './Pages/SignUp'
import Chatbot from './Pages/Chatbot'
import { Toaster } from 'react-hot-toast'

const App = () => {
  return (
    <>
    <BrowserRouter>

    <Toaster position="top-center" toastOptions={{ style: { background: "#fff", color: "#333" } }} />
        <Routes>
            <Route path="/" element={<Middleware><Chatbot/></Middleware>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/signup" element={<SignUp/>} />
            <Route path="/chatbot" element={        <Middleware><Chatbot/></Middleware>} />
        </Routes>
    
    </BrowserRouter>
    </>
  )
}

export default App
   