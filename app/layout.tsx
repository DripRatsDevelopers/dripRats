import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Suspense } from "react";
import { Toaster } from "sonner";
import Footer from "./components/common/Footer";
import Navbar from "./components/common/NavBar";
import AuthGuard from "./components/common/ProtectedRoutes";
import "./globals.css";
import Providers from "./Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://driprats.com"),
  title: {
    default: "Driprats | Futuristic Luxury Jewelry",
    template: "%s | Driprats",
  },
  description:
    "Discover luxury jewelry reimagined for the future. Shop bold designs, futuristic styles, and premium craftsmanship with Driprats.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://driprats.com",
    siteName: "Driprats",
    title: "Driprats | Futuristic Luxury Jewelry",
    description: "Discover luxury jewelry reimagined for the future.",
    images: [
      {
        url: "https://driprats.com/og-home.jpg", //TODO
        width: 1200,
        height: 630,
        alt: "Driprats Futuristic Luxury Jewelry",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Driprats | Futuristic Luxury Jewelry",
    description: "Discover luxury jewelry reimagined for the future.",
    images: ["https://driprats.com/og-home.jpg"],
    site: "@driprats", //TODO
  },
  icons: {
    icon: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Driprats | Luxury Jewelry for the Future</title>
        <meta
          name="description"
          content="Designed to Stun, Engineered to Flex. Explore bold designs, high-quality pieces, and make your statement.Premium yet affordable"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://driprats.com" />
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places`}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Suspense fallback={<>Loading...</>}>
          <Providers>
            <Navbar />
            <AuthGuard>
              <div className="mt-3"> {children}</div>
              <Toaster position="bottom-right" richColors />{" "}
            </AuthGuard>
            <Footer />
          </Providers>
        </Suspense>
      </body>
    </html>
  );
}
