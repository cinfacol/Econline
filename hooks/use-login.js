import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { useLoginMutation } from "@/redux/features/auth/authApiSlice";
import { setAuth } from "@/redux/features/auth/authSlice";
import { toast } from "sonner";

export default function useLogin() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const onChange = (event) => {
    const { name, value } = event.target;

    setFormData({ ...formData, [name]: value });
  };

  const onSubmit = (event) => {
    event.preventDefault();

    login({ email, password })
      .unwrap()
      .then(() => {
        dispatch(setAuth());
        toast.success("Logged in successfully");
        router.push("/dashboard");
      })
      .catch(() => {
        toast.error("Failed to log in");
      });
  };

  return {
    email,
    password,
    isLoading,
    onChange,
    onSubmit,
  };
}
