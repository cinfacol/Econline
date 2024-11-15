import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setAuth } from "@/redux/features/auth/authSlice";
import { useVerifyMutation } from "@/redux/features/auth/authApiSlice";

export default function useVerify() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const [verify] = useVerifyMutation();

  useEffect(() => {
    // Solo ejecutamos la verificación si el usuario está autenticado
    if (isAuthenticated) {
      verify(undefined)
        .unwrap()
        .then(() => {
          dispatch(setAuth());
        });
    }
  }, [isAuthenticated]);
}
