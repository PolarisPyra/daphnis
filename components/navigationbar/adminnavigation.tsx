"use client";
import Link from "next/link";

import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin/home", label: "Home" },
  { href: "/admin/generateKeychip", label: "Generate Keychip" },
  { href: "/admin/unlockUser", label: "Unlock User" },
];

const AdminSubNavigation = () => {
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

export default AdminSubNavigation;
