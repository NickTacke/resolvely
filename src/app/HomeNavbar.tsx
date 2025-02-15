"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

const HomeNavbar = () => {
  const [navbarShadow, setNavbarShadow] = useState(false); // State to control navbar shadow

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setNavbarShadow(true); // Add shadow if scrolled down
      } else {
        setNavbarShadow(false); // Remove shadow if at the top
      }
    };

    window.addEventListener("scroll", handleScroll); // Add scroll event listener

    return () => {
      window.removeEventListener("scroll", handleScroll); // Cleanup listener on unmount
    };
  }, []); // Empty dependency array means this effect runs only once on mount and unmount

  return (
    <header
      className={cn(
        "sticky top-0 z-20 bg-zinc-50 backdrop-blur-sm transition-shadow duration-200",
        navbarShadow ? "shadow-md" : "",
      )}
    >
      <div className="h-15 relative mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:mx-0 sm:max-w-full lg:mx-0 lg:max-w-full">
        <Link href="/" className="text-xl font-bold">
          <span className="text-primary">Resolvely</span>
        </Link>
        <nav className="hidden items-center space-x-6 md:flex">
          <Link
            href="/features"
            className="transition-colors hover:text-primary"
          >
            Features
          </Link>
          <Link
            href="/pricing"
            className="transition-colors hover:text-primary"
          >
            Pricing
          </Link>
          <Link href="/blog" className="transition-colors hover:text-primary">
            Blog
          </Link>
          <Link href="/docs" className="transition-colors hover:text-primary">
            Docs
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Link href="/auth/signin">
            <Button variant="ghost" size="sm">
              Login
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button size="sm" className="shiny-button">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export { HomeNavbar };
