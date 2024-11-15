"use client";

import { useRetrieveUserQuery } from "@/redux/features/auth/authApiSlice";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { Fragment, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { useLogoutMutation } from "@/redux/features/auth/authApiSlice";
import { logOut as setLogOut } from "@/redux/features/auth/authSlice";
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
  return classes.filter(Boolean).join(" ");
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
            {user.full_name}
          </span>
          <span className="text-xs text-gray-400 truncate max-w-[150px]">
            {user.email}
          </span>
        </div>
      );
    }

    return null;
  };

  const handleLogOut = async () => {
    try {
      await logout({}).unwrap();
      dispatch(setLogOut());
      toast.success("¡Sesión cerrada exitosamente!");
      router.push("/");
    } catch (error) {
      console.error("Error durante el cierre de sesión:", error);
      const message = error?.data?.error || "Ocurrió un error desconocido";
      toast.error(`Error al cerrar sesión: ${message}`);
    }
  };

  const authLinks = (isMobile) => (
    <>
      <MenuItem disabled>
        <span className="bg-gray-100 block px-4 py-2 text-center text-gray-700 border-b-2">
          {user?.full_name}
        </span>
      </MenuItem>
      <MenuItem>
        {({ focus }) => (
          <NavLink
            href="/dashboard"
            className={classNames(
              focus ? "bg-gray-100" : "",
              "flex px-4 py-2 text-sm text-gray-700"
            )}
          >
            <span className="group flex w-full items-center gap-2 data-[focus]:bg-white/10">
              <LayoutDashboardIcon className="size-4 mr-2 text-xs text-gray/50 group-data-[focus]:inline" />
              Dashboard
              <kbd className="ml-auto hidd font-sans text-xs text-gray/50 group-data-[focus]:inline">
                ⌘D
              </kbd>
            </span>
          </NavLink>
        )}
      </MenuItem>
      <MenuItem>
        {({ focus }) => (
          <NavLink
            href="/profile"
            className={classNames(
              focus ? "bg-gray-100" : "",
              "flex px-4 py-2 text-sm text-gray-700"
            )}
          >
            <span className="group flex w-full items-center gap-2 data-[focus]:bg-white/10">
              <UserPenIcon className="size-4 mr-2 text-xs text-gray/50 group-data-[focus]:inline" />
              Profile
              <kbd className="ml-auto hidd font-sans text-xs text-gray/50 group-data-[focus]:inline">
                ⌘P
              </kbd>
            </span>
          </NavLink>
        )}
      </MenuItem>
      <MenuItem>
        {({ focus }) => (
          <NavLink
            href="/settings"
            className={classNames(
              focus ? "bg-gray-100" : "",
              "flex px-4 py-2 text-sm text-gray-700"
            )}
          >
            <span className="group flex w-full items-center gap-2 data-[focus]:bg-white/10">
              <SettingsIcon className="size-4 mr-2 text-xs text-gray/50 group-data-[focus]:inline" />
              Settings
              <kbd className="ml-auto hidd font-sans text-xs text-gray/50 group-data-[focus]:inline">
                ⌘S
              </kbd>
            </span>
          </NavLink>
        )}
      </MenuItem>
      <MenuItem>
        {({ focus }) => (
          <NavLink
            className={classNames(
              focus ? "bg-gray-100" : "",
              "flex px-4 py-2 text-sm text-gray-700"
            )}
            onClick={handleLogOut}
          >
            <span className="group flex w-full items-center gap-2 data-[focus]:bg-white/10">
              <LogOutIcon className="size-4 mr-2 text-xs text-gray/50 group-data-[focus]:inline" />
              LogOut
              <kbd className="ml-auto hidd font-sans text-xs text-gray/50 group-data-[focus]:inline">
                ⌘L
              </kbd>
            </span>
          </NavLink>
        )}
      </MenuItem>
    </>
  );

  const guestLinks = (isMobile) => (
    <>
      <MenuItem>
        {({ focus }) => (
          <NavLink
            href="/auth/login"
            className={classNames(
              focus ? "bg-gray-100" : "",
              "flex px-4 py-2 text-sm text-gray-700"
            )}
          >
            <span className="group flex w-full items-center gap-2 data-[focus]:bg-white/10">
              <KeySquareIcon className="size-4 mr-2 text-xs text-gray/50 group-data-[focus]:inline" />
              Login
              <kbd className="ml-auto font-sans text-xs text-gray/50 group-data-[focus]:inline">
                ⌘L
              </kbd>
            </span>
          </NavLink>
        )}
      </MenuItem>
      <MenuItem>
        {({ focus }) => (
          <NavLink
            href="/auth/register"
            className={classNames(
              focus ? "bg-gray-100" : "",
              "flex px-4 py-2 text-sm text-gray-700"
            )}
          >
            <span className="group flex w-full items-center gap-2 data-[focus]:bg-white/10">
              <UserPlus className="size-4 mr-2 text-xs text-gray/50 group-data-[focus]:inline" />
              Register
              <kbd className="ml-auto font-sans text-xs text-gray/50 group-data-[focus]:inline">
                ⌘R
              </kbd>
            </span>
          </NavLink>
        )}
      </MenuItem>
    </>
  );
  return (
    <Menu as="div" className="relative ml-3">
      <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
        <span className="absolute -inset-1.5" />
        <span className="sr-only">Abrir menú de usuario</span>
        <Image
          className="h-8 w-8 rounded-full"
          width={44}
          height={44}
          src={user?.profile_photo || "/images/profile_default.png"}
          alt={user?.full_name || "Usuario"}
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
          {isAuthenticated ? authLinks : guestLinks}
        </MenuItems>
      </Transition>
    </Menu>
  );
}
