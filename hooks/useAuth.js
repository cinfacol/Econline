import { useSelector, useDispatch } from "react-redux";
import { setAuth, setGuest, logout } from "@/redux/features/auth/authSlice";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, isGuest, isLoading, isAdmin } = useSelector(
    (state) => state.auth
  );

  const login = (userData = {}) => {
    dispatch(setAuth(userData));
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
    isAdmin,
    login,
    logout: logoutUser,
    setAsGuest,
  };
};
