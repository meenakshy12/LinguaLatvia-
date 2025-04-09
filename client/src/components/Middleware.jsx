import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import Loader from './Loader';
import toast from 'react-hot-toast';

const Middleware = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate('/login'); // Redirect to login page if no user
      }else if(currentUser.emailVerified === false){
        toast.error("Please verify your email to access the app!"); // Show error message if email is not verified
        setTimeout(() => {
          navigate('/login'); // Redirect to verify email page if email is not verified
          
        setTimeout(() => {
          setLoading(false);
        }
        , 1000);
        }, 1000);
      }else{
        setUser(currentUser);
        setLoading(false); // Set loading to false if user is authenticated
      }

    });
    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return <div className='h-screen w-screen flex items-center justify-center gap-2 flex-col text-[#1B4A7E] font-semibold'> <Loader/>LinguaLatvia</div>; // Show a loading state during authentication process
  }

  return (
    <>
      {children}
    </>
  );
};

export default Middleware;