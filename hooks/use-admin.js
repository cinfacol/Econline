import { useAppSelector } from "@/redux/hooks";
import { useRetrieveUserQuery } from "@/redux/features/auth/authApiSlice";

export const useIsAdmin = () => {
  const { isAuthenticated, isGuest } = useAppSelector((state) => state.auth);
  const { data: user } = useRetrieveUserQuery(undefined, {
    skip: !isAuthenticated || isGuest,
  });

  const isAdmin = user?.is_admin || false;
  return isAuthenticated && isAdmin;
};

export const useAdminCheck = () => {
  const { isAuthenticated, isLoading, isGuest } = useAppSelector(
    (state) => state.auth
  );
  const { data: user, isLoading: userLoading } = useRetrieveUserQuery(
    undefined,
    {
      skip: !isAuthenticated || isGuest,
    }
  );

  const isAdmin = user?.is_admin || false;
  const totalLoading = isLoading || userLoading;

  return {
    isAdmin: isAuthenticated && isAdmin,
    isLoading: totalLoading,
    hasAdminAccess: isAuthenticated && isAdmin,
  };
};
