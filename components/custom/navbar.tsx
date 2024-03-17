"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { GitHubLogoIcon, HamburgerMenuIcon, InstagramLogoIcon } from "@radix-ui/react-icons";
import { ThemePicker } from "./themePicker";
import Link from "next/link";
import { Button } from "../ui/button";
import { ProtectedLink } from "./protectedLink";

export const Navbar = () => {

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl gap-2 items-center justify-between">
        <div className="mr-4 flex">
          <a className="mr-6 flex items-center space-x-2" href="/">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 256 256"
              className="h-6 w-6"
            >
              <rect width="256" height="256" fill="none"></rect>
              <line
                x1="208"
                y1="128"
                x2="128"
                y2="208"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="16"
              ></line>
              <line
                x1="192"
                y1="40"
                x2="40"
                y2="192"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="16"
              ></line>
            </svg>
            <span className="font-bold sm:inline-block">Nustfruta</span>
          </a>
          <nav className="hidden sm:flex items-center gap-6 text-sm">
            <Link
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              href="/new"
            >
              Place Order
            </Link>
            <ProtectedLink className="transition-colors hover:text-foreground/80 text-foreground/60" pathName="Manage Store" linkPath="/store"/>
          </nav>
        </div>
        <div className="xs:flex flex-1 hidden items-center justify-end space-x-2">
          <nav className="flex items-center">
            <a
              target="_blank"
              rel="noreferrer"
              href="https://github.com/TahaShah141"
            >
              <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 py-2 w-9 px-0">
                <GitHubLogoIcon className="h-4 w-4"/>
                <span className="sr-only">GitHub</span>
              </div>
            </a>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://www.instagram.com/tahashah327/"
            >
              <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 py-2 w-9 px-0">
                <InstagramLogoIcon className="h-4 w-4 fill-current" />
                <span className="sr-only">Instagram</span>
              </div>
            </a>
          </nav>
          <ThemePicker />
        </div>
        <div className="sm:hidden flex gap-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size={"icon"}><HamburgerMenuIcon /></Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Nustfruta</SheetTitle>
            </SheetHeader>
            <nav className="flex h-full flex-col items-center justify-center gap-4 text-md">
              <Link
                className="text-xl transition-colors hover:text-foreground/80 text-foreground/60"
                href="/new"
              >
                Place Order
              </Link>
              <ProtectedLink className="text-xl transition-colors hover:text-foreground/80 text-foreground/60" pathName="Manage Store" linkPath="/store" />
            </nav>
          </SheetContent>
        </Sheet>
        <div className="xs:hidden">
          <ThemePicker />
        </div>
        </div>
      </div>
    </header>
  );
};
