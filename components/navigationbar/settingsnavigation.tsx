"use client";
import Link from "next/link";

import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/settings/home", label: "General" },
  { href: "/settings/security", label: "Security" },
  { href: "/settings/versions", label: "Edit Game Version" },
];

const SettingsSubMenuNavigation = () => {
  const pathname = usePathname();

  return (
    <nav className="grid gap-4 text-sm text-muted-foreground">
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

export default SettingsSubMenuNavigation;
