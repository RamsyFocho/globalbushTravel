"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Plane, User, LogIn } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import CurrencyDropdown from "@/components/CurrencyDropdown";
import { cn } from "@/lib/utils"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { href: "/flights", label: "Flights" },
    { href: "/hotels", label: "Hotels" },
    { href: "/packages", label: "Packages" },
    { href: "/visa", label: "Visa" },
    { href: "/transfers", label: "Transfers" },
  ]

  const isActiveLink = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/")
  }

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Plane className="h-8 w-8 text-grassland-600" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">Global Bush Travel</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "font-medium transition-colors relative py-2",
                  isActiveLink(item.href)
                    ? "text-grassland-600 dark:text-grassland-400"
                    : "text-gray-700 dark:text-gray-300 hover:text-grassland-600 dark:hover:text-grassland-400",
                )}
              >
                {item.label}
                {isActiveLink(item.href) && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-grassland-600 dark:bg-grassland-400 rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* User Menu & Theme Toggle */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <CurrencyDropdown />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hover:bg-grassland-50 dark:hover:bg-grassland-900">
                  <User className="h-4 w-4 mr-2" />
                  Account
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/login">Login</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/register">Sign Up</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile">My Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/bookings">My Bookings</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <div className="flex flex-col space-y-4 mt-8">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">Menu</span>
                  <ThemeToggle />
                </div>
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "font-medium py-2 px-3 rounded-md transition-colors",
                      isActiveLink(item.href)
                        ? "text-grassland-600 bg-grassland-50 dark:text-grassland-400 dark:bg-grassland-900"
                        : "text-gray-700 dark:text-gray-300 hover:text-grassland-600 hover:bg-grassland-50 dark:hover:text-grassland-400 dark:hover:bg-grassland-900",
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="border-t pt-4 space-y-2">
                  <Link
                    href="/login"
                    className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-grassland-600 dark:hover:text-grassland-400 py-2 px-3 rounded-md hover:bg-grassland-50 dark:hover:bg-grassland-900"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Login</span>
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-grassland-600 dark:hover:text-grassland-400 py-2 px-3 rounded-md hover:bg-grassland-50 dark:hover:bg-grassland-900"
                  >
                    <User className="h-4 w-4" />
                    <span>Sign Up</span>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
