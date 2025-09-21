"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  verifyToken,
  finishInitialLoad,
} from "@/redux/features/auth/authSlice";
import { Container } from "@/components/ui";
import { Spinner } from "@/components/common";

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // verifyToken maneja toda la lógica y actualiza el estado apropiadamente
        await dispatch(verifyToken()).unwrap();
      } catch (error) {
        // El error ya es manejado en el extraReducer rejected
      } finally {
        // Asegurar que el loading termine
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
