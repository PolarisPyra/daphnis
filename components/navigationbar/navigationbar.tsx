import React from "react";
import Link from "next/link";
import { CircleUser, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { getAuth } from "@/auth/queries/getauth";
import NavigationMenuDesktop from "./desktopNavBar";
import NavigationMenuMobile from "./mobileNavBar";
import { signOut } from "@/auth/components/signout";
import DarkToggle from "../darkmode";
const HeaderNavigation = async () => {
  const { user } = await getAuth();

  return (
    <>
      {user && (
        <header className="top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <NavigationMenuDesktop />
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <NavigationMenuMobile />
            </SheetContent>
          </Sheet>
          <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
            <div className="ml-auto flex-1 sm:flex-initial"></div>
            <DarkToggle />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full"
                >
                  <CircleUser className="h-5 w-5" />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link className="text-primary" href="/settings/home">
                    Settings
                  </Link>
                </DropdownMenuItem>
                {user.role === "ADMIN" && (
                  <DropdownMenuItem>
                    <Link className="text-primary" href="/admin/home">
                      Admin
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <form action={signOut}>
                  <Button className="bg-transparent pl-2 font-normal text-primary hover:bg-transparent">
                    Logout
                  </Button>
                </form>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
      )}
    </>
  );
};

export default HeaderNavigation;
