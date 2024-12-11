import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setAuth } from "@/redux/features/auth/authSlice";
import { useVerifyMutation } from "@/redux/features/auth/authApiSlice";

export default function useVerify() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  console.log("isAuthenticated", isAuthenticated);

  const [verify] = useVerifyMutation();

  useEffect(() => {
    // Solo ejecutamos la verificación si el usuario está autenticado
    if (isAuthenticated) {
      verify(undefined)
        .unwrap()
        .then(() => {
          dispatch(setAuth());
        })
        .catch((error) => {
          console.error("Error al verificar el token:", error);
          // Aquí podrías despachar una acción para manejar el error
        });
    } else {
      console.log("useVerify - No estás autenticado");
    }
  }, [isAuthenticated, verify, dispatch]);
}
