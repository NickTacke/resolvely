'use client'
import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "~/components/ui/button"
import { cn } from "~/lib/utils"

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

        window.addEventListener('scroll', handleScroll); // Add scroll event listener

        return () => {
        window.removeEventListener('scroll', handleScroll); // Cleanup listener on unmount
        };
    }, []); // Empty dependency array means this effect runs only once on mount and unmount

    return (
        <header className={cn("sticky top-0 bg-zinc-50 backdrop-blur-sm z-20 transition-shadow duration-200", navbarShadow ? "shadow-md" : "")}>
        <div className="flex mx-auto h-15 lg:mx-0 sm:mx-0 items-center justify-between py-3.5 px-5 max-w-7xl lg:max-w-full sm:max-w-full relative">
          <Link href="/" className="font-bold text-xl"><span className="text-primary">Resolvely</span></Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/features" className="hover:text-primary transition-colors">Features</Link>
            <Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link>
            <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
            <Link href="/docs" className="hover:text-primary transition-colors">Docs</Link>
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
    )
}

export { HomeNavbar }