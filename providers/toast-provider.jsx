"use client";
import { Toaster } from "sonner";

const ToastProvider = ({ children }) => {
  return (
    <>
      <Toaster />
      {children}
    </>
  );
};

export default ToastProvider;
