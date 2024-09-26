"use client";
import Link from "next/link";

import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/home", label: "Home" },
  { href: "/chunithm", label: "Chunithm" },
];

const NavigationMenuDesktop = () => {
  const pathname = usePathname();

  return (
    <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
      {NAV_ITEMS.map(({ href, label }) => {
        const isActive = pathname === href;

        return (
          <Link
            key={href}
            href={href}
            className={`${
              isActive ? "font-semibold text-primary" : "text-muted-foreground"
            } text-sm`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
};

export default NavigationMenuDesktop;
