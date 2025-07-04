import type React from "react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://globalbushtravel.com"
  ),
  title: "GlobalBushTravel - Your Trusted Travel Partner",
  description:
    "Book flights, hotels, and vacation packages with GlobalBushTravel. Your trusted partner for global travel solutions.",
  keywords: ["travel", "flights", "hotels", "vacation packages", "booking"],
  openGraph: {
    title: "GlobalBushTravel - Your Trusted Travel Partner",
    description:
      "Book flights, hotels, and vacation packages with GlobalBushTravel.",
    url: process.env.NEXT_PUBLIC_BASE_URL || "https://globalbushtravel.com",
    siteName: "GlobalBushTravel",
    images: [
      {
        url: `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://globalbushtravel.com"
        }/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "GlobalBushTravel",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GlobalBushTravel - Your Trusted Travel Partner",
    description:
      "Book flights, hotels, and vacation packages with GlobalBushTravel.",
    images: [
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "https://globalbushtravel.com"
      }/og-image.jpg`,
    ],
  },
  alternates: {
    canonical:
      process.env.NEXT_PUBLIC_BASE_URL || "https://globalbushtravel.com",
  },
  other: {    
    "google-site-verification": "CUphQoizNcggu4344y_uj_j01MeIRAfuya9XjRoZOE0",
    urlTemplate: `${
      process.env.NEXT_PUBLIC_BASE_URL || "https://globalbushtravel.com"
    }/search?q={search_term_string}`,
  },
  authors: [{ name: "Global Bush Travel" }],
  creator: "Global Bush Travel",
  publisher: "Global Bush Travel",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  verification: {
    google: "CUphQoizNcggu4344y_uj_j01MeIRAfuya9XjRoZOE0",
    yandex: "your-yandex-verification-code",
  },
  generator: "bitsvalley",
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#22c55e" },
    { media: "(prefers-color-scheme: dark)", color: "#16a34a" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.png" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          <CurrencyProvider>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </CurrencyProvider>
          <Toaster />
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
            className="toast-container"
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
