"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyToken, finishInitialLoad, setGuest } from "@/redux/features/auth/authSlice";
import { Container } from "@/components/ui";
import { Spinner } from "@/components/common";

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const result = await dispatch(verifyToken()).unwrap();
        // Ensure loading is finished even on success
        dispatch(finishInitialLoad());
      } catch (error) {
        // Si falla la verificación, el usuario es guest
        dispatch(setGuest());
        dispatch(finishInitialLoad());
      }
    };

    initializeAuth();
  }, [dispatch]);

  if (isLoading) {
    return (
      <Container className="bg-white overflow-hidden">
        <div className="flex justify-center items-center h-screen">
          <Spinner lg />
        </div>
      </Container>
    );
  }

  return children;
};

export default AuthInitializer; 