import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRegisterMutation } from "@/redux/features/auth/authApiSlice";
import { toast } from "sonner";

export default function useRegister() {
  const router = useRouter();
  const [register, { isLoading }] = useRegisterMutation();

  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    re_password: "",
  });

  const { username, first_name, last_name, email, password, re_password } =
    formData;

  const onChange = (event) => {
    const { name, value } = event.target;

    setFormData({ ...formData, [name]: value });
  };

  const onSubmit = (event) => {
    event.preventDefault();

    register({ username, first_name, last_name, email, password, re_password })
      .unwrap()
      .then(() => {
        toast.success("Please check email to verify account");
        router.push("/auth/login");
      })
      .catch(() => {
        toast.error("Failed to register account");
      });
  };

  return {
    username,
    first_name,
    last_name,
    email,
    password,
    re_password,
    isLoading,
    onChange,
    onSubmit,
  };
}
