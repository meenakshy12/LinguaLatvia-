import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import Loader from './Loader';

const Middleware = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (!currentUser) {
        navigate('/login'); // Redirect to login page if no user
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