"use client";

import { useState } from "react";
import { useResetPasswordMutation } from "@/redux/features/auth/authApiSlice";
import { toast } from "sonner";

export default function useResetPassword() {
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const [email, setEmail] = useState("");

  const onChange = (event) => {
    setEmail(event.target.value);
  };

  const onSubmit = (event) => {
    event.preventDefault();

    resetPassword(email)
      .unwrap()
      .then(() => {
        toast.success("Request sent, check your email for reset link");
      })
      .catch(() => {
        toast.error("Failed to send request");
      });
  };

  return {
    email,
    isLoading,
    onChange,
    onSubmit,
  };
}
