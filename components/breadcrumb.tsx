"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"
import { Fragment } from "react"
import { cn } from "@/lib/utils"

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  const pathname = usePathname()

  // Generate breadcrumb items from pathname if not provided
  const breadcrumbItems = items || generateBreadcrumbItems(pathname)

  // Always show breadcrumbs except on homepage
  if (pathname === "/") {
    return null
  }

  return (
    <nav
      className={cn(
        "flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 px-4 py-3 rounded-lg",
        className,
      )}
      aria-label="Breadcrumb"
    >
      <Link
        href="/"
        className="flex items-center hover:text-grassland-600 dark:hover:text-grassland-400 transition-colors"
        aria-label="Home"
      >
        <Home className="h-4 w-4" />
        <span className="ml-1 hidden sm:inline">Home</span>
      </Link>

      {breadcrumbItems.map((item, index) => (
        <Fragment key={item.href}>
          <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
          {index === breadcrumbItems.length - 1 ? (
            <span className="font-medium text-grassland-700 dark:text-grassland-300 truncate" aria-current="page">
              {item.label}
            </span>
          ) : (
            <Link
              href={item.href}
              className="hover:text-grassland-600 dark:hover:text-grassland-400 transition-colors truncate"
            >
              {item.label}
            </Link>
          )}
        </Fragment>
      ))}
    </nav>
  )
}

function generateBreadcrumbItems(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean)
  const items: BreadcrumbItem[] = []

  // Enhanced route labels mapping
  const routeLabels: { [key: string]: string } = {
    flights: "Flights",
    hotels: "Hotels",
    packages: "Holiday Packages",
    visa: "Visa Services",
    transfers: "Airport Transfers",
    destinations: "Destinations",
    profile: "My Profile",
    bookings: "My Bookings",
    admin: "Admin Dashboard",
    dashboard: "Dashboard",
    login: "Sign In",
    register: "Sign Up",
    contact: "Contact Us",
    help: "Help Center",
    about: "About Us",
    search: "Search Results",
    details: "Details",
    booking: "Booking",
    confirmation: "Confirmation",
    payment: "Payment",
    checkout: "Checkout",
  }

  let currentPath = ""

  segments.forEach((segment, index) => {
    currentPath += `/${segment}`

    // Handle dynamic routes (IDs, etc.)
    let label = routeLabels[segment] || segment

    // If it looks like an ID (numbers/alphanumeric), use a generic label
    if (/^[a-zA-Z0-9-_]+$/.test(segment) && !routeLabels[segment]) {
      if (segments[index - 1]) {
        const parentSegment = segments[index - 1]
        if (parentSegment === "flights") label = "Flight Details"
        else if (parentSegment === "hotels") label = "Hotel Details"
        else if (parentSegment === "packages") label = "Package Details"
        else label = "Details"
      } else {
        label = segment.charAt(0).toUpperCase() + segment.slice(1)
      }
    }

    items.push({
      label,
      href: currentPath,
    })
  })

  return items
}
