import Link from "next/link"
import { Plane, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
             <Link href="/" className="flex items-center space-x-2">
            {/* <Plane className="h-8 w-8 text-purple-600" /> */}
            <Image
              src="/logo.png"
              alt="Global Bush Travel logo"
              width={64}
              height={64}
            />
            <span className="flex flex-col gap-[0.1rem] max-lg:hidden max-md:block">
              <span className="text-xl font-bold text-purple-900 dark:text-white max-lg:text-md line-clamp-1">
                Global Bush Travel
              </span>
              <span className="text-sm font-serif text-gray-900 dark:text-white max-lg:text-sm line-clamp-1">
                Travel and Tourism Company
              </span>

            </span>
          </Link>

            <p className="text-gray-300 dark:text-gray-400">
              Your trusted travel partner for flights, hotels, packages, and more. Making your travel dreams come true
              since 2020.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-300 dark:text-gray-400 hover:text-purple-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-300 dark:text-gray-400 hover:text-purple-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-300 dark:text-gray-400 hover:text-purple-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-300 dark:text-gray-400 hover:text-purple-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/flights" className="text-gray-300 dark:text-gray-400 hover:text-white transition-colors">
                  Flights
                </Link>
              </li>
              <li>
                <Link href="/hotels" className="text-gray-300 dark:text-gray-400 hover:text-white transition-colors">
                  Hotels
                </Link>
              </li>
              <li>
                <Link href="/packages" className="text-gray-300 dark:text-gray-400 hover:text-white transition-colors">
                  Holiday Packages
                </Link>
              </li>
              <li>
                <Link href="/visa" className="text-gray-300 dark:text-gray-400 hover:text-white transition-colors">
                  Visa Services
                </Link>
              </li>
              <li>
                <Link href="/transfers" className="text-gray-300 dark:text-gray-400 hover:text-white transition-colors">
                  Airport Transfers
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-gray-300 dark:text-gray-400 hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 dark:text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/bookings" className="text-gray-300 dark:text-gray-400 hover:text-white transition-colors">
                  Manage Booking
                </Link>
              </li>
              <li>
                <Link
                  href="/cancellation"
                  className="text-gray-300 dark:text-gray-400 hover:text-white transition-colors"
                >
                  Cancellation Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 dark:text-gray-400 hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-2 text-gray-300 dark:text-gray-400">
              <p>📧 info@globalbushtratour.com</p>
              <p>📞F: (+237) 233 47 70 00</p>
              <p>📞M: (+237) 677 24 66 24</p>
              <p>📍 Douala Cameroun Carrefour Eto’o Bonamoussadi</p>
              <p>🕒 24/7 Customer Support</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 dark:border-gray-700 mt-8 pt-8 text-center text-gray-300 dark:text-gray-400">
          <p>&copy; 2024 Global Bush Travel. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
