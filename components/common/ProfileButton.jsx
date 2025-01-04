"use client";

import { useRetrieveUserQuery } from "@/redux/features/auth/authApiSlice";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { Fragment, useEffect, useCallback } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { useLogoutMutation } from "@/redux/features/auth/authApiSlice";
import { logout as setLogout } from "@/redux/features/auth/authSlice";
import { NavLink } from "@/components/common";
import Image from "next/image";
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

function classNames(...classes) {
  return classes.join(" ");
}

export default function ProfileButton() {
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
    if (error) {
      toast.error(error.message || "Error al cargar información del usuario");
    }
  }, [error]);

  const router = useRouter();

  const { profile_photo, full_name, email } = user || {};

  // Manejar estados de carga y error
  const renderUserInfo = () => {
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
            {full_name}
          </span>
          <span className="text-xs text-gray-400 truncate max-w-[150px]">
            {email}
          </span>
        </div>
      );
    }

    return null;
  };

  const handleLogout = useCallback(async () => {
    try {
      await logout({}).unwrap();
      dispatch(setLogout());
      toast.success("¡Sesión cerrada exitosamente!");
      router.push("/");
    } catch (error) {
      const message = error?.data?.error || "Ocurrió un error desconocido";
      toast.error(`Error al cerrar sesión: ${message}`);
    }
  }, [logout, dispatch, router]);

  const menuItems = isAuthenticated
    ? [
        {
          label: user?.full_name,
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
      ]
    : [
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

  return (
    <Menu as="div" className="relative ml-3">
      {({ close }) => (
        <>
          <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
            <span className="absolute -inset-1.5" />
            <span className="sr-only">Abrir menú de usuario</span>
            <Image
              className="h-8 w-8 rounded-full"
              width={44}
              height={44}
              src={profile_photo || "/images/profile_default.png"}
              alt={full_name || "Usuario"}
            />
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
                        e.preventDefault();
                        close();

                        if (item.onClick) {
                          item.onClick(e);
                        }

                        if (item.href) {
                          router.push(item.href);
                        }
                      }}
                      className={classNames(
                        focus ? "bg-gray-100" : "",
                        "flex px-4 py-2 text-sm text-gray-700"
                      )}
                    >
                      <span className="group flex w-full items-center gap-2 data-[focus]:bg-white/10">
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
