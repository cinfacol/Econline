"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyToken, finishInitialLoad, setGuest } from "@/redux/features/auth/authSlice";

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const result = await dispatch(verifyToken()).unwrap();
      } catch (error) {
        // Si falla la verificación, el usuario es guest
        dispatch(setGuest());
        dispatch(finishInitialLoad());
      }
    };

    initializeAuth();
  }, [dispatch]);

  if (isLoading) {
    return <div>Loading...</div>; // O tu componente de loading
  }

  return children;
};

export default AuthInitializer; 