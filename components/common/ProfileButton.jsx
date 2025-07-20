"use client";

import {
  useRetrieveUserQuery,
  useLogoutMutation,
} from "@/redux/features/auth/authApiSlice";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { Fragment, useEffect, useCallback, useMemo } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { logout as setLogout } from "@/redux/features/auth/authSlice";
import { NavLink } from "@/components/common";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  UserPlus,
  LogOutIcon,
  KeySquareIcon,
  LayoutDashboardIcon,
  UserPenIcon,
  SettingsIcon,
} from "lucide-react";
import classNames from "classnames";

function ProfileButton() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [logout] = useLogoutMutation();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const {
    data: user,
    isLoading,
    error,
  } = useRetrieveUserQuery(undefined, {
    skip: !isAuthenticated,
    pollingInterval: 300000, // Revalidar cada 5 minutos
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (
      error &&
      isAuthenticated &&
      error.status !== 401 &&
      error.status !== 403 && // Ignorar errores de permisos
      !error.message?.includes("unauthorized") // Ignorar mensajes de unauthorized
    ) {
      toast.error(
        error.data?.message ||
          error.message ||
          "Error al cargar información del usuario",
        {
          id: "user-info-error", // Evitar toasts duplicados
          duration: 3000,
        }
      );
    }
  }, [error, isAuthenticated]);

  const handleLogout = useCallback(async () => {
    try {
      await logout({}).unwrap();
      dispatch(setLogout());
      toast.success("¡Sesión cerrada exitosamente!");
      // Usar window.location.href para una redirección limpia
      window.location.href = "/";
    } catch (error) {
      const message = error?.data?.error || "Ocurrió un error desconocido";
      toast.error(`Error al cerrar sesión: ${message}`);
    }
  }, [logout, dispatch]);

  const renderUserInfo = useMemo(() => {
    if (isLoading) {
      return (
        <div className="hidden md:flex items-center space-x-2">
          <div className="h-4 w-24 bg-gray-600 animate-pulse rounded"></div>
        </div>
      );
    }

    if (isAuthenticated && user) {
      return (
        <div className="hidden md:flex flex-col items-end">
          <span className="text-sm font-medium text-gray-200 truncate max-w-[150px]">
            {user.full_name}
          </span>
          <span className="text-xs text-gray-400 truncate max-w-[150px]">
            {user.email}
          </span>
        </div>
      );
    }

    return null;
  }, [isLoading, isAuthenticated, user]);

  const menuItems = useMemo(() => {
    if (isAuthenticated) {
      return [
        {
          label: user?.email,
          disabled: true,
        },
        {
          label: "Dashboard",
          href: "/dashboard",
          icon: (
            <LayoutDashboardIcon className="size-4 mr-2 text-xs text-gray/50" />
          ),
        },
        {
          label: "Profile",
          href: "/profile",
          icon: <UserPenIcon className="size-4 mr-2 text-xs text-gray/50" />,
        },
        {
          label: "Settings",
          href: "/settings",
          icon: <SettingsIcon className="size-4 mr-2 text-xs text-gray/50" />,
        },
        {
          label: "Logout",
          onClick: handleLogout,
          icon: <LogOutIcon className="size-4 mr-2 text-xs text-gray/50" />,
        },
      ];
    } else {
      return [
        {
          label: "Login",
          href: "/auth/login",
          icon: <KeySquareIcon className="size-4 mr-2 text-xs text-gray/50" />,
        },
        {
          label: "Register",
          href: "/auth/register",
          icon: <UserPlus className="size-4 mr-2 text-xs text-gray/50" />,
        },
      ];
    }
  }, [isAuthenticated, user, handleLogout]);

  const handleNavigation = useCallback(
    (e, href, onClick) => {
      e.preventDefault();
      if (onClick) {
        onClick(e);
      }
      if (href) {
        const allowedUrls = [
          "/dashboard",
          "/profile",
          "/settings",
          "/auth/login",
          "/auth/register",
        ];
        if (allowedUrls.includes(href)) {
          router.push(href);
        } else {
          toast.error("URL no permitida");
        }
      }
    },
    [router]
  );

  return (
    <Menu as="div" className="relative ml-3">
      {({ close }) => (
        <>
          <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 cursor-pointer">
            <span className="absolute -inset-1.5" />
            <span className="sr-only">Abrir menú de usuario</span>
            <Avatar>
              <AvatarImage
                src={isAuthenticated && user?.profile_photo ? user.profile_photo : "/images/profile_default.png"}
                alt={isAuthenticated && user?.full_name ? user.full_name : "Usuario"}
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </MenuButton>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              {menuItems.map((item, index) => (
                <MenuItem key={index} disabled={item.disabled}>
                  {({ focus }) => (
                    <NavLink
                      onClick={(e) => {
                        close();
                        handleNavigation(e, item.href, item.onClick);
                      }}
                      className={classNames(
                        focus ? "bg-gray-100" : "",
                        "flex px-4 py-2 text-sm text-gray-700"
                      )}
                    >
                      <span className="group flex w-full items-center gap-2 data-[focus]:bg-white/10 cursor-pointer">
                        {item.icon}
                        {item.label}
                        {item.href && (
                          <kbd className="ml-auto font-sans text-xs text-gray-50 group-data-[focus]:inline">
                            ⌘{item.label.charAt(0)}
                          </kbd>
                        )}
                      </span>
                    </NavLink>
                  )}
                </MenuItem>
              ))}
            </MenuItems>
          </Transition>
        </>
      )}
    </Menu>
  );
}

export default ProfileButton;
