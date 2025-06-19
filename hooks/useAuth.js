import { useSelector, useDispatch } from "react-redux";
import { setAuth, setGuest, logout } from "@/redux/features/auth/authSlice";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, isGuest, isLoading } = useSelector((state) => state.auth);

  const login = () => {
    dispatch(setAuth());
  };

  const logoutUser = () => {
    dispatch(logout());
  };

  const setAsGuest = () => {
    dispatch(setGuest());
  };

  return {
    isAuthenticated,
    isGuest,
    isLoading,
    login,
    logout: logoutUser,
    setAsGuest,
  };
}; 