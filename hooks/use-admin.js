import { useAppSelector } from "@/redux/hooks";

export const useIsAdmin = () => {
  const { isAuthenticated, isAdmin } = useAppSelector((state) => state.auth);

  return isAuthenticated && isAdmin;
};

export const useAdminCheck = () => {
  const { isAuthenticated, isAdmin, isLoading } = useAppSelector(
    (state) => state.auth
  );

  return {
    isAdmin: isAuthenticated && isAdmin,
    isLoading,
    hasAdminAccess: isAuthenticated && isAdmin,
  };
};
