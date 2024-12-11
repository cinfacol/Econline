import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { useLoginMutation } from "@/redux/features/auth/authApiSlice";
import { setAuth, setUser } from "@/redux/features/auth/authSlice";
import { toast } from "sonner";
import { logger } from "@/services/logger";

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

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      logger.debug("Intentando login", { email });

      const response = await login({ email, password }).unwrap();
      logger.debug("Respuesta de login recibida", { response });

      if (response.status === "success" || response.tokens) {
        dispatch(setAuth());
        if (response.user) {
          dispatch(setUser(response.user));
        }

        toast.success(response.message || "Inicio de sesión exitoso");
        router.push("/dashboard");
      } else {
        throw new Error(response.message || "Error en el inicio de sesión");
      }
    } catch (error) {
      logger.error("Error en login", {
        error,
        context: {
          email,
          errorType: error?.name,
          statusCode: error?.status,
          errorData: error?.data,
        },
      });

      const errorMessage =
        error.data?.detail ||
        error.data?.message ||
        error.message ||
        "Error al iniciar sesión";

      toast.error(errorMessage);
    }
  };

  return {
    email,
    password,
    isLoading,
    onChange,
    onSubmit,
  };
}
