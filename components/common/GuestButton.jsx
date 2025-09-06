"use client";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { Fragment, useCallback } from "react";
import { NavLink } from "@/components/common";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { UserPlus, KeySquareIcon } from "lucide-react";
import classNames from "classnames";

export default function GuestButton() {
  const router = useRouter();

  const menuItems = [
    {
      label: "Iniciar sesión",
      href: "/auth/login",
      icon: <KeySquareIcon className="h-4 w-4" />,
    },
    {
      label: "Registrarse",
      href: "/auth/register",
      icon: <UserPlus className="h-4 w-4" />,
    },
  ];

  const handleNavigation = useCallback(
    (e, href, onClick) => {
      e.preventDefault();
      if (onClick) {
        onClick(e);
      }
      if (href) {
        const allowedUrls = ["/auth/login", "/auth/register"];
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
              <AvatarImage src="/images/default_avatar.svg" alt="Invitado" />
              <AvatarFallback>GU</AvatarFallback>
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
