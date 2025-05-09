import Link from "next/link";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

const NavLink = forwardRef(function NavLink(
  { isSelected, isMobile, isBanner, href, children, ...rest },
  ref
) {
  const className = cn(
    rest.className,
    "text-white rounded-md px-3 py-2 font-medium",
    {
      "bg-gray-900": isSelected,
      "text-gray-500 hover:bg-gray-700 hover:text-white":
        !isSelected && !isBanner,
      "block text-base": isMobile,
      "text-sm py 5": !isMobile,
      "text-gray-300": isBanner,
    }
  );

  if (!href) {
    return (
      <span
        className={className}
        role="button"
        onClick={rest.onClick}
        ref={ref}
      >
        {children}
      </span>
    );
  }

  return (
    <Link className={className} href={href} ref={ref}>
      {children}
    </Link>
  );
});

export default NavLink;
